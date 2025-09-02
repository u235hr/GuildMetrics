import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * 容器尺寸信息接口
 */
interface ContainerDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

/**
 * 自适应容器配置接口
 */
interface AdaptiveContainerConfig {
  enableResize?: boolean;
  enableOverflowDetection?: boolean;
  debounceMs?: number;
  minWidth?: number;
  minHeight?: number;
}

/**
 * 溢出检测结果接口
 */
interface OverflowDetection {
  horizontal: boolean;
  vertical: boolean;
  scrollable: boolean;
  clipped: boolean;
}

/**
 * 自适应容器Hook
 * 提供容器尺寸监听、溢出检测和智能调整功能
 */
export const useAdaptiveContainer = (config: AdaptiveContainerConfig = {}) => {
  const {
    enableResize = true,
    enableOverflowDetection = true,
    debounceMs = 150,
    minWidth = 0,
    minHeight = 0
  } = config;

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<ContainerDimensions>({
    width: 0,
    height: 0,
    aspectRatio: 1
  });
  const [overflow, setOverflow] = useState<OverflowDetection>({
    horizontal: false,
    vertical: false,
    scrollable: false,
    clipped: false
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // 防抖更新尺寸
  const updateDimensions = useCallback(
    debounce((entries: ResizeObserverEntry[]) => {
      if (!containerRef.current) return;

      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const effectiveWidth = Math.max(width, minWidth);
        const effectiveHeight = Math.max(height, minHeight);
        
        setDimensions({
          width: effectiveWidth,
          height: effectiveHeight,
          aspectRatio: effectiveHeight > 0 ? effectiveWidth / effectiveHeight : 1
        });

        if (enableOverflowDetection) {
          detectOverflow();
        }

        if (!isInitialized) {
          setIsInitialized(true);
        }
      }
    }, debounceMs),
    [minWidth, minHeight, enableOverflowDetection, isInitialized, debounceMs]
  );

  // 检测容器内容溢出
  const detectOverflow = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    
    // 检查所有子元素
    const children = Array.from(container.children);
    let hasHorizontalOverflow = false;
    let hasVerticalOverflow = false;
    let hasScrollableContent = false;
    let hasClippedContent = false;

    children.forEach(child => {
      if (child instanceof HTMLElement) {
        const childRect = child.getBoundingClientRect();
        const style = getComputedStyle(child);

        // 检测水平溢出
        if (childRect.right > containerRect.right || childRect.left < containerRect.left) {
          hasHorizontalOverflow = true;
        }

        // 检测垂直溢出
        if (childRect.bottom > containerRect.bottom || childRect.top < containerRect.top) {
          hasVerticalOverflow = true;
        }

        // 检测滚动内容
        if (child.scrollWidth > child.clientWidth || child.scrollHeight > child.clientHeight) {
          hasScrollableContent = true;
        }

        // 检测被裁剪的内容
        if (style.overflow === 'hidden' || style.textOverflow === 'ellipsis') {
          hasClippedContent = true;
        }
      }
    });

    setOverflow({
      horizontal: hasHorizontalOverflow,
      vertical: hasVerticalOverflow,
      scrollable: hasScrollableContent,
      clipped: hasClippedContent
    });
  }, []);

  // 获取容器尺寸类别
  const getSizeCategory = useCallback(() => {
    const { width, height } = dimensions;
    
    if (width < 320) return 'xs';
    if (width < 480) return 'sm';
    if (width < 768) return 'md';
    if (width < 1024) return 'lg';
    if (width < 1440) return 'xl';
    return 'xxl';
  }, [dimensions]);

  // 获取响应式配置
  const getResponsiveConfig = useCallback(() => {
    const category = getSizeCategory();
    const { width, height, aspectRatio } = dimensions;

    return {
      category,
      isNarrow: width < 400,
      isWide: width > 1200,
      isTall: height > 800,
      isShort: height < 400,
      isLandscape: aspectRatio > 1.5,
      isPortrait: aspectRatio < 0.75,
      isSquare: aspectRatio >= 0.75 && aspectRatio <= 1.5,
      breakpoint: {
        xs: width >= 320,
        sm: width >= 480,
        md: width >= 768,
        lg: width >= 1024,
        xl: width >= 1440
      }
    };
  }, [dimensions, getSizeCategory]);

  // 设置ResizeObserver
  useEffect(() => {
    if (!enableResize || !containerRef.current) return;

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [enableResize, updateDimensions]);

  // 初始化时获取尺寸
  useEffect(() => {
    if (containerRef.current && !isInitialized) {
      const rect = containerRef.current.getBoundingClientRect();
      setDimensions({
        width: Math.max(rect.width, minWidth),
        height: Math.max(rect.height, minHeight),
        aspectRatio: rect.height > 0 ? rect.width / rect.height : 1
      });
      
      if (enableOverflowDetection) {
        detectOverflow();
      }
      
      setIsInitialized(true);
    }
  }, [minWidth, minHeight, enableOverflowDetection, detectOverflow, isInitialized]);

  return {
    containerRef,
    dimensions,
    overflow,
    isInitialized,
    sizeCategory: getSizeCategory(),
    responsiveConfig: getResponsiveConfig(),
    detectOverflow,
    // 便捷的尺寸检查方法
    isSmall: dimensions.width < 480,
    isMedium: dimensions.width >= 480 && dimensions.width < 1024,
    isLarge: dimensions.width >= 1024,
    // 便捷的溢出检查方法
    hasOverflow: overflow.horizontal || overflow.vertical,
    needsOptimization: overflow.horizontal || overflow.vertical || overflow.clipped
  };
};

