// 星汇漫舞数据大屏设计系统 - UI美学优化版

// 数据大屏专业色彩体系
export const colors = {
  // 主题色调 - 深邃星空蓝系列
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // 主色
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e3a8a',  // 深邃蓝
    900: '#1e40af',
    950: '#0a1628',  // 星空深蓝
  },
  
  // 次要色 - 霓虹紫系列
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff', 
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',  // 霓虹紫
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
    950: '#5b21b6',  // 深紫
  },
  
  // 强调色 - 活力橙系列
  accent: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',  // 活力橙
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  
  // 成功色 - 翠绿系列
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    main: '#10b981',    // 翠绿主色
    bright: '#059669',  // 亮绿
  },
  
  // 警告色 - 琥珀金系列
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',  // 琥珀金
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // 错误色 - 珊瑚红系列
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',  // 珊瑚红
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // 中性色系
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // 深色主题色系
  dark: {
    50: '#0a1628',   // 背景深蓝
    100: '#1e293b',  // 卡片背景
    200: '#334155',  // 边框色
    300: '#475569',
    400: '#64748b',
    500: '#94a3b8',
    600: '#cbd5e1',
    700: '#e2e8f0',
    800: '#f1f5f9',
    900: '#f8fafc',
  },
  
  // 基础色
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
};

// 数据大屏专业渐变色系统
export const gradients = {
  // 主背景渐变
  background: 'linear-gradient(135deg, #0a1628 0%, #1e293b 25%, #334155 100%)',
  
  // 卡片背景渐变
  card: 'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
  
  // 悬浮效果渐变
  hover: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
  
  // 主题色渐变
  primary: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
  secondary: 'linear-gradient(135deg, #5b21b6 0%, #8b5cf6 100%)',
  accent: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
  
  // 数据可视化渐变
  ranking: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #f97316 100%)',
  achievement: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  dataValue: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
  
  // 冠军特效渐变
  champion: 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ef4444 100%)',
  
  // 亚军季军渐变
  runnerUp: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  thirdPlace: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
  
  // 玻璃态效果
  glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
  glassCard: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
  
  // 特殊效果渐变
  glow: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%)',
  particle: 'linear-gradient(45deg, rgba(251, 191, 36, 0.8) 0%, rgba(245, 158, 11, 0.8) 100%)',
  
  // 文字渐变
  textGold: 'linear-gradient(90deg, #f59e0b 0%, #f97316 50%, #ef4444 100%)',
  textBlue: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
  textWhite: 'linear-gradient(90deg, #ffffff 0%, #f0f9ff 100%)',
};

