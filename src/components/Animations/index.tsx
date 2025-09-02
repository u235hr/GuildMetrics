/**
 * 动画包装组件 - 简化动画效果的使用
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  pageVariants,
  cardVariants,
  fadeVariants,
  slideVariants,
  listItemVariants,
  containerVariants,
  rankingVariants,
  chartVariants
} from '../../utils/animations';

// 页面动画包装器
interface PageAnimationProps {
  children: React.ReactNode;
  className?: string;
}

export const PageAnimation: React.FC<PageAnimationProps> = ({ children, className }) => {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
};

// 卡片动画包装器
interface CardAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export const CardAnimation: React.FC<CardAnimationProps> = ({ 
  children, 
  className, 
  delay = 0, 
  hover = true 
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      whileHover={hover ? "hover" : undefined}
      whileTap={hover ? "tap" : undefined}
      variants={cardVariants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

// 淡入动画包装器
interface FadeAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const FadeAnimation: React.FC<FadeAnimationProps> = ({ 
  children, 
  className, 
  delay = 0 
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={fadeVariants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

// 滑入动画包装器
interface SlideAnimationProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
}

export const SlideAnimation: React.FC<SlideAnimationProps> = ({ 
  children, 
  className, 
  direction = 'left',
  delay = 0 
}) => {
  const getVariants = () => {
    const baseVariants = { ...slideVariants };
    
    switch (direction) {
      case 'right':
        baseVariants.hidden = { x: 100, opacity: 0 };
        break;
      case 'up':
        baseVariants.hidden = { y: 100, opacity: 0 };
        break;
      case 'down':
        baseVariants.hidden = { y: -100, opacity: 0 };
        break;
      default: // left
        baseVariants.hidden = { x: -100, opacity: 0 };
    }
    
    return baseVariants;
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={getVariants()}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

// 列表动画包装器
interface ListAnimationProps {
  children: React.ReactNode;
  className?: string;
}

export const ListAnimation: React.FC<ListAnimationProps> = ({ children, className }) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
};

// 列表项动画包装器
interface ListItemAnimationProps {
  children: React.ReactNode;
  className?: string;
  index: number;
  hover?: boolean;
}

export const ListItemAnimation: React.FC<ListItemAnimationProps> = ({ 
  children, 
  className, 
  index,
  hover = true 
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      whileHover={hover ? "hover" : undefined}
      variants={listItemVariants}
      custom={index}
    >
      {children}
    </motion.div>
  );
};

// 排行榜动画包装器
interface RankingAnimationProps {
  children: React.ReactNode;
  className?: string;
  rank: number;
  hover?: boolean;
}

export const RankingAnimation: React.FC<RankingAnimationProps> = ({ 
  children, 
  className, 
  rank,
  hover = true 
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      whileHover={hover ? "hover" : undefined}
      variants={rankingVariants}
      custom={rank}
    >
      {children}
    </motion.div>
  );
};

// 图表动画包装器
interface ChartAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const ChartAnimation: React.FC<ChartAnimationProps> = ({ 
  children, 
  className,
  delay = 0 
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={chartVariants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

// 数字计数动画组件
interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  className?: string;
  formatter?: (value: number) => string;
}

export const CountUp: React.FC<CountUpProps> = ({ 
  end, 
  start = 0, 
  duration = 1000,
  className,
  formatter = (value) => value.toString()
}) => {
  const [count, setCount] = React.useState(start);

  React.useEffect(() => {
    const startTime = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // 使用缓动函数
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = start + (end - start) * easeOutQuart;
      
      setCount(Math.round(current));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, start, duration]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {formatter(count)}
    </motion.span>
  );
};

// 进度条动画组件
interface AnimatedProgressProps {
  percent: number;
  className?: string;
  color?: string;
  height?: number;
  duration?: number;
}

export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  percent,
  className,
  color = '#1677ff',
  height = 8,
  duration = 1000
}) => {
  return (
    <div className={`relative overflow-hidden bg-gray-200 rounded-full ${className}`} style={{ height }}>
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: duration / 1000, ease: "easeOut" }}
      />
    </div>
  );
};

// 条件动画包装器
interface ConditionalAnimationProps {
  children: React.ReactNode;
  show: boolean;
  animationType?: 'fade' | 'slide' | 'scale';
  className?: string;
}

export const ConditionalAnimation: React.FC<ConditionalAnimationProps> = ({
  children,
  show,
  animationType = 'fade',
  className
}) => {
  const getVariants = () => {
    switch (animationType) {
      case 'slide':
        return {
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0 }
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.95 },
          visible: { opacity: 1, scale: 1 }
        };
      default: // fade
        return fadeVariants;
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={className}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={getVariants()}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Animations = {
  PageAnimation,
  CardAnimation,
  FadeAnimation,
  SlideAnimation,
  ListAnimation,
  ListItemAnimation,
  RankingAnimation,
  ChartAnimation,
  CountUp,
  AnimatedProgress,
  ConditionalAnimation,
};

export default Animations;