/**
 * 防抖函数
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * 智能文本处理Hook
 */
export const useSmartTextProcessing = () => {
  // 智能数值格式化
  const formatValue = useCallback((value: number, options: {
    showCurrency?: boolean;
    useCompact?: boolean;
    maxLength?: number;
  } = {}): string => {
    const { showCurrency = false, useCompact = true, maxLength = 10 } = options;
    const prefix = showCurrency ? '￥' : '';
    
    if (!useCompact) {
      const formatted = value.toLocaleString();
      return prefix + (formatted.length > maxLength ? formatValue(value, { ...options, useCompact: true }) : formatted);
    }

    // 智能压缩格式
    if (value >= 100000000) { // 1亿+
      return `${prefix}${(value / 100000000).toFixed(1)}亿`;
    } else if (value >= 10000000) { // 1000万+
      return `${prefix}${(value / 10000000).toFixed(1)}千万`;
    } else if (value >= 1000000) { // 100万+
      return `${prefix}${(value / 10000).toFixed(0)}万`;
    } else if (value >= 10000) { // 1万+
      return `${prefix}${(value / 10000).toFixed(1)}万`;
    } else if (value >= 1000) { // 1000+
      return `${prefix}${(value / 1000).toFixed(1)}K`;
    } else {
      return `${prefix}${value}`;
    }
  }, []);

  // 智能文本截断
  const truncateText = useCallback((
    text: string, 
    maxLength: number,
    options: {
      preferWordBoundary?: boolean;
      ellipsis?: string;
      preserveWords?: boolean;
    } = {}
  ): string => {
    const { 
      preferWordBoundary = true, 
      ellipsis = '…', 
      preserveWords = true 
    } = options;

    if (!text || text.length <= maxLength) {
      return text;
    }

    let truncated = text.substring(0, maxLength - ellipsis.length);

    if (preferWordBoundary && preserveWords) {
      // 尝试在单词边界处截断
      const boundaries = [' ', ',', '.', '，', '。', '！', '？', ';', ':', '\n'];
      let bestCutPoint = -1;
      
      for (let i = truncated.length - 1; i >= maxLength * 0.6; i--) {
        if (boundaries.includes(truncated[i])) {
          bestCutPoint = i;
          break;
        }
      }
      
      if (bestCutPoint > 0) {
        truncated = truncated.substring(0, bestCutPoint);
      }
    }

    return truncated + ellipsis;
  }, []);

  // 根据容器宽度智能调整文本
  const adaptTextToContainer = useCallback((
    text: string,
    containerWidth: number,
    options: {
      fontSize?: number;
      charWidth?: number;
      padding?: number;
    } = {}
  ): string => {
    const { fontSize = 14, charWidth = 0.6, padding = 16 } = options;
    const effectiveWidth = containerWidth - padding;
    const estimatedCharWidth = fontSize * charWidth;
    const maxChars = Math.floor(effectiveWidth / estimatedCharWidth);
    
    return truncateText(text, maxChars);
  }, [truncateText]);

  return {
    formatValue,
    truncateText,
    adaptTextToContainer
  };
};

export default useAdaptiveContainer;