/**
 * 动画效果工具库 - 提供统一的动画配置和效果
 * 使用 Framer Motion 实现流畅的页面动画
 */

import { Variants } from 'framer-motion';

// 动画持续时间配置
export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
} as const;

// 动画缓动函数
export const EASING = {
  easeOut: [0.0, 0.0, 0.2, 1],
  easeIn: [0.4, 0.0, 1, 1],
  easeInOut: [0.4, 0.0, 0.2, 1],
  spring: { type: "spring", stiffness: 300, damping: 30 },
  bounce: { type: "spring", stiffness: 400, damping: 10 },
} as const;

// 页面进入动画配置
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: EASING.easeOut,
    },
  },
  out: {
    opacity: 0,
    y: -20,
    transition: {
      duration: ANIMATION_DURATION.fast,
      ease: EASING.easeIn,
    },
  },
};

// 卡片动画配置
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: EASING.easeOut,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: ANIMATION_DURATION.fast,
      ease: EASING.easeOut,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: ANIMATION_DURATION.fast,
    },
  },
};

// 列表项动画配置
export const listItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.05,
      duration: ANIMATION_DURATION.normal,
      ease: EASING.easeOut,
    },
  }),
  hover: {
    x: 5,
    transition: {
      duration: ANIMATION_DURATION.fast,
    },
  },
};

// 数字滚动动画配置
export const numberCountVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: EASING.spring,
    },
  },
};

// 图表动画配置
export const chartVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: EASING.easeOut,
      staggerChildren: 0.1,
    },
  },
};

// 模态框动画配置
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.75,
    y: -50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: EASING.spring,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.75,
    y: 50,
    transition: {
      duration: ANIMATION_DURATION.fast,
      ease: EASING.easeIn,
    },
  },
};

// 容器动画配置（用于包含多个子元素的容器）
export const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// 淡入动画配置
export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.normal,
    },
  },
};

// 滑入动画配置
export const slideVariants: Variants = {
  hidden: {
    x: -100,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: EASING.easeOut,
    },
  },
};

// 弹跳动画配置
export const bounceVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 15,
    },
  },
};

// 排行榜特殊动画（金银铜牌效果）
export const rankingVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
  },
  visible: (rank: number) => ({
    opacity: 1,
    y: 0,
    scale: rank <= 3 ? 1.05 : 1,
    transition: {
      delay: rank * 0.05,
      duration: ANIMATION_DURATION.normal,
      ease: rank <= 3 ? EASING.bounce : EASING.easeOut,
    },
  }),
  hover: (rank: number) => ({
    scale: rank <= 3 ? 1.08 : 1.02,
    transition: {
      duration: ANIMATION_DURATION.fast,
    },
  }),
};

// 进度条动画配置
export const progressVariants: Variants = {
  hidden: {
    width: 0,
  },
  visible: (progress: number) => ({
    width: `${progress}%`,
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: EASING.easeOut,
    },
  }),
};

// 旋转动画配置
export const spinVariants: Variants = {
  spinning: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// 脉动动画配置
export const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// 自定义Hook：页面加载动画
export const usePageAnimation = () => {
  return {
    initial: "initial",
    animate: "in",
    exit: "out",
    variants: pageVariants,
  };
};

// 自定义Hook：卡片hover动画
export const useCardAnimation = () => {
  return {
    initial: "hidden",
    animate: "visible",
    whileHover: "hover",
    whileTap: "tap",
    variants: cardVariants,
  };
};

// 自定义Hook：列表动画
export const useListAnimation = () => {
  return {
    initial: "hidden",
    animate: "visible",
    variants: containerVariants,
  };
};

// 数字动画计数器
export const animateNumber = (
  from: number,
  to: number,
  duration: number = 1000,
  onUpdate: (value: number) => void
): void => {
  const startTime = Date.now();
  
  const animate = () => {
    const now = Date.now();
    const progress = Math.min((now - startTime) / duration, 1);
    
    // 使用缓动函数
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = from + (to - from) * easeOutQuart;
    
    onUpdate(Math.round(current));
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};

// 延迟动画工具
export const delayedAnimation = (delay: number) => ({
  transition: {
    delay,
    duration: ANIMATION_DURATION.normal,
    ease: EASING.easeOut,
  },
});

const animations = {
  pageVariants,
  cardVariants,
  listItemVariants,
  chartVariants,
  modalVariants,
  containerVariants,
  fadeVariants,
  slideVariants,
  bounceVariants,
  rankingVariants,
  progressVariants,
  spinVariants,
  pulseVariants,
  ANIMATION_DURATION,
  EASING,
  usePageAnimation,
  useCardAnimation,
  useListAnimation,
  animateNumber,
  delayedAnimation,
};

export default animations;