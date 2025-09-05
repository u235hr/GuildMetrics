/**
 * 性能优化配置 - 锁定60fps版本
 * 在不牺牲视觉效果的前提下，最大化性能
 */

export const performanceConfig = {
  // 帧率设置 - 严格锁定60fps
  frameRate: {
    target: 60,        // 目标帧率60fps（锁定）
    max: 60,          // 最大帧率60fps（锁定）
    min: 30,          // 最小可接受帧率30fps
    warning: 25       // 性能警告阈值25fps
  },
  
  // 内存管理
  memory: {
    warning: 250,     // 内存警告阈值250MB
    critical: 300,    // 内存严重警告阈值300MB
    gcInterval: 60000 // 垃圾回收间隔60秒
  },
  
  // 渲染优化
  rendering: {
    // 减少不必要的重渲染
    debounceTime: 16,     // 防抖时间16ms (约60fps)
    throttleTime: 33,     // 节流时间33ms (约30fps)
    
    // 动画优化
    animationFrameSkip: 1, // 每1帧更新一次动画
    backgroundThrottle: 2  // 后台时每2帧更新一次
  },
  
  // 监控优化
  monitoring: {
    // 减少监控频率
    updateInterval: 2000,  // 监控更新间隔2秒
    logInterval: 10000,    // 日志输出间隔10秒
    
    // 只在开发环境启用详细监控
    enableDetailedLogs: false // 禁用详细日志以提升性能
  }
};

// 性能优化工具函数
export const performanceUtils = {
  // 节流函数
  throttle: (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    let lastExecTime = 0;
    return function (...args: any[]) {
      const currentTime = Date.now();
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  },
  
  // 防抖函数
  debounce: (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return function (...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },
  
  // 内存使用检查
  getMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }
    return { used: 0, total: 0, limit: 0 };
  },
  
  // 强制垃圾回收（仅在开发环境）
  forceGC: () => {
    if (process.env.NODE_ENV === 'development' && 'gc' in window) {
      (window as any).gc();
    }
  }
};

// 设置帧率限制 - 锁定60fps
export const setupFrameRateLimit = (targetFPS: number = 60) => {
  const frameRateLimit = new (require('./frameRateLimit').FrameRateLimit)(Math.min(60, targetFPS));
  return frameRateLimit;
};

// 设置自动刷新 - 减少频率
export const setupAutoRefresh = (interval: number = 10000) => {
  return setInterval(() => {
    if (process.env.NODE_ENV === 'development') {
      performanceUtils.forceGC();
    }
  }, interval);
};
