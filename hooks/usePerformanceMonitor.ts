// hooks/usePerformanceMonitor.ts
import { usePerformanceStore } from '../store/usePerformanceStore';

export const usePerformanceMonitor = () => {
  const { data, startMonitoring, stopMonitoring } = usePerformanceStore();
  
  return {
    fps: data.fps,
    frameTime: data.frameTime,
    memoryUsage: data.memoryUsage,
    isMonitoring: data.isMonitoring,
    startMonitoring,
    stopMonitoring,
  };
};
