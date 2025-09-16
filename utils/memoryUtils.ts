// utils/memoryUtils.ts
/**
 * 统一的内存检测工具函数
 * 提供一致的内存使用情况检测逻辑
 */

interface MemoryInfo {
  used: number; // MB
  total: number; // MB
  percentage: number; // 0-100
  isAvailable: boolean;
}

/**
 * 获取内存使用情况（优化版）
 * 简化检测逻辑，减少计算开销
 */
export function getMemoryUsage(): MemoryInfo {
  try {
    // 优先使用 performance.memory
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      if (memory?.usedJSHeapSize) {
        const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        const totalMB = memory.totalJSHeapSize ? Math.round(memory.totalJSHeapSize / 1024 / 1024) : usedMB * 2;
        
        return {
          used: Math.max(10, Math.min(usedMB, 500)),
          total: Math.max(50, Math.min(totalMB, 1000)),
          percentage: Math.round((usedMB / totalMB) * 100),
          isAvailable: true
        };
      }
    }

    // 备用方案：navigator.memory
    if (typeof window !== 'undefined' && 'memory' in navigator) {
      const navMemory = (navigator as any).memory;
      if (navMemory?.usedJSHeapSize) {
        const usedMB = Math.round(navMemory.usedJSHeapSize / 1024 / 1024);
        return {
          used: Math.max(10, Math.min(usedMB, 500)),
          total: 200,
          percentage: Math.round((usedMB / 200) * 100),
          isAvailable: true
        };
      }
    }

    // 简化估算
    return {
      used: 45,
      total: 100,
      percentage: 45,
      isAvailable: false
    };
  } catch {
    return {
      used: 45,
      total: 100,
      percentage: 45,
      isAvailable: false
    };
  }
}


/**
 * 检查是否有内存泄漏风险
 */
export function detectMemoryLeak(memoryHistory: number[]): {
  hasLeak: boolean;
  severity: 'low' | 'medium' | 'high';
  message: string;
} {
  if (memoryHistory.length < 5) {
    return { hasLeak: false, severity: 'low', message: '数据不足，无法检测' };
  }

  const recent = memoryHistory.slice(-5);
  const isIncreasing = recent.every((mem, index) => 
    index === 0 || mem >= recent[index - 1]
  );

  if (!isIncreasing) {
    return { hasLeak: false, severity: 'low', message: '内存使用正常' };
  }

  const growth = recent[recent.length - 1] - recent[0];
  
  if (growth > 50) {
    return { 
      hasLeak: true, 
      severity: 'high', 
      message: `检测到严重内存泄漏：+${growth}MB` 
    };
  } else if (growth > 20) {
    return { 
      hasLeak: true, 
      severity: 'medium', 
      message: `检测到中等内存泄漏：+${growth}MB` 
    };
  } else if (growth > 10) {
    return { 
      hasLeak: true, 
      severity: 'low', 
      message: `检测到轻微内存泄漏：+${growth}MB` 
    };
  }

  return { hasLeak: false, severity: 'low', message: '内存使用正常' };
}
