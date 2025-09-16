'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// 性能限制配置
interface PerformanceConfig {
  targetFPS: number;
  maxFPS: number;
  minFPS: number;
  adaptiveQuality: boolean;
  enableThrottling: boolean;
}

// 性能状态
interface PerformanceState {
  currentFPS: number;
  averageFPS: number;
  frameTime: number;
  qualityLevel: 'high' | 'medium' | 'low';
  isThrottled: boolean;
  renderScale: number;
}

// 默认配置
const DEFAULT_CONFIG: PerformanceConfig = {
  targetFPS: 60,
  maxFPS: 60,
  minFPS: 30,
  adaptiveQuality: true,
  enableThrottling: true,
};

export function usePerformanceLimiter(config: Partial<PerformanceConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  const [state, setState] = useState<PerformanceState>({
    currentFPS: 60,
    averageFPS: 60,
    frameTime: 16.67,
    qualityLevel: 'high',
    isThrottled: false,
    renderScale: 1.0,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsHistoryRef = useRef<number[]>([]);
  const animationIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(performance.now());

  // FPS计算和限制
  const measurePerformance = useCallback(() => {
    const now = performance.now();
    const deltaTime = now - lastFrameTimeRef.current;
    
    // 计算当前FPS
    const currentFPS = deltaTime > 0 ? 1000 / deltaTime : 0;
    
    // 更新FPS历史
    fpsHistoryRef.current.push(currentFPS);
    if (fpsHistoryRef.current.length > 60) { // 保持60帧历史
      fpsHistoryRef.current.shift();
    }
    
    // 计算平均FPS
    const averageFPS = fpsHistoryRef.current.reduce((sum, fps) => sum + fps, 0) / fpsHistoryRef.current.length;
    
    // 动态调整质量等级
    let qualityLevel: 'high' | 'medium' | 'low' = 'high';
    let renderScale = 1.0;
    let isThrottled = false;
    
    if (finalConfig.adaptiveQuality) {
      if (averageFPS < finalConfig.minFPS) {
        qualityLevel = 'low';
        renderScale = 0.5;
        isThrottled = true;
      } else if (averageFPS < finalConfig.targetFPS * 0.8) {
        qualityLevel = 'medium';
        renderScale = 0.75;
        isThrottled = true;
      }
    }
    
    setState({
      currentFPS: Math.round(currentFPS),
      averageFPS: Math.round(averageFPS),
      frameTime: deltaTime,
      qualityLevel,
      isThrottled,
      renderScale,
    });
    
    lastFrameTimeRef.current = now;
    
    // FPS限制：如果超过目标FPS，延迟下一帧
    if (finalConfig.enableThrottling && currentFPS > finalConfig.maxFPS) {
      const targetFrameTime = 1000 / finalConfig.targetFPS;
      const delay = Math.max(0, targetFrameTime - deltaTime);
      
      setTimeout(() => {
        animationIdRef.current = requestAnimationFrame(measurePerformance);
      }, delay);
    } else {
      animationIdRef.current = requestAnimationFrame(measurePerformance);
    }
  }, [finalConfig]);

  // 启动性能监控
  useEffect(() => {
    console.log(`Performance Limiter Started - Target: ${finalConfig.targetFPS}fps, Max: ${finalConfig.maxFPS}fps`);
    animationIdRef.current = requestAnimationFrame(measurePerformance);
    
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [measurePerformance]);

  // 手动调整性能配置
  const adjustPerformance = useCallback((newConfig: Partial<PerformanceConfig>) => {
    Object.assign(finalConfig, newConfig);
    console.log('Performance config updated:', finalConfig);
  }, [finalConfig]);

  // 获取渲染建议
  const getRenderHints = useCallback(() => {
    return {
      shouldReduceParticles: state.qualityLevel === 'low',
      shouldReduceAnimations: state.isThrottled,
      shouldSkipFrames: state.currentFPS > finalConfig.maxFPS,
      recommendedLOD: state.qualityLevel === 'high' ? 1 : state.qualityLevel === 'medium' ? 0.75 : 0.5,
      renderScale: state.renderScale,
    };
  }, [state, finalConfig.maxFPS]);

  return {
    state,
    config: finalConfig,
    adjustPerformance,
    getRenderHints,
  };
}

// WebGL渲染优化Hook
export function useWebGLOptimizer(canvas: HTMLCanvasElement | null) {
  const { state, getRenderHints } = usePerformanceLimiter();
  const [isOptimized, setIsOptimized] = useState(false);

  useEffect(() => {
    if (!canvas) return;

    const hints = getRenderHints();
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (gl) {
      // 动态调整渲染分辨率
      const devicePixelRatio = window.devicePixelRatio || 1;
      const scaledRatio = devicePixelRatio * hints.renderScale;
      
      canvas.width = canvas.clientWidth * scaledRatio;
      canvas.height = canvas.clientHeight * scaledRatio;
      
      // 设置WebGL视口
      gl.viewport(0, 0, canvas.width, canvas.height);
      
      // 根据性能状态调整渲染设置
      if (hints.shouldReduceParticles) {
        // 减少粒子数量的逻辑将在Galaxy组件中实现
        console.log('Reducing particle count for better performance');
      }
      
      setIsOptimized(true);
    }
  }, [canvas, state.qualityLevel, state.renderScale]);

  return {
    isOptimized,
    performanceState: state,
    renderHints: getRenderHints(),
  };
}