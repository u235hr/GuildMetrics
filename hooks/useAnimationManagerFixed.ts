import { useRef, useCallback, useEffect } from 'react';

interface AnimationTask {
  id: string;
  callback: (deltaTime: number) => void;
  priority: number;
  interval: number;
}

class AnimationManager {
  private static instance: AnimationManager;
  private tasks: AnimationTask[] = [];
  private isRunning = false;
  private animationId: number | null = null;
  private lastTime = 0;
  private frameCount = 0;
  private lastFpsUpdate = 0;
  private fps = 60;

  static getInstance(): AnimationManager {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager();
    }
    return AnimationManager.instance;
  }

  addTask(task: AnimationTask) {
    // Remove existing task with same id
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    this.tasks.push(task);
    
    if (!this.isRunning) {
      this.start();
    }
  }

  removeTask(id: string) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    
    if (this.tasks.length === 0) {
      this.stop();
    }
  }

  private start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTime = performance.now();
    this.lastFpsUpdate = this.lastTime;
    this.frameCount = 0;
    this.loop();
  }

  private stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  loop = () => {
    if (!this.isRunning) return;

    const now = performance.now();
    const deltaTime = now - this.lastTime;
    this.lastTime = now;

    // Update FPS
    this.frameCount++;
    if (now - this.lastFpsUpdate >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
      this.frameCount = 0;
      this.lastFpsUpdate = now;
    }

    // Execute tasks safely
    this.tasks.forEach(task => {
      if (task && task.callback && typeof task.callback === 'function') {
        try {
          task.callback(deltaTime);
        } catch (error) {
          console.warn('Animation task error:', error);
        }
      }
    });

    this.animationId = requestAnimationFrame(this.loop);
  };

  getFPS() {
    return this.fps;
  }

  getStats() {
    return {
      taskCount: this.tasks.length,
      isRunning: this.isRunning,
      fps: this.fps,
    };
  }
}

export function useAnimationManager() {
  const manager = useRef(AnimationManager.getInstance());
  const activeTasksRef = useRef<Set<string>>(new Set());

  const addAnimation = useCallback((
    id: string,
    callback: (deltaTime: number) => void,
    options: {
      priority?: number;
      interval?: number;
    } = {}
  ) => {
    const task: AnimationTask = {
      id,
      callback,
      priority: options.priority ?? 5,
      interval: options.interval ?? 0,
    };

    manager.current.addTask(task);
    activeTasksRef.current.add(id);
  }, []);

  const removeAnimation = useCallback((id: string) => {
    manager.current.removeTask(id);
    activeTasksRef.current.delete(id);
  }, []);

  const getFPS = useCallback(() => {
    return manager.current.getFPS();
  }, []);

  const getStats = useCallback(() => {
    return manager.current.getStats();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      activeTasksRef.current.forEach(id => {
        manager.current.removeTask(id);
      });
      activeTasksRef.current.clear();
    };
  }, []);

  return {
    addAnimation,
    removeAnimation,
    getFPS,
    getStats,
  };
}

// Performance monitoring hook
export function usePerformanceMonitor() {
  const frameCount = useRef(0);
  const lastTime = useRef(0);
  const fpsHistory = useRef<number[]>([]);
  const currentFPS = useRef(60);

  const updateFPS = useCallback(() => {
    frameCount.current++;
    const now = performance.now();
    
    if (lastTime.current === 0) {
      lastTime.current = now;
      return currentFPS.current;
    }
    
    const deltaTime = now - lastTime.current;
    
    if (deltaTime >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / deltaTime);
      const validFPS = Math.max(1, Math.min(fps, 120));
      currentFPS.current = validFPS;
      
      fpsHistory.current.push(validFPS);
      if (fpsHistory.current.length > 60) {
        fpsHistory.current.shift();
      }
      
      frameCount.current = 0;
      lastTime.current = now;
      
      return validFPS;
    }
    
    return currentFPS.current;
  }, []);

  const getAverageFPS = useCallback(() => {
    if (fpsHistory.current.length === 0) return 0;
    return Math.round(fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length);
  }, []);

  const getMinFPS = useCallback(() => {
    if (fpsHistory.current.length === 0) return 0;
    return Math.min(...fpsHistory.current);
  }, []);

  const getMaxFPS = useCallback(() => {
    if (fpsHistory.current.length === 0) return 0;
    return Math.max(...fpsHistory.current);
  }, []);

  return {
    updateFPS,
    getAverageFPS,
    getMinFPS,
    getMaxFPS,
    getFPSHistory: () => [...fpsHistory.current],
  };
}