import React, { forwardRef, CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useAdaptiveContainer, useSmartTextProcessing } from '../hooks/useAdaptiveContainer';

/**
 * 自适应容器属性接口
 */
interface AdaptiveContainerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  preventOverflow?: boolean;
  enableResize?: boolean;
  enableOverflowDetection?: boolean;
  minWidth?: number;
  minHeight?: number;
  debounceMs?: number;
  onResize?: (dimensions: { width: number; height: number }) => void;
  onOverflow?: (overflow: { horizontal: boolean; vertical: boolean }) => void;
  'data-testid'?: string;
}

/**
 * 自适应容器组件
 * 提供智能的容器管理，包括尺寸监听、溢出检测和自动优化
 */
export const AdaptiveContainer = forwardRef<HTMLDivElement, AdaptiveContainerProps>(
  ({
    children,
    className = '',
    style = {},
    preventOverflow = true,
    enableResize = true,
    enableOverflowDetection = true,
    minWidth = 0,
    minHeight = 0,
    debounceMs = 150,
    onResize,
    onOverflow,
    'data-testid': testId,
    ...props
  }, externalRef) => {
    const {
      containerRef,
      dimensions,
      overflow,
      isInitialized,
      sizeCategory,
      responsiveConfig,
      hasOverflow,
      needsOptimization
    } = useAdaptiveContainer({
      enableResize,
      enableOverflowDetection,
      debounceMs,
      minWidth,
      minHeight
    });

    // 合并refs
    const ref = externalRef || containerRef;

    // 监听尺寸变化
    React.useEffect(() => {
      if (onResize && isInitialized) {
        onResize(dimensions);
      }
    }, [dimensions, onResize, isInitialized]);

    // 监听溢出变化
    React.useEffect(() => {
      if (onOverflow && enableOverflowDetection) {
        onOverflow({
          horizontal: overflow.horizontal,
          vertical: overflow.vertical
        });
      }
    }, [overflow.horizontal, overflow.vertical, onOverflow, enableOverflowDetection]);

    // 生成动态CSS类名
    const dynamicClasses = React.useMemo(() => {
      const classes = [];
      
      // 尺寸类别
      classes.push(`size-${sizeCategory}`);
      
      // 响应式类别
      if (responsiveConfig.isNarrow) classes.push('is-narrow');
      if (responsiveConfig.isWide) classes.push('is-wide');
      if (responsiveConfig.isTall) classes.push('is-tall');
      if (responsiveConfig.isShort) classes.push('is-short');
      
      // 方向类别
      if (responsiveConfig.isLandscape) classes.push('is-landscape');
      if (responsiveConfig.isPortrait) classes.push('is-portrait');
      if (responsiveConfig.isSquare) classes.push('is-square');
      
      // 状态类别
      if (hasOverflow) classes.push('has-overflow');
      if (needsOptimization) classes.push('needs-optimization');
      if (overflow.horizontal) classes.push('overflow-horizontal');
      if (overflow.vertical) classes.push('overflow-vertical');
      if (overflow.scrollable) classes.push('has-scrollable');
      if (overflow.clipped) classes.push('has-clipped');
      
      return classes;
    }, [sizeCategory, responsiveConfig, hasOverflow, needsOptimization, overflow]);

    // 生成动态样式
    const dynamicStyle = React.useMemo(() => {
      const adaptiveStyle: CSSProperties = {};
      
      // 防溢出样式
      if (preventOverflow) {
        adaptiveStyle.overflow = 'hidden';
        adaptiveStyle.minWidth = 0;
      }
      
      // 最小尺寸约束
      if (minWidth > 0) {
        adaptiveStyle.minWidth = minWidth;
      }
      if (minHeight > 0) {
        adaptiveStyle.minHeight = minHeight;
      }
      
      // 响应式字体大小
      if (responsiveConfig.isNarrow) {
        adaptiveStyle.fontSize = 'clamp(0.75rem, 2.5vw, 0.875rem)';
      } else if (responsiveConfig.isWide) {
        adaptiveStyle.fontSize = 'clamp(0.875rem, 1.5vw, 1rem)';
      }
      
      return { ...adaptiveStyle, ...style };
    }, [preventOverflow, minWidth, minHeight, responsiveConfig, style]);

    return (
      <div
        ref={ref}
        className={cn(
          'adaptive-container',
          dynamicClasses,
          className
        )}
        style={dynamicStyle}
        data-testid={testId}
        data-size-category={sizeCategory}
        data-width={dimensions.width}
        data-height={dimensions.height}
        data-has-overflow={hasOverflow}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AdaptiveContainer.displayName = 'AdaptiveContainer';

/**
 * 自适应文本组件属性接口
 */
interface AdaptiveTextProps {
  children: string;
  className?: string;
  style?: CSSProperties;
  maxLength?: number;
  enableTruncation?: boolean;
  showTooltip?: boolean;
  formatNumber?: boolean;
  truncationOptions?: {
    preferWordBoundary?: boolean;
    ellipsis?: string;
    preserveWords?: boolean;
  };
  numberOptions?: {
    showCurrency?: boolean;
    useCompact?: boolean;
    maxLength?: number;
  };
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  'data-testid'?: string;
}

/**
 * 自适应文本组件
 * 提供智能的文本显示，包括自动截断、数值格式化和工具提示
 */
export const AdaptiveText = forwardRef<HTMLElement, AdaptiveTextProps>(
  ({
    children,
    className = '',
    style = {},
    maxLength,
    enableTruncation = true,
    showTooltip = true,
    formatNumber = false,
    truncationOptions = {},
    numberOptions = {},
    as: Component = 'span',
    'data-testid': testId,
    ...props
  }, ref) => {
    const { formatValue, truncateText, adaptTextToContainer } = useSmartTextProcessing();
    const { containerRef, dimensions } = useAdaptiveContainer({
      enableResize: true,
      enableOverflowDetection: false
    });

    // 处理文本内容
    const processedText = React.useMemo(() => {
      let text = children;

      // 数值格式化
      if (formatNumber) {
        const numValue = parseFloat(text);
        if (!isNaN(numValue)) {
          text = formatValue(numValue, numberOptions);
        }
      }

      // 文本截断
      if (enableTruncation) {
        if (maxLength) {
          text = truncateText(text, maxLength, truncationOptions);
        } else if (dimensions.width > 0) {
          text = adaptTextToContainer(text, dimensions.width);
        }
      }

      return text;
    }, [
      children,
      formatNumber,
      enableTruncation,
      maxLength,
      dimensions.width,
      formatValue,
      truncateText,
      adaptTextToContainer,
      numberOptions,
      truncationOptions
    ]);

    // 是否需要显示工具提示
    const needsTooltip = showTooltip && processedText !== children && processedText.includes('…');

    const elementProps = {
      ref: ref as any,
      className: cn('adaptive-text', className),
      style,
      title: needsTooltip ? children : undefined,
      'data-testid': testId,
      'data-original-length': children.length,
      'data-processed-length': processedText.length,
      'data-truncated': processedText !== children,
      ...props
    };

    return React.createElement(Component, elementProps, processedText);
  }
);

AdaptiveText.displayName = 'AdaptiveText';

/**
 * 自适应网格组件属性接口
 */
interface AdaptiveGridProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  minItemWidth?: number;
  maxColumns?: number;
  gap?: string;
  autoFit?: boolean;
  'data-testid'?: string;
}

/**
 * 自适应网格组件
 * 提供智能的网格布局，根据容器宽度自动调整列数
 */
export const AdaptiveGrid = forwardRef<HTMLDivElement, AdaptiveGridProps>(
  ({
    children,
    className = '',
    style = {},
    minItemWidth = 200,
    maxColumns = 6,
    gap = '1rem',
    autoFit = true,
    'data-testid': testId,
    ...props
  }, externalRef) => {
    const { containerRef, dimensions } = useAdaptiveContainer({
      enableResize: true,
      enableOverflowDetection: false
    });

    const ref = externalRef || containerRef;

    // 将像素转换为 rem，避免在 CSS 中直接使用 px
    const pxToRem = (px: number) => `${(px / 16).toFixed(4)}rem`;

    // 计算网格配置（仅用于提供 data-columns 等信息，不影响实际 CSS 布局）
    const gridConfig = React.useMemo(() => {
      const { width } = dimensions;

      if (width === 0) {
        return {
          columns: 1,
          gridTemplateColumns: '1fr'
        };
      }

      // 仅用于信息展示的列数估算：使用容器宽度与最小项宽度（px）估算，不影响渲染样式
      const estimatedColumns = Math.max(1, Math.floor(width / Math.max(minItemWidth, 1)));
      const columns = Math.min(estimatedColumns, Math.max(1, maxColumns));

      // 使用 rem 作为最小项宽度，避免任何 px 单位
      const minWidthRem = pxToRem(minItemWidth);

      const gridTemplateColumns = autoFit
        ? `repeat(auto-fit, minmax(${minWidthRem}, 1fr))`
        : `repeat(${columns}, minmax(${minWidthRem}, 1fr))`;

      return {
        columns,
        gridTemplateColumns
      };
    }, [dimensions.width, minItemWidth, maxColumns, autoFit]);

    const gridStyle: CSSProperties = {
      display: 'grid',
      gridTemplateColumns: gridConfig.gridTemplateColumns,
      gap,
      ...style
    };

    return (
      <div
        ref={ref}
        className={cn('adaptive-grid', className)}
        style={gridStyle}
        data-testid={testId}
        data-columns={gridConfig.columns}
        data-width={dimensions.width}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AdaptiveGrid.displayName = 'AdaptiveGrid';

export default AdaptiveContainer;