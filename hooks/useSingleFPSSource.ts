'use client';

import { useRef, useCallback, useEffect, useState } from 'react';

/**
 * 全局统一FPS计算源
 * 确保整个应用只有一个FPS计算实例，避免显示不一致
 */
class GlobalFPSCalculator {
  private static instance: GlobalFPSCalculator;
  private frameCount = 0;
  private lastTime = performance.now();
  private currentFPS = 60;
  private fpsHistory: number[] = [];
  private subscribers: Set<(fps: number) => void> = new Set();
  private animationId: number | null = null;
  private targetFPS = 60; // 目标帧率限制
  private frameInterval = 1000 / 60; // 16.67ms
  private lastFrameTime = performance.now();

  private constructor() {
    this.startCalculation();
  }

  static getInstance(): GlobalFPSCalculator {
    if (!GlobalFPSCalculator.instance) {
      GlobalFPSCalculator.instance = new GlobalFPSCalculator();
    }
    return GlobalFPSCalculator.instance;
  }

  private startCalculation() {
    const calculate = (timestamp: number) => {
      // 实现真正的帧率限制
      const deltaTime = timestamp - this.lastFrameTime;
      
      if (deltaTime < this.frameInterval) {
        // 跳过这一帧，还没到时间
        this.animationId = requestAnimationFrame(calculate);
        return;
      }

      // 更新上一帧时间
      this.lastFrameTime = timestamp;
      
      this.frameCount++;
      const now = performance.now();
      const timeSinceLastUpdate = now - this.lastTime;

      // 每秒更新一次FPS
      if (timeSinceLastUpdate >= 1000) {
        const actualFPS = Math.round((this.frameCount * 1000) / timeSinceLastUpdate);
        // 限制FPS到目标值
        const limitedFPS = Math.min(actualFPS, this.targetFPS);
        
        // 只在FPS变化时更新
        if (this.currentFPS !== limitedFPS) {
          this.currentFPS = limitedFPS;
          this.fpsHistory.push(limitedFPS);
          
          // 保持最近30秒的历史数据（减少内存使用）
          if (this.fpsHistory.length > 30) {
            this.fpsHistory.shift();
          }

          // 通知所有订阅者
          this.subscribers.forEach(callback => callback(limitedFPS));
        }

        this.frameCount = 0;
        this.lastTime = now;
      }

      this.animationId = requestAnimationFrame(calculate);
    };

    this.animationId = requestAnimationFrame(calculate);
  }

  setTargetFPS(fps: number) {
    this.targetFPS = Math.max(30, Math.min(fps, 120));
    this.frameInterval = 1000 / this.targetFPS;
  }

  getTargetFPS(): number {
    return this.targetFPS;
  }

  subscribe(callback: (fps: number) => void): () => void {
    this.subscribers.add(callback);
    // 立即返回当前FPS
    callback(this.currentFPS);
    
    // 返回取消订阅函数
    return () => {
      this.subscribers.delete(callback);
    };
  }

  getCurrentFPS(): number {
    return this.currentFPS;
  }

  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return this.currentFPS;
    return Math.round(this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length);
  }

  getMinFPS(): number {
    if (this.fpsHistory.length === 0) return this.currentFPS;
    return Math.min(...this.fpsHistory);
  }

  getMaxFPS(): number {
    if (this.fpsHistory.length === 0) return this.currentFPS;
    return Math.max(...this.fpsHistory);
  }

  getFPSHistory(): number[] {
    return [...this.fpsHistory];
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.subscribers.clear();
  }
}

/**
 * 统一FPS数据源Hook
 * 所有组件都应该使用这个Hook来获取FPS数据
 */
export function useSingleFPSSource() {
  const [currentFPS, setCurrentFPS] = useState(60);
  const calculatorRef = useRef<GlobalFPSCalculator | null>(null);

  useEffect(() => {
    calculatorRef.current = GlobalFPSCalculator.getInstance();
    
    // 订阅FPS更新
    const unsubscribe = calculatorRef.current.subscribe((fps) => {
      setCurrentFPS(fps);
    });

    return unsubscribe;
  }, []);

  const getAverageFPS = useCallback(() => {
    return calculatorRef.current?.getAverageFPS() || 60;
  }, []);

  const getMinFPS = useCallback(() => {
    return calculatorRef.current?.getMinFPS() || 60;
  }, []);

  const getMaxFPS = useCallback(() => {
    return calculatorRef.current?.getMaxFPS() || 60;
  }, []);

  const getFPSHistory = useCallback(() => {
    return calculatorRef.current?.getFPSHistory() || [];
  }, []);

  return {
    currentFPS,
    getAverageFPS,
    getMinFPS,
    getMaxFPS,
    getFPSHistory
  };
}