/**
 * 响应式布局Hook - 提供屏幕尺寸检测和响应式状态管理
 */

import { useState, useEffect } from 'react';

// 屏幕尺寸断点定义
export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

// 屏幕尺寸信息接口
export interface ScreenInfo {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  currentBreakpoint: BreakpointKey;
  breakpoints: Record<BreakpointKey, boolean>;
}

/**
 * 获取当前断点
 */
const getCurrentBreakpoint = (width: number): BreakpointKey => {
  if (width >= BREAKPOINTS.xxl) return 'xxl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
};

/**
 * 生成断点状态对象
 */
const getBreakpointStates = (width: number): Record<BreakpointKey, boolean> => {
  return {
    xs: width >= BREAKPOINTS.xs,
    sm: width >= BREAKPOINTS.sm,
    md: width >= BREAKPOINTS.md,
    lg: width >= BREAKPOINTS.lg,
    xl: width >= BREAKPOINTS.xl,
    xxl: width >= BREAKPOINTS.xxl,
  };
};

/**
 * 响应式Hook
 */
export const useResponsive = (): ScreenInfo => {
  // 服务端渲染时使用默认值，避免hydration不匹配
  const getInitialScreenInfo = (): ScreenInfo => {
    const width = 1200; // 默认桌面尺寸
    const height = 800;
    
    return {
      width,
      height,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isLargeDesktop: false,
      currentBreakpoint: 'lg' as BreakpointKey,
      breakpoints: getBreakpointStates(width),
    };
  };

  const [screenInfo, setScreenInfo] = useState<ScreenInfo>(getInitialScreenInfo);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 标记为客户端环境
    setIsClient(true);
    
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenInfo({
        width,
        height,
        isMobile: width < BREAKPOINTS.md,
        isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
        isDesktop: width >= BREAKPOINTS.lg && width < BREAKPOINTS.xxl,
        isLargeDesktop: width >= BREAKPOINTS.xxl,
        currentBreakpoint: getCurrentBreakpoint(width),
        breakpoints: getBreakpointStates(width),
      });
    };

    // 节流处理
    let timeoutId: NodeJS.Timeout;
    const throttledResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', throttledResize);
      
      // 初始化时也触发一次
      handleResize();
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', throttledResize);
      }
      clearTimeout(timeoutId);
    };
  }, []);

  // 服务端渲染时返回默认值，客户端hydration后返回实际值
  return screenInfo;
};

/**
 * 媒体查询Hook
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  // 服务端渲染时返回false，客户端hydration后返回实际值
  if (!isClient) {
    return false;
  }

  return matches;
};

/**
 * 断点检测Hook
 */
export const useBreakpoint = (breakpoint: BreakpointKey): boolean => {
  const { breakpoints } = useResponsive();
  return breakpoints[breakpoint];
};

/**
 * 移动端检测Hook
 */
export const useIsMobile = (): boolean => {
  const { isMobile } = useResponsive();
  return isMobile;
};

/**
 * 获取响应式列配置
 */
export const useResponsiveColumns = () => {
  const { currentBreakpoint } = useResponsive();
  
  // Ant Design Grid 系统的响应式列配置
  const getColSpan = (
    xs = 24,
    sm = 12,
    md = 8,
    lg = 6,
    xl = 4,
    xxl = 3
  ) => {
    switch (currentBreakpoint) {
      case 'xs': return xs;
      case 'sm': return sm;
      case 'md': return md;
      case 'lg': return lg;
      case 'xl': return xl;
      case 'xxl': return xxl;
      default: return lg;
    }
  };

  return { getColSpan, currentBreakpoint };
};

/**
 * 获取响应式表格配置
 */
export const useResponsiveTable = () => {
  const { isMobile, isTablet } = useResponsive();
  
  const tableConfig = {
    size: isMobile ? 'small' as const : 'middle' as const,
    scroll: isMobile ? { x: 800 } : undefined,
    pagination: {
      pageSize: isMobile ? 5 : isTablet ? 8 : 10,
      showSizeChanger: !isMobile,
      showQuickJumper: !isMobile,
      simple: isMobile,
      showTotal: !isMobile ? (total: number) => `共 ${total} 条记录` : undefined,
    },
  };

  return tableConfig;
};

/**
 * 响应式间距配置
 */
export const useResponsiveSpacing = () => {
  const { currentBreakpoint } = useResponsive();
  
  const spacing = {
    xs: { gutter: [8, 8], cardSpacing: 8, sectionSpacing: 12 },
    sm: { gutter: [12, 12], cardSpacing: 12, sectionSpacing: 16 },
    md: { gutter: [16, 16], cardSpacing: 16, sectionSpacing: 20 },
    lg: { gutter: [20, 20], cardSpacing: 20, sectionSpacing: 24 },
    xl: { gutter: [24, 24], cardSpacing: 24, sectionSpacing: 32 },
    xxl: { gutter: [32, 32], cardSpacing: 32, sectionSpacing: 40 },
  };

  return spacing[currentBreakpoint];
};

export default useResponsive;