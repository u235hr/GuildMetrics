import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { ChartData, UploadStatus, UserSettings as TypesUserSettings, MonthOverMonthComparison, MonthlyData, StreamerInfo } from '../types';
import { MultiMonthDataManager } from '../utils/multiMonthDataManager';
import { testData, getMonthOverMonthComparison, generateChartData } from '../data/testData';

export interface UserSettings extends TypesUserSettings {
  language: 'zh' | 'en';
  defaultView: 'dashboard' | 'analysis' | 'comparison';
  chartAnimations: boolean;
  compactMode: boolean;
  showTooltips: boolean;
}

export interface AppState {
  // 数据状态
  monthlyData: Map<number, MonthlyData>;
  currentMonthData: StreamerInfo[];
  selectedMonth: number | null;
  availableMonths: number[];
  monthOverMonthComparison: MonthOverMonthComparison | null;
  
  // UI状态
  searchKeyword: string;
  selectedRankRange: [number, number];
  showOnlyQualified: boolean;
  
  // 上传状态
  uploadStatus: UploadStatus;
  
  // 用户设置
  userSettings: UserSettings;
  
  // 图表数据
  chartData: ChartData;
  
  // Actions
  setSearchKeyword: (keyword: string) => void;
  setSelectedRankRange: (range: [number, number]) => void;
  setShowOnlyQualified: (show: boolean) => void;
  setSelectedMonth: (month: number | null) => void;
  setUploadStatus: (status: Partial<UploadStatus>) => void;
  loadMonthData: (filename: string, content: string) => Promise<void>;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  updateRelatedData: (month: number, data: MonthlyData) => void;
  clearAllData: () => void;
  initializeWithTestData: () => void;
}

const defaultSettings: UserSettings = {
  qualificationLine: 100000,
  displayMode: 'table',
  theme: 'dark',
  language: 'zh',
  autoRefresh: false,
  refreshInterval: 30,
  defaultView: 'dashboard',
  chartAnimations: true,
  compactMode: false,
  showTooltips: true,
  notifications: {
    newData: true,
    rankingChanges: true,
    qualificationAlert: true,
  },
};

const dataManager = new MultiMonthDataManager();

// 初始化测试数据
const initializeTestData = () => {
  // 添加6月数据
  dataManager.addMonthData(6, testData.june2024);
  // 添加7月数据
  dataManager.addMonthData(7, testData.july2024);
  
  return {
    availableMonths: [6, 7],
    currentMonthData: testData.july2024.streamers,
    selectedMonth: 7,
    monthOverMonthComparison: getMonthOverMonthComparison(),
    chartData: generateChartData()
  };
};

// 获取初始状态（包含测试数据）
const getInitialState = () => {
  const testDataState = initializeTestData();
  return {
    monthlyData: new Map(),
    searchKeyword: '',
    selectedRankRange: [1, 100] as [number, number],
    showOnlyQualified: false,
    uploadStatus: {
      status: 'idle' as const,
      progress: 0,
      message: '',
    },
    userSettings: defaultSettings,
    ...testDataState,
  };
};

const initialState = getInitialState();

const appActions = (set: (partial: Partial<AppState> | ((state: AppState) => Partial<AppState>)) => void, get: () => AppState) => ({
  setSearchKeyword: (keyword: string) => set({ searchKeyword: keyword }),
  setSelectedRankRange: (range: [number, number]) => set({ selectedRankRange: range }),
  setShowOnlyQualified: (show: boolean) => set({ showOnlyQualified: show }),
  setSelectedMonth: (month: number | null) => set({ selectedMonth: month }),
  setUploadStatus: (status: Partial<UploadStatus>) => 
    set((state: AppState) => ({
      uploadStatus: { ...state.uploadStatus, ...status }
    })),
  loadMonthData: async (filename: string, content: string) => {
    try {
      const result = dataManager.addMonthData(filename, content);
      if (result) {
        set({
          availableMonths: dataManager.getAvailableMonths(),
          uploadStatus: { status: 'success', progress: 100, message: '数据导入成功' }
        });
      } else {
        set({
          uploadStatus: { status: 'error', progress: 0, message: '数据解析失败' }
        });
      }
    } catch (error) {
      set({
        uploadStatus: { status: 'error', progress: 0, message: '数据导入失败' }
      });
    }
  },
  updateUserSettings: (settings: Partial<UserSettings>) => 
    set((state: AppState) => ({
      userSettings: { ...state.userSettings, ...settings }
    })),
  updateRelatedData: (month: number, data: MonthlyData) => {
    dataManager.addMonthData(month.toString(), JSON.stringify(data));
    const availableMonths = dataManager.getAvailableMonths();
    const monthData = dataManager.getMonthData(month);
    const monthOverMonthComparison = dataManager.calculateMonthOverMonthComparison();
    set({
      availableMonths,
      currentMonthData: monthData?.streamers || [],
      monthOverMonthComparison,
    });
  },
  clearAllData: () => {
    dataManager.clearAllData();
    set({
      monthlyData: new Map(),
      currentMonthData: [],
      selectedMonth: null,
      availableMonths: [],
      monthOverMonthComparison: null,
    });
  },
  initializeWithTestData: () => {
    const testDataState = initializeTestData();
    set(testDataState);
  },
});

