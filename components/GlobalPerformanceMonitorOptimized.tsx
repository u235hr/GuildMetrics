// components/GlobalPerformanceMonitorOptimized.tsx
'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { usePerformanceStore } from '../store/usePerformanceStore';
import { useSingleFPSSource } from '../hooks/useSingleFPSSource';
import { getMemoryUsage } from '../utils/memoryUtils';

interface GlobalPerformanceMonitorOptimizedProps {
  enabled?: boolean;
  logInterval?: number;
  showConsoleLog?: boolean;
  showVisualIndicator?: boolean;
  maxLogEntries?: number;
  enableAutoThrottling?: boolean;
  fpsThreshold?: number;
  memoryThreshold?: number; // MB
}

export const GlobalPerformanceMonitorOptimized: React.FC<GlobalPerformanceMonitorOptimizedProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  logInterval = 5000, // 增加到5秒，减少日志频率
  showConsoleLog = process.env.NODE_ENV === 'development',
  showVisualIndicator = process.env.NODE_ENV === 'development',
  maxLogEntries = 50,
  enableAutoThrottling = true,
  fpsThreshold = 30,
  memoryThreshold = 100
}) => {
  const { data, updateFps, updateFrameTime, updateMemoryUsage, updateWiggle } = usePerformanceStore();
  const { currentFPS, getAverageFPS, getMinFPS } = useSingleFPSSource();
  
  const [performanceLevel, setPerformanceLevel] = useState<'high' | 'medium' | 'low'>('high');
  const [isThrottled, setIsThrottled] = useState(false);
  const lastLogTime = useRef(0);
  const performanceHistory = useRef<number[]>([]);


  // Auto throttling control
  const applyAutoThrottling = (level: 'high' | 'medium' | 'low') => {
    if (!enableAutoThrottling) return;

    switch (level) {
      case 'low':
        setIsThrottled(true);
        break;
      case 'medium':
        setIsThrottled(true);
        break;
      case 'high':
        setIsThrottled(false);
        break;
    }
  };

  // 使用统一的内存检测函数
  const getMemoryInfo = () => getMemoryUsage();

  // 简化的性能等级检测
  const checkPerformanceLevel = useCallback((fps: number, memory: number) => {
    if (fps < fpsThreshold || memory > memoryThreshold) return 'low';
    if (fps < fpsThreshold * 1.5 || memory > memoryThreshold * 0.8) return 'medium';
    return 'high';
  }, [fpsThreshold, memoryThreshold]);

  useEffect(() => {
    if (!enabled) return;

    // 防止重复启动
    if (lastLogTime.current > 0) return;
    
    console.log('Performance Monitor Started');
    lastLogTime.current = performance.now();

    const intervalId = setInterval(() => {
      try {
        const now = performance.now();
        
        // 避免过于频繁的更新
        if (now - lastLogTime.current < logInterval) return;
        lastLogTime.current = now;

        const memoryInfo = getMemoryInfo();
        const frameTime = currentFPS > 0 ? (1000 / currentFPS) : 16.67;
        
        // 只在数据变化时更新状态
        if (data.fps !== currentFPS) updateFps(currentFPS);
        if (data.memoryUsage !== memoryInfo.used) updateMemoryUsage(memoryInfo.used);
        if (data.frameTime !== frameTime) updateFrameTime(frameTime);

        // 检测性能等级
        const newLevel = checkPerformanceLevel(currentFPS, memoryInfo.used);
        if (newLevel !== performanceLevel) {
          setPerformanceLevel(newLevel);
          applyAutoThrottling(newLevel);
        }

        // 记录性能历史（简化）
        performanceHistory.current.push(currentFPS);
        if (performanceHistory.current.length > 10) {
          performanceHistory.current.shift();
        }

      // 控制台输出（极简格式）
      if (showConsoleLog) {
        const status = newLevel === 'high' ? '🟢' : newLevel === 'medium' ? '🟡' : '🔴';
        const limitedFPS = Math.min(currentFPS, 60); // 确保显示不超过60fps
        console.log(`${status} ${limitedFPS}fps | ${memoryInfo.used}MB | ${newLevel.toUpperCase()}`);
      }
      } catch (error) {
        // 静默处理错误，避免影响应用运行
        console.warn('Performance monitor error:', error);
      }
    }, logInterval);

    return () => {
      clearInterval(intervalId);
      lastLogTime.current = 0; // 重置状态，允许重新启动
    };
  }, [enabled, logInterval, showConsoleLog]); // 只保留必要的依赖项，避免重复启动

  // 可视化性能指示器
  if (!showVisualIndicator || !enabled) {
    return null;
  }

  const getIndicatorColor = () => {
    switch (performanceLevel) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getIndicatorText = () => {
    return `${data.fps}fps ${data.memoryUsage.toFixed(0)}MB ${performanceLevel.toUpperCase()}`;
  };

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div className={`
        px-3 py-2 rounded-lg text-white text-xs font-mono
        ${getIndicatorColor()}
        transition-all duration-300
        ${isThrottled ? 'animate-pulse' : ''}
      `}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
          <span>{getIndicatorText()}</span>
          {isThrottled && <span className="text-xs">🔄</span>}
        </div>
      </div>
    </div>
  );
};