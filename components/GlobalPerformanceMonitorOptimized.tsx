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
}

export const GlobalPerformanceMonitorOptimized: React.FC<GlobalPerformanceMonitorOptimizedProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  logInterval = 2000, // 2 seconds for a reasonable refresh rate
  showConsoleLog = process.env.NODE_ENV === 'development',
  showVisualIndicator = process.env.NODE_ENV === 'development',
}) => {
  const { data, updateMetrics } = usePerformanceStore();
  const { currentFPS } = useSingleFPSSource();
  
  const [performanceLevel, setPerformanceLevel] = useState<'high' | 'medium' | 'low'>('high');
  const lastLogTime = useRef(0);

  const fpsThreshold = 30;
  const memoryThreshold = 150; // MB

  const checkPerformanceLevel = useCallback((fps: number, memory: number) => {
    if (fps < fpsThreshold || memory > memoryThreshold) return 'low';
    if (fps < 50 || memory > memoryThreshold * 0.8) return 'medium';
    return 'high';
  }, [fpsThreshold, memoryThreshold]);

  useEffect(() => {
    if (!enabled) return;

    const intervalId = setInterval(() => {
      try {
        const memoryInfo = getMemoryUsage();
        const frameTime = currentFPS > 0 ? (1000 / currentFPS) : 0;

        // Use the unified updateMetrics function from the store
        updateMetrics({
          fps: currentFPS,
          frameTime: frameTime,
          memory: memoryInfo.used,
        });

        const newLevel = checkPerformanceLevel(currentFPS, memoryInfo.used);
        if (newLevel !== performanceLevel) {
          setPerformanceLevel(newLevel);
        }

        if (showConsoleLog) {
          const now = performance.now();
          if (now - lastLogTime.current > logInterval) {
            const status = newLevel === 'high' ? '🟢' : newLevel === 'medium' ? '🟡' : '🔴';
            console.log(`${status} ${currentFPS}fps | ${memoryInfo.used}MB | ${newLevel.toUpperCase()}`);
            lastLogTime.current = now;
          }
        }
      } catch (error) {
        console.warn('Performance monitor error:', error);
      }
    }, 500); // Update metrics store frequently, log less frequently

    console.log('Performance Monitor Started');

    return () => {
      clearInterval(intervalId);
    };
  }, [enabled, logInterval, showConsoleLog, updateMetrics, checkPerformanceLevel, performanceLevel, currentFPS]);

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

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div className={`px-3 py-2 rounded-lg text-white text-xs font-mono ${getIndicatorColor()} transition-all duration-300`}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
          <span>{`${data.fps}fps ${data.memoryUsage.toFixed(0)}MB`}</span>
        </div>
      </div>
    </div>
  );
};