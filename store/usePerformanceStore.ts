// store/usePerformanceStore.ts
import { create } from 'zustand';

interface PerformanceData {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  isMonitoring: boolean;
  lastUpdate: number;
  wiggleX: number;
  wiggleY: number;
}

interface PerformanceStore {
  data: PerformanceData;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  updateFps: (fps: number) => void;
  updateFrameTime: (frameTime: number) => void;
  updateMemoryUsage: (memory: number) => void;
  updateWiggle: (wiggleX: number, wiggleY: number) => void;
}

export const usePerformanceStore = create<PerformanceStore>((set, get) => ({
  data: {
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
    isMonitoring: false,
    lastUpdate: 0,
    wiggleX: 0,
    wiggleY: 0,
  },
  
  startMonitoring: () => set(state => ({
    data: { ...state.data, isMonitoring: true }
  })),
  
  stopMonitoring: () => set(state => ({
    data: { ...state.data, isMonitoring: false }
  })),
  
  updateFps: (fps: number) => set(state => ({
    data: { ...state.data, fps, lastUpdate: Date.now() }
  })),
  
  updateFrameTime: (frameTime: number) => set(state => ({
    data: { ...state.data, frameTime }
  })),
  
  updateMemoryUsage: (memory: number) => set(state => ({
    data: { ...state.data, memoryUsage: memory }
  })),
  
  updateWiggle: (wiggleX: number, wiggleY: number) => set(state => ({
    data: { ...state.data, wiggleX, wiggleY }
  })),
}));
