'use client';

import { useEffect } from 'react';

interface FPSLimiterProps {
  targetFPS?: number;
  children: React.ReactNode;
}

/**
 * FPS限制器组件
 * 在应用根部使用，限制整个应用的帧率
 */
export default function FPSLimiter({ targetFPS = 60, children }: FPSLimiterProps) {
  useEffect(() => {
    // 延迟设置全局FPS限制，确保模块完全加载
    const timer = setTimeout(() => {
      try {
        const { GlobalFPSCalculator } = require('@/hooks/useSingleFPSSource');
        if (GlobalFPSCalculator && GlobalFPSCalculator.getInstance) {
          const calculator = GlobalFPSCalculator.getInstance();
          if (calculator && calculator.setTargetFPS) {
            calculator.setTargetFPS(targetFPS);
            console.log(`FPS Limiter: Set target FPS to ${targetFPS}`);
          }
        }
      } catch (error) {
        console.warn('Failed to set FPS limit:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [targetFPS]);

  return <>{children}</>;
}