// 字体系统 - 数据大屏专用层级
export const typography = {
  fontFamily: {
    sans: ['Inter', 'PingFang SC', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'Source Code Pro', 'monospace'],
    display: ['Inter', 'PingFang SC', 'system-ui', 'sans-serif'],
  },
  
  // 大屏特化字体尺寸系统
  fontSize: {
    // 基础尺寸
    xs: 'clamp(0.75rem, 1.5vw, 0.875rem)',     // 12-14px
    sm: 'clamp(0.875rem, 2vw, 1rem)',        // 14-16px
    base: 'clamp(1rem, 2.5vw, 1.125rem)',    // 16-18px
    lg: 'clamp(1.125rem, 3vw, 1.25rem)',     // 18-20px
    xl: 'clamp(1.25rem, 3.5vw, 1.5rem)',     // 20-24px
    
    // 标题尺寸
    '2xl': 'clamp(1.5rem, 4vw, 1.875rem)',   // 24-30px
    '3xl': 'clamp(1.875rem, 5vw, 2.25rem)',  // 30-36px
    '4xl': 'clamp(2.25rem, 6vw, 3rem)',      // 36-48px
    '5xl': 'clamp(3rem, 8vw, 3.75rem)',      // 48-60px
    '6xl': 'clamp(3.75rem, 10vw, 4.5rem)',   // 60-72px
    
    // 数据大屏专用尺寸
    'display-lg': 'clamp(24px, 4vw, 36px)',   // 大屏标题
    'display-md': 'clamp(18px, 3vw, 24px)',   // 区域标题
    'display-sm': 'clamp(16px, 2.5vw, 20px)', // 卡片标题
    'display-xs': 'clamp(14px, 2vw, 16px)',   // 数据标签
    
    // 数值展示专用
    'data-xl': 'clamp(20px, 4vw, 32px)',      // 主要数值
    'data-lg': 'clamp(16px, 3vw, 24px)',      // 次要数值
    'data-sm': 'clamp(12px, 2vw, 14px)',      // 说明文字
  },
  
  fontWeight: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  
  lineHeight: {
    none: 1,
    tight: 1.2,    // 标题用
    snug: 1.3,     // 副标题用
    normal: 1.4,   // 卡片标题用
    relaxed: 1.5,  // 正文用
    loose: 1.625,  // 说明文字用
  },
  
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

// 间距系统
export const spacing = {
  0: '0px',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
  40: '10rem',    // 160px
  48: '12rem',    // 192px
  56: '14rem',    // 224px
  64: '16rem',    // 256px
};

// 圆角配置
export const borderRadius = {
  sm: 'clamp(0.25rem, 0.5vw, 0.25rem)',
  md: 'clamp(0.5rem, 1vw, 0.5rem)',
  lg: 'clamp(0.75rem, 1.5vw, 0.75rem)',
  xl: 'clamp(1rem, 2vw, 1rem)',
  '2xl': 'clamp(1.5rem, 3vw, 1.5rem)',
  full: '9999px',
};

// 数据大屏阴影系统
export const shadows = {
  // 基础阴影
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
  
  // 数据大屏专用发光阴影
  glow: '0 0 clamp(20px, 4vw, 30px) rgba(59, 130, 246, 0.3)',
  glowLg: '0 0 clamp(40px, 8vw, 60px) rgba(59, 130, 246, 0.4)',
  glowPurple: '0 0 clamp(20px, 4vw, 30px) rgba(168, 85, 247, 0.3)',
  glowOrange: '0 0 clamp(20px, 4vw, 30px) rgba(251, 146, 60, 0.3)',
  glowGold: '0 0 clamp(30px, 6vw, 45px) rgba(251, 191, 36, 0.6)',
  
  // 卡片阴影系统
  card: '0 clamp(4px, 1vw, 8px) clamp(20px, 4vw, 32px) rgba(0, 0, 0, 0.08)',
  cardHover: '0 clamp(8px, 2vw, 16px) clamp(30px, 6vw, 48px) rgba(0, 0, 0, 0.12)',
  cardFloat: '0 clamp(12px, 3vw, 24px) clamp(40px, 8vw, 64px) rgba(0, 0, 0, 0.15)',
  
  // 玻璃态阴影
  glass: '0 clamp(8px, 2vw, 16px) clamp(32px, 6vw, 48px) rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  glassInner: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
  
  // 排名奖牌阴影
  champion: '0 0 clamp(30px, 6vw, 45px) rgba(251, 191, 36, 0.6), 0 clamp(8px, 2vw, 16px) clamp(24px, 5vw, 40px) rgba(245, 158, 11, 0.4)',
  medal: '0 clamp(4px, 1vw, 8px) clamp(16px, 3vw, 24px) rgba(0, 0, 0, 0.2)',
  
  // 动态阴影效果
  pulse: '0 0 0 clamp(4px, 1vw, 8px) rgba(59, 130, 246, 0.3)',
  ripple: '0 0 0 clamp(20px, 4vw, 30px) rgba(59, 130, 246, 0.2)',
};

// 数据大屏动效系统
export const animations = {
  // 动画时长
  duration: {
    fastest: '100ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms',
    
    // 数据动画专用
    dataCount: '1200ms',  // 数字滚动
    pageLoad: '800ms',    // 页面加载
    cardEnter: '600ms',   // 卡片进入
    hoverFast: '200ms',   // 快速悬浮
  },
  
  // 缓动函数
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    
    // 高级缓动
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    dramatic: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    
    // 数据专用缓动
    dataEnter: 'cubic-bezier(0.4, 0, 0.2, 1)',    // 数据进入
    countUp: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // 数字递增
    float: 'cubic-bezier(0.4, 0, 0.6, 1)',         // 浮动效果
  },
  
  // 关键帧动画名称
  keyframes: {
    fadeIn: 'fadeIn',
    slideUp: 'slideUp',
    slideDown: 'slideDown',
    slideLeft: 'slideLeft',
    slideRight: 'slideRight',
    scaleIn: 'scaleIn',
    scaleOut: 'scaleOut',
    rotate: 'rotate',
    pulse: 'pulse',
    bounce: 'bounce',
    shake: 'shake',
    glow: 'glow',
    float: 'float',
    shimmer: 'shimmer',
    countUp: 'countUp',
    sparkle: 'sparkle',
    ripple: 'ripple',
  },
};

