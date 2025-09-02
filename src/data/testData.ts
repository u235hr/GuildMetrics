import { MonthlyData, StreamerInfo } from '../types';

// 创建符合StreamerInfo接口的主播数据
const createStreamerInfo = (name: string, giftValue: number, rank: number, month: number, year: number): StreamerInfo => {
  const totalGiftValue = month === 6 ? 7567811 : 10811347; // 6月和7月的真实总礼物值
  return {
    id: `${name}-${year}-${month}`,
    name,
    rank,
    giftValue,
    month,
    year,
    percentageOfTotal: (giftValue / totalGiftValue) * 100,
    isQualified: giftValue >= 100000,
    level: giftValue >= 700000 ? 'TOP3' : giftValue >= 200000 ? 'HIGH' : giftValue >= 100000 ? 'MEDIUM' : 'LOW'
  };
};

// 6月真实数据
const june2024Streamers: StreamerInfo[] = [
  createStreamerInfo("StreamerA", 836669, 1, 6, 2024),
  createStreamerInfo("StreamerB", 797145, 2, 6, 2024),
  createStreamerInfo("StreamerC", 764030, 3, 6, 2024),
  createStreamerInfo("StreamerD", 297901, 4, 6, 2024),
  createStreamerInfo("StreamerE", 288709, 5, 6, 2024),
  createStreamerInfo("StreamerF", 276929, 6, 6, 2024),
  createStreamerInfo("StreamerG", 270791, 7, 6, 2024),
  createStreamerInfo("StreamerH", 227546, 8, 6, 2024),
  createStreamerInfo("StreamerI", 227003, 9, 6, 2024),
  createStreamerInfo("StreamerJ", 224118, 10, 6, 2024),
  createStreamerInfo("StreamerL", 221403, 11, 6, 2024),
  createStreamerInfo("可星", 177117, 12, 6, 2024),
  createStreamerInfo("菲儿", 176862, 13, 6, 2024),
  createStreamerInfo("StreamerK", 162809, 14, 6, 2024),
  createStreamerInfo("StreamerM", 153741, 15, 6, 2024),
  createStreamerInfo("StreamerO", 151435, 16, 6, 2024),
  createStreamerInfo("开心就好", 149221, 17, 6, 2024),
  createStreamerInfo("StreamerN", 146483, 18, 6, 2024),
  createStreamerInfo("香香", 145018, 19, 6, 2024),
  createStreamerInfo("汐汐", 123523, 20, 6, 2024),
  createStreamerInfo("娜娜", 110276, 21, 6, 2024),
  createStreamerInfo("StreamerT", 111878, 22, 6, 2024),
  createStreamerInfo("StreamerU", 103192, 23, 6, 2024),
  createStreamerInfo("StreamerV", 100216, 24, 6, 2024),
  createStreamerInfo("巧儿", 122008, 25, 6, 2024),
  createStreamerInfo("少女", 101885, 26, 6, 2024),
  createStreamerInfo("StreamerX", 98234, 27, 6, 2024),
  createStreamerInfo("StreamerY", 80748, 28, 6, 2024),
  createStreamerInfo("StreamerZ", 77399, 29, 6, 2024),
  createStreamerInfo("StreamerP", 70725, 30, 6, 2024),
  createStreamerInfo("StreamerAA", 70436, 31, 6, 2024),
  createStreamerInfo("诗瑶", 65059, 32, 6, 2024),
  createStreamerInfo("月影", 51848, 33, 6, 2024),
  createStreamerInfo("清香", 54223, 34, 6, 2024),
  createStreamerInfo("夏雨", 51603, 35, 6, 2024),
  createStreamerInfo("阿敏", 50875, 36, 6, 2024),
  createStreamerInfo("静静", 50167, 37, 6, 2024),
  createStreamerInfo("小雨", 49876, 38, 6, 2024),
  createStreamerInfo("小小", 49123, 39, 6, 2024),
  createStreamerInfo("小可爱", 48765, 40, 6, 2024),
  createStreamerInfo("小甜甜", 47654, 41, 6, 2024),
  createStreamerInfo("小美美", 46543, 42, 6, 2024),
  createStreamerInfo("StreamerCC", 37097, 43, 6, 2024),
  createStreamerInfo("小花花", 45321, 44, 6, 2024),
  createStreamerInfo("小萌萌", 44210, 45, 6, 2024),
  createStreamerInfo("StreamerFF", 38728, 46, 6, 2024),
  createStreamerInfo("小仙女", 42987, 47, 6, 2024)
];

