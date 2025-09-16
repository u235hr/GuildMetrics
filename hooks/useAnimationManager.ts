import { useRef, useCallback, useEffect } from 'react';

interface AnimationTask {
  id: string;
  callback: (timestamp: number) => boolean; // 返回 true 继续，false 停止
  priority: number; // 0-10，数字越大优先级越高
  lastRun: number;
  interval: number; // 最小间隔时间（毫秒）
}

class AnimationManager {
  private static instance: AnimationManager;
  private tasks: Map<string, AnimationTask> = new Map();
  private isRunning = false;
  private animationId: number | null = null;
  private lastFrameTime = 0;
  private targetFPS = 60;
  private frameInterval = 16.67; // 60 FPS

  static getInstance(): AnimationManager {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager();
    }
    return AnimationManager.instance;
  }

  setTargetFPS(fps: number) {
    this.targetFPS = Math.max(1, Math.min(fps, 120));
    this.frameInterval = 1000 / this.targetFPS;
  }

  addTask(task: Omit<AnimationTask, 'lastRun'>) {
    this.tasks.set(task.id, {
      ...task,
      lastRun: 0,
    });
    
    if (!this.isRunning) {
      this.start();
    }
  }

  removeTask(id: string) {
    this.tasks.delete(id);
    
    if (this.tasks.size === 0) {
      this.stop();
    }
  }

  private start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.loop();
  }

  private stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private loop = () => {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;

    // 帧率控制
    if (deltaTime >= this.frameInterval) {
      // 按优先级排序任务
      const sortedTasks = Array.from(this.tasks.values()).sort((a, b) => b.priority - a.priority);
      
      for (const task of sortedTasks) {
        // 检查任务间隔
        if (currentTime - task.lastRun >= task.interval) {
          const shouldContinue = task.callback(currentTime);
          task.lastRun = currentTime;
          
          if (!shouldContinue) {
            this.tasks.delete(task.id);
          }
        }
      }

      this.lastFrameTime = currentTime;
    }

    if (this.tasks.size > 0) {
      this.animationId = requestAnimationFrame(this.loop);
    } else {
      this.stop();
    }
  };

  getStats() {
    return {
      taskCount: this.tasks.size,
      isRunning: this.isRunning,
      targetFPS: this.targetFPS,
    };
  }
}

export function useAnimationManager() {
  const manager = useRef(AnimationManager.getInstance());
  const activeTasksRef = useRef<Set<string>>(new Set());

  const addAnimation = useCallback((
    id: string,
    callback: (timestamp: number) => boolean,
    options: {
      priority?: number;
      interval?: number;
    } = {}
  ) => {
    const task: Omit<AnimationTask, 'lastRun'> = {
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

  const setTargetFPS = useCallback((fps: number) => {
    manager.current.setTargetFPS(fps);
  }, []);

  const getStats = useCallback(() => {
    return manager.current.getStats();
  }, []);

  // 组件卸载时清理所有任务
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
    setTargetFPS,
    getStats,
  };
}

// 注意：性能监控功能已移至 useSingleFPSSource.ts
// 请使用 useSingleFPSSource 来获取FPS数据