// 断点配置
export const breakpoints = {
  sm: '40rem',
  md: '48rem',
  lg: '64rem',
  xl: '80rem',
  '2xl': '96rem',
};

// Z-index 层级
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

// 数据大屏组件样式预设
export const components = {
  // 玻璃态卡片系统
  glassCard: {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.16)',
    borderRadius: 'clamp(12px, 2vw, 20px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // 玻璃态卡片悬浮效果
  glassCardHover: {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    background: 'rgba(255, 255, 255, 0.12)',
  },
  
  // 按钮系统
  button: {
    primary: {
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      color: '#ffffff',
      borderRadius: 'clamp(8px, 1.5vw, 12px)',
      border: 'none',
      boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)',
      fontSize: 'clamp(14px, 2.5vw, 16px)',
      fontWeight: 600,
    },
    
    primaryHover: {
      background: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
    },
    
    secondary: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: '#ffffff',
      borderRadius: 'clamp(8px, 1.5vw, 12px)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)',
      fontSize: 'clamp(14px, 2.5vw, 16px)',
      fontWeight: 500,
    },
  },
  
  // 排名奖牌系统
  medal: {
    champion: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ef4444 100%)',
      boxShadow: '0 0 30px rgba(251, 191, 36, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      border: '2px solid rgba(251, 191, 36, 0.8)',
      animation: 'pulse 2s infinite, glow 3s ease-in-out infinite',
    },
    
    runnerUp: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
      border: '2px solid rgba(59, 130, 246, 0.6)',
      animation: 'glow 4s ease-in-out infinite',
    },
    
    thirdPlace: {
      background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
      boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)',
      border: '2px solid rgba(16, 185, 129, 0.6)',
      animation: 'glow 5s ease-in-out infinite',
    },
  },
  
  // 数据展示卡片
  dataCard: {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.16)',
    borderRadius: 'clamp(16px, 3vw, 24px)',
    padding: 'clamp(16px, 4vw, 32px)',
    position: 'relative',
    overflow: 'hidden',
  },
  
  // 数值文字样式
  dataText: {
    primary: {
      fontSize: 'clamp(20px, 4vw, 32px)',
      fontWeight: 700,
      background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    
    secondary: {
      fontSize: 'clamp(16px, 3vw, 24px)',
      fontWeight: 600,
      color: 'rgba(255, 255, 255, 0.9)',
    },
    
    label: {
      fontSize: 'clamp(12px, 2vw, 14px)',
      fontWeight: 400,
      color: 'rgba(255, 255, 255, 0.8)',
    },
  },
  
  // 表格系统
  table: {
    container: {
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.16)',
      borderRadius: 'clamp(12px, 2vw, 20px)',
      overflow: 'hidden',
    },
    
    header: {
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
      borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
      padding: 'clamp(12px, 3vw, 16px)',
      fontWeight: 600,
      fontSize: 'clamp(14px, 2.5vw, 16px)',
      color: 'rgba(255, 255, 255, 0.9)',
    },
    
    row: {
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: 'clamp(8px, 2vw, 12px)',
      transition: 'all 0.2s ease',
    },
    
    rowHover: {
      background: 'rgba(59, 130, 246, 0.05)',
      transform: 'translateX(4px)',
    },
  },
  
  // 光效装饰
  effects: {
    glow: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
      filter: 'blur(20px)',
      opacity: 0.6,
      animation: 'pulse 3s ease-in-out infinite',
    },
    
    shimmer: {
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
      animation: 'shimmer 2s ease-in-out infinite',
    },
    
    particles: {
      position: 'absolute',
      width: '4px',
      height: '4px',
      background: 'radial-gradient(circle, rgba(251, 191, 36, 0.8) 0%, transparent 70%)',
      borderRadius: '50%',
      animation: 'float 3s ease-in-out infinite',
    },
  },
};

// 导出完整的设计系统
export const designSystem = {
  colors,
  gradients,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  breakpoints,
  zIndex,
  components,
};

export default designSystem;