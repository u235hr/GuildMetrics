// store/usePerformanceStore.ts
import { create } from 'zustand';

// Only update the UI twice per second to avoid performance overhead.
const UPDATE_INTERVAL = 500; // ms

interface PerformanceData {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  isMonitoring: boolean;
  lastUpdate: number;
}

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memory: number;
}

interface PerformanceStore {
  data: PerformanceData;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  updateMetrics: (metrics: PerformanceMetrics) => void;
}

export const usePerformanceStore = create<PerformanceStore>((set, get) => ({
  data: {
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
    isMonitoring: false,
    lastUpdate: 0,
  },

  startMonitoring: () =>
    set((state) => ({
      data: { ...state.data, isMonitoring: true, lastUpdate: Date.now() },
    })),

  stopMonitoring: () =>
    set((state) => ({
      data: { ...state.data, isMonitoring: false },
    })),

  updateMetrics: (metrics: PerformanceMetrics) => {
    const now = Date.now();
    if (now - get().data.lastUpdate > UPDATE_INTERVAL) {
      set((state) => ({
        data: {
          ...state.data,
          fps: metrics.fps,
          frameTime: metrics.frameTime,
          memoryUsage: metrics.memory,
          lastUpdate: now,
        },
      }));
    }
  },
}));