// 创建基础store（不带持久化）
const createBaseStore = () => create<AppState>()(subscribeWithSelector((set, get) => ({
  ...initialState,
  ...appActions(set, get),
})));

// 创建带持久化的store
const createPersistedStore = () => create<AppState>()(persist(
  subscribeWithSelector(
    devtools(
      (set, get) => ({
        ...initialState,
        ...appActions(set, get),
      }),
      {
        name: 'streamer-dashboard-store',
      }
    )
  ),
  {
    name: 'streamer-dashboard-storage',
    partialize: (state) => ({
      // 只保存基本设置，避免序列化包含中文的复杂数据
      selectedMonth: state.selectedMonth,
      userSettings: {
        qualificationLine: state.userSettings.qualificationLine,
        displayMode: state.userSettings.displayMode,
        theme: state.userSettings.theme,
        language: state.userSettings.language,
        autoRefresh: state.userSettings.autoRefresh,
        refreshInterval: state.userSettings.refreshInterval,
        defaultView: state.userSettings.defaultView,
        chartAnimations: state.userSettings.chartAnimations,
        compactMode: state.userSettings.compactMode,
        showTooltips: state.userSettings.showTooltips,
      },
    }),
  }
));

// 简单的store创建
export const useAppStore = typeof window === 'undefined' 
  ? createBaseStore()
  : createPersistedStore();

// 导出各种hooks
export const useSearchKeyword = () => useAppStore((state) => state.searchKeyword);
export const useSelectedRankRange = () => useAppStore((state) => state.selectedRankRange);
export const useShowOnlyQualified = () => useAppStore((state) => state.showOnlyQualified);
export const useSelectedMonth = () => useAppStore((state) => state.selectedMonth);
export const useAvailableMonths = () => useAppStore((state) => state.availableMonths);
export const useCurrentMonthData = () => useAppStore((state) => state.currentMonthData);
export const useUploadStatus = () => useAppStore((state) => state.uploadStatus);
export const useUserSettings = () => useAppStore((state) => state.userSettings);
export const useChartData = () => useAppStore((state) => state.chartData);

// 新的选择器
export const useCurrentMonthDataSelector = () => useAppStore((state) => state.currentMonthData);
export const useSearchKeywordSelector = () => useAppStore((state) => state.searchKeyword);
export const useSelectedRankRangeSelector = () => useAppStore((state) => state.selectedRankRange);
export const useShowOnlyQualifiedSelector = () => useAppStore((state) => state.showOnlyQualified);

// 过滤逻辑移到组件中使用 useMemo
export const filterStreamers = (currentMonthData: StreamerInfo[], searchKeyword: string, selectedRankRange: [number, number], showOnlyQualified: boolean) => {
  if (!currentMonthData || currentMonthData.length === 0) {
    return [];
  }
  
  return currentMonthData.filter((streamer: StreamerInfo) => {
    // 搜索关键词过滤
    if (searchKeyword && !streamer.name?.toLowerCase().includes(searchKeyword.toLowerCase())) {
      return false;
    }
    
    // 排名范围过滤
    if (streamer.rank < selectedRankRange[0] || streamer.rank > selectedRankRange[1]) {
      return false;
    }
    
    // 合格主播过滤
    if (showOnlyQualified && !streamer.isQualified) {
      return false;
    }
    
    return true;
  });
};

// 月度环比分析 hook
export const useMonthComparison = () => useAppStore((state) => state.monthOverMonthComparison);