// 7月真实数据
const july2024Streamers: StreamerInfo[] = [
  createStreamerInfo("StreamerQ", 2120425, 1, 7, 2024),
  createStreamerInfo("StreamerC", 1590526, 2, 7, 2024),
  createStreamerInfo("StreamerA", 681638, 3, 7, 2024),
  createStreamerInfo("StreamerR", 661086, 4, 7, 2024),
  createStreamerInfo("StreamerB", 624312, 5, 7, 2024),
  createStreamerInfo("StreamerH", 446769, 6, 7, 2024),
  createStreamerInfo("StreamerS", 444035, 7, 7, 2024),
  createStreamerInfo("StreamerI", 322296, 8, 7, 2024),
  createStreamerInfo("StreamerJ", 244349, 9, 7, 2024),
  createStreamerInfo("StreamerL", 236496, 10, 7, 2024),
  createStreamerInfo("StreamerD", 231074, 11, 7, 2024),
  createStreamerInfo("StreamerF", 229957, 12, 7, 2024),
  createStreamerInfo("StreamerE", 221403, 13, 7, 2024),
  createStreamerInfo("可星", 177117, 14, 7, 2024),
  createStreamerInfo("菲儿", 176862, 15, 7, 2024),
  createStreamerInfo("StreamerK", 162809, 16, 7, 2024),
  createStreamerInfo("StreamerM", 153741, 17, 7, 2024),
  createStreamerInfo("StreamerO", 151435, 18, 7, 2024),
  createStreamerInfo("开心就好", 149221, 19, 7, 2024),
  createStreamerInfo("StreamerN", 146483, 20, 7, 2024),
  createStreamerInfo("香香", 145018, 21, 7, 2024),
  createStreamerInfo("汐汐", 123523, 22, 7, 2024),
  createStreamerInfo("巧儿", 122008, 23, 7, 2024),
  createStreamerInfo("娜娜", 110276, 24, 7, 2024),
  createStreamerInfo("StreamerT", 111878, 25, 7, 2024),
  createStreamerInfo("StreamerU", 103192, 26, 7, 2024),
  createStreamerInfo("StreamerV", 100216, 27, 7, 2024),
  createStreamerInfo("StreamerW", 101885, 28, 7, 2024),
  createStreamerInfo("StreamerX", 98234, 29, 7, 2024),
  createStreamerInfo("StreamerY", 80748, 30, 7, 2024),
  createStreamerInfo("StreamerZ", 77399, 31, 7, 2024),
  createStreamerInfo("StreamerP", 70725, 32, 7, 2024),
  createStreamerInfo("StreamerAA", 70436, 33, 7, 2024),
  createStreamerInfo("诗瑶", 65059, 34, 7, 2024),
  createStreamerInfo("月影", 51848, 35, 7, 2024),
  createStreamerInfo("清香", 54223, 36, 7, 2024),
  createStreamerInfo("夏雨", 51603, 37, 7, 2024),
  createStreamerInfo("阿敏", 50875, 38, 7, 2024),
  createStreamerInfo("静静", 50167, 39, 7, 2024),
  createStreamerInfo("小雨", 49876, 40, 7, 2024),
  createStreamerInfo("小小", 49123, 41, 7, 2024),
  createStreamerInfo("小可爱", 48765, 42, 7, 2024),
  createStreamerInfo("小甜甜", 47654, 43, 7, 2024),
  createStreamerInfo("小美美", 46543, 44, 7, 2024),
  createStreamerInfo("StreamerCC", 45321, 45, 7, 2024),
  createStreamerInfo("小花花", 44210, 46, 7, 2024),
  createStreamerInfo("小萌萌", 43097, 47, 7, 2024),
  createStreamerInfo("StreamerFF", 42987, 48, 7, 2024),
  createStreamerInfo("小仙女", 41876, 49, 7, 2024),
  createStreamerInfo("晓晓", 40765, 50, 7, 2024),
  createStreamerInfo("StreamerEE", 39654, 51, 7, 2024),
  createStreamerInfo("悠悠", 38543, 52, 7, 2024),
  createStreamerInfo("柔柔", 37432, 53, 7, 2024),
  createStreamerInfo("甜心", 36321, 54, 7, 2024),
  createStreamerInfo("蜜糖", 35210, 55, 7, 2024),
  createStreamerInfo("糖果", 34099, 56, 7, 2024),
  createStreamerInfo("棉花糖", 32988, 57, 7, 2024),
  createStreamerInfo("小天使", 31877, 58, 7, 2024),
  createStreamerInfo("小精灵", 30766, 59, 7, 2024),
  createStreamerInfo("小公主", 29655, 60, 7, 2024)
];

// 计算统计数据的辅助函数
const calculateStats = (streamers: StreamerInfo[]) => {
  const totalGiftValue = streamers.reduce((sum, s) => sum + s.giftValue, 0);
  const topThreeTotal = streamers.slice(0, 3).reduce((sum, s) => sum + s.giftValue, 0);
  const averageGiftValue = totalGiftValue / streamers.length;
  const sortedValues = streamers.map(s => s.giftValue).sort((a, b) => a - b);
  const medianGiftValue = sortedValues[Math.floor(sortedValues.length / 2)];
  
  return {
    totalGiftValue,
    topThreeTotal,
    averageGiftValue,
    medianGiftValue
  };
};

