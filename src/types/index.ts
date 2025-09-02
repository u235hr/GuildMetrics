/**
 * 直播公会主播礼物流水数据看板系统 - 核心数据类型
 * 数值统一使用"礼物值"作为名称
 */



// 主播基本信息
export interface StreamerInfo {
  id: string;                    // 唯一标识符
  name: string;                  // 主播名称
  rank: number;                  // 当前排名
  originalRank?: number;         // 原始排名（用于标记排名修正）
  giftValue: number;             // 礼物值（统一名称）
  month: number;                 // 月份
  year: number;                  // 年份
  correctedRank?: boolean;       // 是否修正过排名
  percentageOfTotal: number;     // 占总礼物值的百分比
  isQualified?: boolean;         // 是否达到合格线
  avatar?: string;               // 头像URL
  level?: 'TOP3' | 'HIGH' | 'MEDIUM' | 'LOW'; // 等级分类
}

// 月度数据统计
export interface MonthlyData {
  month: number;                 // 月份
  year: number;                  // 年份
  totalGiftValue: number;        // 总礼物值
  streamerCount: number;         // 主播数量
  streamers: StreamerInfo[];     // 主播列表
  parseTime: string;             // 解析时间
  qualificationLine?: number;    // 合格线
  topThreeTotal: number;         // 前三名总礼物值
  averageGiftValue: number;      // 平均礼物值
  medianGiftValue: number;       // 中位数礼物值
}

// 环比分析数据
export interface MonthOverMonthComparison {
  currentMonth: number;
  previousMonth: number | null;
  totalGiftValueChange: {
    amount: number;
    percentage: string;
    trend: 'up' | 'down' | 'flat';
  } | '-';
  streamerComparisons: StreamerComparison[];
}

// 主播环比数据
export interface StreamerComparison {
  name: string;
  currentRank: number;
  currentGiftValue: number;      // 当前礼物值
  previousRank: number | null;
  previousGiftValue: number | null; // 上月礼物值
  rankChange: {
    value: number;
    trend: 'up' | 'down' | 'flat';
    text: string;
  } | '-';
  giftValueChange: {             // 礼物值变化
    amount: number;
    percentage: string;
    trend: 'up' | 'down' | 'flat';
    text: string;
  } | '-';
  isNewcomer: boolean;           // 是否新人
}

// 数据验证结果
export interface ValidationResult {
  isValid: boolean;
  warnings: ValidationWarning[];
  corrections: DataCorrection[];
  totalGiftValueMatch: boolean;  // 总礼物值是否匹配
}





// 验证警告
export interface ValidationWarning {
  type: 'DUPLICATE_RANK' | 'MISSING_RANK' | 'INVALID_GIFT_VALUE' | 'TOTAL_MISMATCH';
  message: string;
  affectedStreamers?: string[];
  rank?: number;
}

// 数据修正
export interface DataCorrection {
  type: 'RANK_CORRECTION' | 'GIFT_VALUE_CORRECTION';
  streamerName: string;
  originalValue: number;
  correctedValue: number;
  reason: string;
}

// 统计概览
export interface StatisticsSummary {
  totalGiftValue: number;        // 总礼物值
  streamerCount: number;         // 主播数量
  averageGiftValue: number;      // 平均礼物值
  topThreePercentage: number;    // 前三名占比
  qualifiedCount: number;        // 达标人数
  qualificationRate: number;     // 达标率
  giftValueDistribution: {       // 礼物值分布
    topTier: number;     // 顶级（>700K）
    highTier: number;    // 高级（200K-700K）
    mediumTier: number;  // 中级（100K-200K）
    lowTier: number;     // 低级（<100K）
  };
}

// 图表数据
export interface ChartData {
  rankingChart: {
    name: string;
    giftValue: number;           // 礼物值
    rank: number;
    level: string;
  }[];
  trendChart: {
    month: string;
    totalGiftValue: number;      // 总礼物值
    streamerCount: number;
    averageGiftValue: number;    // 平均礼物值
  }[];
  distributionChart: {
    range: string;
    count: number;
    percentage: number;
  }[];
}

// 导出选项
export interface ExportOptions {
  format: 'xlsx' | 'csv' | 'pdf';
  includeCharts: boolean;
  includeComparison: boolean;
  dateRange: {
    start: string;
    end: string;
  };
}

// 用户设置
export interface UserSettings {
  qualificationLine: number;     // 合格线设置
  displayMode: 'table' | 'card' | 'mixed';
  theme: 'light' | 'dark';
  autoRefresh: boolean;
  refreshInterval: number;       // 刷新间隔（分钟）
  notifications: {
    newData: boolean;
    rankingChanges: boolean;
    qualificationAlert: boolean;
  };
}

// API响应格式
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

// 错误信息
export interface ErrorInfo {
  code: string;
  message: string;
  details?: unknown;
  timestamp: string;
}

// 文件上传状态
export interface UploadStatus {
  status: 'idle' | 'uploading' | 'parsing' | 'success' | 'error';
  progress: number;
  message?: string;
  result?: MonthlyData;
  error?: ErrorInfo;
}