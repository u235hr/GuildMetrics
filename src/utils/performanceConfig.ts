/**
 * 生产环境性能优化配置
 * 专为7x24小时数据大屏设计
 */

export const PERFORMANCE_CONFIG = {
  // 禁用所有交互动画（鼠标跟随、hover效果等）
  DISABLE_INTERACTIONS: true,
  
  // 简化动画（只保留必要的入场动画）
  SIMPLIFIED_ANIMATIONS: true,
  
  // 帧率控制
  TARGET_FPS: 75, // 目标帧率75fps
  MIN_FPS: 60,    // 最低帧率60fps
  MAX_FPS: 90,    // 最高帧率90fps，避免浪费性能
  
  // 内存监控阈值
  MEMORY_WARNING_THRESHOLD: 100, // MB
  MEMORY_CRITICAL_THRESHOLD: 200, // MB
  
  // FPS监控阈值
  FPS_WARNING_THRESHOLD: 50,  // 低于50fps警告
  FPS_CRITICAL_THRESHOLD: 30, // 低于30fps严重警告
  FPS_WASTE_THRESHOLD: 95,    // 高于95fps浪费性能
  
  // 自动刷新配置（防止内存泄漏）
  AUTO_REFRESH_HOURS: 6, // 6小时自动刷新一次
  
  // 数据更新频率
  DATA_UPDATE_INTERVAL: 60000, // 1分钟
  
  // CSS动画优化
  USE_GPU_ACCELERATION: true,
  
  // 减少重排重绘
  BATCH_DOM_UPDATES: true,
  
  // 帧率优化
  FRAME_RATE_LIMIT: true
};

export const isProductionMode = () => {
  return process.env.NODE_ENV === 'production' || 
         window.location.hostname !== 'localhost';
};

export const shouldUsePerformanceMode = () => {
  return isProductionMode() || 
         window.location.search.includes('perf=1');
};

/**
 * 内存清理工具
 */
export const memoryCleanup = () => {
  // 强制垃圾回收（如果浏览器支持）
  if ((window as any).gc) {
    (window as any).gc();
  }
  
  // 清理可能的内存泄漏
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (img.src.startsWith('blob:')) {
      URL.revokeObjectURL(img.src);
    }
  });
};

/**
 * 自动刷新机制（防止长时间运行导致的内存累积）
 */
export const setupAutoRefresh = () => {
  if (!isProductionMode()) return;
  
  const refreshInterval = PERFORMANCE_CONFIG.AUTO_REFRESH_HOURS * 60 * 60 * 1000;
  
  setTimeout(() => {
    console.log('数据大屏自动刷新...');
    window.location.reload();
  }, refreshInterval);
  
  // 每小时清理一次内存
  setInterval(memoryCleanup, 60 * 60 * 1000);
};

/**
 * 设置全局帧率限制
 * 注意：帧率限制现在由PerformanceMonitor组件统一管理
 * 此函数已废弃，保留以避免破坏性更改
 */
export const setupFrameRateLimit = () => {
  // 帧率限制现在由PerformanceMonitor组件统一管理
  // 不再需要独立的监控循环
  console.log(`帧率限制由PerformanceMonitor组件管理`);
};