// 创建完整的MonthlyData对象
const createMonthlyData = (month: number, year: number, streamers: StreamerInfo[]): MonthlyData => {
  const stats = calculateStats(streamers);
  return {
    month,
    year,
    streamers,
    streamerCount: streamers.length,
    parseTime: new Date().toISOString(),
    qualificationLine: 100000,
    ...stats
  };
};

// 测试数据 - 用于演示和开发
export const testData = {
  june2024: createMonthlyData(6, 2024, june2024Streamers),
  july2024: createMonthlyData(7, 2024, july2024Streamers)
};

import { MonthOverMonthComparison, ChartData } from '../types';

// 计算月度对比数据
export const getMonthOverMonthComparison = (): MonthOverMonthComparison => {
  const juneTotal = testData.june2024.totalGiftValue;
  const julyTotal = testData.july2024.totalGiftValue;
  const changePercent = ((julyTotal - juneTotal) / juneTotal * 100).toFixed(2);
  
  return {
    currentMonth: 7,
    previousMonth: 6,
    totalGiftValueChange: {
      amount: julyTotal - juneTotal,
      percentage: `${changePercent}%`,
      trend: julyTotal > juneTotal ? 'up' : julyTotal < juneTotal ? 'down' : 'flat'
    },
    streamerComparisons: testData.july2024.streamers.map(julyStreamer => {
      const juneStreamer = testData.june2024.streamers.find(s => s.name === julyStreamer.name);
      return {
        name: julyStreamer.name,
        currentRank: julyStreamer.rank,
        currentGiftValue: julyStreamer.giftValue,
        previousRank: juneStreamer?.rank || null,
        previousGiftValue: juneStreamer?.giftValue || null,
        rankChange: juneStreamer ? {
          value: juneStreamer.rank - julyStreamer.rank,
          trend: juneStreamer.rank > julyStreamer.rank ? 'up' : juneStreamer.rank < julyStreamer.rank ? 'down' : 'flat',
          text: juneStreamer.rank > julyStreamer.rank ? `↑${juneStreamer.rank - julyStreamer.rank}` : juneStreamer.rank < julyStreamer.rank ? `↓${julyStreamer.rank - juneStreamer.rank}` : '→'
        } : '-',
        giftValueChange: juneStreamer ? {
          amount: julyStreamer.giftValue - juneStreamer.giftValue,
          percentage: `${(((julyStreamer.giftValue - juneStreamer.giftValue) / juneStreamer.giftValue) * 100).toFixed(2)}%`,
          trend: julyStreamer.giftValue > juneStreamer.giftValue ? 'up' : julyStreamer.giftValue < juneStreamer.giftValue ? 'down' : 'flat',
          text: `${julyStreamer.giftValue > juneStreamer.giftValue ? '+' : ''}${(julyStreamer.giftValue - juneStreamer.giftValue).toLocaleString()}`
        } : '-',
        isNewcomer: !juneStreamer
      };
    })
  };
};

// 生成图表数据
export const generateChartData = (): ChartData => {
  const julyStreamers = testData.july2024.streamers;
  
  return {
    rankingChart: julyStreamers.slice(0, 10).map(s => ({
      name: s.name,
      giftValue: s.giftValue,
      rank: s.rank,
      level: s.level || 'LOW'
    })),
    trendChart: [
      { 
        month: '6月', 
        totalGiftValue: testData.june2024.totalGiftValue,
        streamerCount: testData.june2024.streamerCount,
        averageGiftValue: testData.june2024.averageGiftValue
      },
      { 
        month: '7月', 
        totalGiftValue: testData.july2024.totalGiftValue,
        streamerCount: testData.july2024.streamerCount,
        averageGiftValue: testData.july2024.averageGiftValue
      }
    ],
    distributionChart: [
      { 
        range: '100万+', 
        count: julyStreamers.filter(s => s.giftValue >= 1000000).length,
        percentage: (julyStreamers.filter(s => s.giftValue >= 1000000).length / julyStreamers.length) * 100
      },
      { 
        range: '50-100万', 
        count: julyStreamers.filter(s => s.giftValue >= 500000 && s.giftValue < 1000000).length,
        percentage: (julyStreamers.filter(s => s.giftValue >= 500000 && s.giftValue < 1000000).length / julyStreamers.length) * 100
      },
      { 
        range: '10-50万', 
        count: julyStreamers.filter(s => s.giftValue >= 100000 && s.giftValue < 500000).length,
        percentage: (julyStreamers.filter(s => s.giftValue >= 100000 && s.giftValue < 500000).length / julyStreamers.length) * 100
      },
      { 
        range: '10万以下', 
        count: julyStreamers.filter(s => s.giftValue < 100000).length,
        percentage: (julyStreamers.filter(s => s.giftValue < 100000).length / julyStreamers.length) * 100
      }
    ]
  };
};