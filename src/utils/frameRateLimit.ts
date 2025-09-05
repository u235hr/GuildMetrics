/**
 * 帧率限制工具
 * 为数据大屏优化性能，限制帧率在60-90fps之间
 */

export class FrameRateLimit {
  private targetFPS: number = 75; // 目标帧率75fps，平衡性能和流畅度
  private lastFrameTime: number = 0;
  private frameInterval: number;
  
  constructor(targetFPS: number = 75) {
    this.targetFPS = Math.max(60, Math.min(90, targetFPS)); // 限制在60-90fps之间
    this.frameInterval = 1000 / this.targetFPS;
  }
  
  /**
   * 限制requestAnimationFrame的调用频率
   */
  public limitedRAF(callback: (timestamp: number) => void): number {
    return requestAnimationFrame((timestamp: number) => {
      const deltaTime = timestamp - this.lastFrameTime;
      
      if (deltaTime >= this.frameInterval) {
        this.lastFrameTime = timestamp - (deltaTime % this.frameInterval);
        // 移除调试日志以减少内存使用
        callback(timestamp);
      } else {
        // 如果还没到下一帧的时间，继续等待（避免递归调用）
        requestAnimationFrame((nextTimestamp: number) => {
          this.limitedRAF(callback);
        });
      }
    });
  }
  
  /**
   * 创建一个受限制的动画循环
   */
  public createLimitedLoop(callback: (timestamp: number) => void): () => void {
    let animationId: number;
    let isRunning = true;
    
    const loop = (timestamp: number) => {
      if (!isRunning) return;
      
      const deltaTime = timestamp - this.lastFrameTime;
      
      if (deltaTime >= this.frameInterval) {
        this.lastFrameTime = timestamp - (deltaTime % this.frameInterval);
        callback(timestamp);
      }
      
      animationId = requestAnimationFrame(loop);
    };
    
    animationId = requestAnimationFrame(loop);
    
    // 返回停止函数
    return () => {
      isRunning = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }
  
  /**
   * 获取当前目标帧率
   */
  public getTargetFPS(): number {
    return this.targetFPS;
  }
  
  /**
   * 动态调整目标帧率
   */
  public setTargetFPS(fps: number): void {
    this.targetFPS = Math.max(60, Math.min(90, fps));
    this.frameInterval = 1000 / this.targetFPS;
  }
}

// 全局实例
export const frameRateLimit = new FrameRateLimit(75);

/**
 * 替代requestAnimationFrame的限制版本
 */
export const limitedRequestAnimationFrame = (callback: (timestamp: number) => void): number => {
  return frameRateLimit.limitedRAF(callback);
};

/**
 * 为数据大屏优化的动画帧调度器
 */
export class DataboardAnimationScheduler {
  private static instance: DataboardAnimationScheduler;
  private frameRateLimit: FrameRateLimit;
  private activeAnimations: Set<string> = new Set();
  
  private constructor() {
    this.frameRateLimit = new FrameRateLimit(75);
  }
  
  public static getInstance(): DataboardAnimationScheduler {
    if (!DataboardAnimationScheduler.instance) {
      DataboardAnimationScheduler.instance = new DataboardAnimationScheduler();
    }
    return DataboardAnimationScheduler.instance;
  }
  
  /**
   * 注册一个动画
   */
  public registerAnimation(id: string, callback: (timestamp: number) => void): () => void {
    if (this.activeAnimations.has(id)) {
      console.warn(`Animation ${id} is already registered`);
      return () => {};
    }
    
    this.activeAnimations.add(id);
    const stopLoop = this.frameRateLimit.createLimitedLoop(callback);
    
    return () => {
      this.activeAnimations.delete(id);
      stopLoop();
    };
  }
  
  /**
   * 获取当前活跃动画数量
   */
  public getActiveAnimationCount(): number {
    return this.activeAnimations.size;
  }
  
  /**
   * 根据活跃动画数量动态调整帧率
   */
  public optimizeFrameRate(): void {
    const animationCount = this.activeAnimations.size;
    
    if (animationCount === 0) {
      this.frameRateLimit.setTargetFPS(60); // 无动画时降低到60fps
    } else if (animationCount <= 3) {
      this.frameRateLimit.setTargetFPS(75); // 少量动画时75fps
    } else {
      this.frameRateLimit.setTargetFPS(60); // 大量动画时降低到60fps
    }
  }
}

export const animationScheduler = DataboardAnimationScheduler.getInstance();
