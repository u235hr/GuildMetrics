'use client';

import { useEffect, useState } from 'react';
import { frameRateLimit, animationScheduler } from '@/utils/frameRateLimit';

interface PerformanceStats {
  fps: number;
  targetFPS: number;
  memoryUsage: number;
  renderTime: number;
  activeAnimations: number;
}

export default function PerformanceMonitor() {
  const [stats, setStats] = useState<PerformanceStats>({ 
    fps: 0, 
    targetFPS: 75,
    memoryUsage: 0, 
    renderTime: 0,
    activeAnimations: 0
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measurePerformance = () => {
      const currentTime = performance.now();
      frameCount++;

      // 每秒更新一次统计
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        const targetFPS = frameRateLimit.getTargetFPS();
        const activeAnimations = animationScheduler.getActiveAnimationCount();
        
        // 获取内存使用情况（如果浏览器支持）
        const memoryUsage = (performance as any).memory 
          ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
          : 0;

        const renderTime = Math.round(performance.now() - currentTime);

        // 只在开发环境输出详细日志
        if (process.env.NODE_ENV === 'development') {
          console.log(`[PerformanceMonitor] Stats updated:`, { fps, targetFPS, memoryUsage, renderTime, activeAnimations });
        }
        
        setStats({ fps, targetFPS, memoryUsage, renderTime, activeAnimations });
        
        // 动态优化帧率
        animationScheduler.optimizeFrameRate();
        
        // 性能警告 - 调整警告阈值，减少日志输出
        if (fps > targetFPS + 20) {
          console.warn('帧率过高，浪费性能:', { fps, targetFPS });
        } else if (fps < 50 || memoryUsage > 150) { // 提高内存警告阈值到150MB
          console.warn('性能警告:', { fps, memoryUsage });
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      // 使用限制帧率的RAF
      animationId = frameRateLimit.limitedRAF(measurePerformance);
    };

    // 只在开发环境或需要时启用
    if (process.env.NODE_ENV === 'development' || window.location.search.includes('perf=1')) {
      measurePerformance();
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  // 快捷键显示/隐藏性能监控
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'p') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 text-white p-3 rounded-lg text-sm font-mono">
      <div className="mb-2 font-bold">性能监控 (Ctrl+P)</div>
      <div className={`${stats.fps < 50 ? 'text-red-400' : stats.fps > stats.targetFPS + 20 ? 'text-yellow-400' : 'text-green-400'}`}>
        FPS: {stats.fps} / {stats.targetFPS}
      </div>
      <div className={`${stats.memoryUsage > 100 ? 'text-red-400' : 'text-green-400'}`}>
        内存: {stats.memoryUsage}MB
      </div>
      <div>渲染: {stats.renderTime}ms</div>
      <div className="text-blue-400">
        动画: {stats.activeAnimations}
      </div>
    </div>
  );
}
