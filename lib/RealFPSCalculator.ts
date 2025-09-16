// 真实FPS计算器 - 使用更准确的方法
export class RealFPSCalculator {
  private frameCount = 0;
  private startTime = performance.now();
  private lastTime = performance.now();
  private fpsValues: number[] = [];

  // 记录一帧
  recordFrame(): void {
    const now = performance.now();
    this.frameCount++;
    
    // 每秒计算一次FPS
    if (now - this.lastTime >= 1000) {
      const fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
      this.fpsValues.push(fps);
      
      // 只保留最近5个FPS值
      if (this.fpsValues.length > 5) {
        this.fpsValues.shift();
      }
      
      // 重置计数器
      this.frameCount = 0;
      this.lastTime = now;
    }
  }

  // 获取当前FPS
  getCurrentFPS(): number {
    if (this.fpsValues.length === 0) return 0;
    return this.fpsValues[this.fpsValues.length - 1];
  }

  // 获取平均FPS
  getAverageFPS(): number {
    if (this.fpsValues.length === 0) return 0;
    
    const sum = this.fpsValues.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.fpsValues.length);
  }

  // 获取FPS变化范围
  getFPSRange(): { min: number; max: number } {
    if (this.fpsValues.length === 0) return { min: 0, max: 0 };
    
    return {
      min: Math.min(...this.fpsValues),
      max: Math.max(...this.fpsValues)
    };
  }

  // 重置计算器
  reset(): void {
    this.frameCount = 0;
    this.startTime = performance.now();
    this.lastTime = performance.now();
    this.fpsValues = [];
  }
}