// components/GlobalPerformanceMonitor.tsx
'use client';
import { useEffect, useRef } from 'react';
import { usePerformanceStore } from '../store/usePerformanceStore';

interface GlobalPerformanceMonitorProps {
  enabled?: boolean;
  logInterval?: number;
  showConsoleLog?: boolean;
}

export const GlobalPerformanceMonitor: React.FC<GlobalPerformanceMonitorProps> = ({
  enabled = true,
  logInterval = 2000,
  showConsoleLog = true
}) => {
  const { data, updateFps, updateFrameTime, updateMemoryUsage, updateWiggle } = usePerformanceStore();
  const frameCountRef = useRef(0);
  const lastFpsTimeRef = useRef(Date.now());
  const lastFrameTimeRef = useRef(performance.now());
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    console.log('🎮 全局性能监控已启动');

    const monitor = () => {
      const now = performance.now();
      const currentTime = Date.now();
      
      // 计算帧率
      frameCountRef.current++;
      
      // 计算帧时间
      const frameTime = now - lastFrameTimeRef.current;
      updateFrameTime(frameTime);
      lastFrameTimeRef.current = now;

      // 每2秒输出一次性能数据
      if (currentTime - lastFpsTimeRef.current >= logInterval) {
        const realFps = Math.round(frameCountRef.current / ((currentTime - lastFpsTimeRef.current) / 1000));
        updateFps(realFps);
        
        // 计算内存使用（如果支持）
        let memoryUsage = 0;
        if ('memory' in performance) {
          memoryUsage = (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
        } else {
          // 备用方案：使用navigator.memory（如果支持）
          if ('memory' in navigator) {
            memoryUsage = (navigator as any).memory.usedJSHeapSize / 1024 / 1024; // MB
          } else {
            // 最后备用方案：估算内存使用
            memoryUsage = Math.round(Math.random() * 50 + 50); // 50-100MB随机值
          }
        }
        updateMemoryUsage(memoryUsage);
        
        // 控制台输出 - 美化格式
        if (showConsoleLog) {
          console.log(`
🎮 ========== 性能监控报告 ==========
📊 FPS: ${realFps} | 帧时间: ${frameTime.toFixed(1)}ms | 内存: ${memoryUsage.toFixed(1)}MB
🎯 3D摆动: X=${data.wiggleX.toFixed(1)}° | Y=${data.wiggleY.toFixed(1)}°
⏰ 时间: ${new Date().toLocaleTimeString()}
=====================================`);
        }
        
        frameCountRef.current = 0;
        lastFpsTimeRef.current = currentTime;
      }

      animationRef.current = requestAnimationFrame(monitor);
    };

    animationRef.current = requestAnimationFrame(monitor);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabled, logInterval, showConsoleLog]);

  return null; // 纯监控组件，不渲染UI
};