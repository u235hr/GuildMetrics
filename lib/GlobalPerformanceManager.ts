import { RealFPSCalculator } from './RealFPSCalculator';

// 全局性能管理器 - 单例模式，具备问题检测能力
class GlobalPerformanceManager {
  private static instance: GlobalPerformanceManager | null = null;
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private animationId: number | null = null;
  
  // 真实FPS计算器
  private fpsCalculator = new RealFPSCalculator();
  
  // 性能问题检测
  private fpsHistory: number[] = [];
  private memoryHistory: number[] = [];
  private lastMemory = 0;
  private lastTime = performance.now();
  private consecutiveLowFPS = 0;
  private memoryLeakDetected = false;
  private performanceIssues: string[] = [];

  private constructor() {}

  static getInstance(): GlobalPerformanceManager {
    if (!GlobalPerformanceManager.instance) {
      GlobalPerformanceManager.instance = new GlobalPerformanceManager();
    }
    return GlobalPerformanceManager.instance;
  }

  start(logInterval: number = 3000, targetFPS: number = 60): void {
    // 如果已经在运行，直接返回
    if (this.isRunning) {
      return;
    }

    // 只在开发环境运行
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    this.isRunning = true;
    console.log('Global Performance Manager Started');

    // 重置FPS计算器
    this.fpsCalculator.reset();

    // 启动真实FPS计算循环
    const fpsLoop = () => {
      if (!this.isRunning) return;
      this.fpsCalculator.recordFrame();
      this.animationId = requestAnimationFrame(fpsLoop);
    };
    fpsLoop();

    // 定期输出性能报告
    this.intervalId = setInterval(() => {
      // 获取真实FPS数据
      const currentFPS = this.fpsCalculator.getCurrentFPS();
      const avgFPS = this.fpsCalculator.getAverageFPS();
      const fpsRange = this.fpsCalculator.getFPSRange();
      
      // 使用当前FPS作为主要指标
      const fps = currentFPS > 0 ? currentFPS : avgFPS;

      // 获取内存使用情况
      const memory = this.getMemoryUsage();
      
      // 性能问题检测
      this.detectPerformanceIssues(fps, memory, targetFPS);
      
      // 输出性能报告
      console.log('========== Performance Report ==========');
      console.log(`Memory: ${memory}MB | Current FPS: ${fps} | Target: ${targetFPS}`);
      console.log(`Time: ${new Date().toLocaleTimeString()}`);
      
      // 只在有有效数据时显示调试信息
      if (currentFPS > 0 || avgFPS > 0) {
        console.log(`FPS Range: ${fpsRange.min}-${fpsRange.max} | Avg: ${avgFPS}`);
      } else {
        console.log('FPS calculation in progress...');
      }
      
      // 输出检测到的问题
      if (this.performanceIssues.length > 0) {
        console.warn('Performance Issues Detected:');
        this.performanceIssues.forEach(issue => console.warn(`  - ${issue}`));
        this.performanceIssues = []; // 清空问题列表
      }
      
      console.log('========================================');
    }, logInterval);
  }

  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    console.log('Global Performance Manager Stopped');
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return Math.round(memory.usedJSHeapSize / 1024 / 1024);
    }
    return 0;
  }

  // 性能问题检测方法
  private detectPerformanceIssues(currentFPS: number, currentMemory: number, targetFPS: number): void {
    // 1. FPS问题检测
    this.fpsHistory.push(currentFPS);
    if (this.fpsHistory.length > 10) {
      this.fpsHistory.shift(); // 保持最近10次记录
    }

    // 检测FPS过低
    if (currentFPS < targetFPS * 0.8) { // 低于目标FPS的80%
      this.consecutiveLowFPS++;
      if (this.consecutiveLowFPS >= 3) {
        this.performanceIssues.push(`Low FPS detected: ${currentFPS} (target: ${targetFPS})`);
      }
    } else {
      this.consecutiveLowFPS = 0;
    }

    // 检测FPS波动过大
    if (this.fpsHistory.length >= 5) {
      const avgFPS = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
      const maxFPS = Math.max(...this.fpsHistory);
      const minFPS = Math.min(...this.fpsHistory);
      
      if (maxFPS - minFPS > 30) {
        this.performanceIssues.push(`FPS instability: ${minFPS}-${maxFPS} (avg: ${Math.round(avgFPS)})`);
      }
    }

    // 2. 内存问题检测
    this.memoryHistory.push(currentMemory);
    if (this.memoryHistory.length > 10) {
      this.memoryHistory.shift();
    }

    // 检测内存泄漏
    if (this.lastMemory > 0) {
      const memoryIncrease = currentMemory - this.lastMemory;
      if (memoryIncrease > 20) { // 内存增长超过20MB
        this.performanceIssues.push(`Memory spike detected: +${memoryIncrease}MB (${this.lastMemory}→${currentMemory}MB)`);
      }
    }

    // 检测持续内存增长
    if (this.memoryHistory.length >= 5) {
      const isIncreasing = this.memoryHistory.every((mem, index) => 
        index === 0 || mem >= this.memoryHistory[index - 1]
      );
      
      if (isIncreasing && !this.memoryLeakDetected) {
        const memoryGrowth = this.memoryHistory[this.memoryHistory.length - 1] - this.memoryHistory[0];
        if (memoryGrowth > 10) {
          this.performanceIssues.push(`Potential memory leak: +${memoryGrowth}MB over 5 samples`);
          this.memoryLeakDetected = true;
        }
      } else if (!isIncreasing) {
        this.memoryLeakDetected = false; // 重置内存泄漏检测
      }
    }

    // 检测内存使用过高
    if (currentMemory > 200) {
      this.performanceIssues.push(`High memory usage: ${currentMemory}MB (consider optimization)`);
    }

    // 3. 检测重复渲染问题
    if (currentFPS > targetFPS * 1.5) {
      this.performanceIssues.push(`Excessive rendering: ${currentFPS}FPS (target: ${targetFPS}, may cause battery drain)`);
    }

    // 4. 检测长时间运行问题
    const runTime = performance.now() - this.lastTime + (this.fpsHistory.length * 3000); // 估算运行时间
    if (runTime > 300000 && currentMemory > 150) { // 运行超过5分钟且内存超过150MB
      this.performanceIssues.push(`Long running session with high memory: ${Math.round(runTime/60000)}min, ${currentMemory}MB`);
    }

    this.lastMemory = currentMemory;
  }

  // 获取性能统计信息
  getPerformanceStats(): {
    avgFPS: number;
    avgMemory: number;
    isStable: boolean;
    issues: number;
  } {
    const avgFPS = this.fpsHistory.length > 0 
      ? Math.round(this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length)
      : 0;
    
    const avgMemory = this.memoryHistory.length > 0
      ? Math.round(this.memoryHistory.reduce((a, b) => a + b, 0) / this.memoryHistory.length)
      : 0;

    const isStable = this.consecutiveLowFPS === 0 && !this.memoryLeakDetected;
    
    return {
      avgFPS,
      avgMemory,
      isStable,
      issues: this.performanceIssues.length
    };
  }

  isActive(): boolean {
    return this.isRunning;
  }
}

export default GlobalPerformanceManager;