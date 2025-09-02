/**
 * 多月数据管理器 - 管理多个月份的数据，实现环比分析
 * 核心功能：数据存储、环比计算、趋势分析
 */

import type { 
  MonthlyData, 
  StreamerInfo, 
  MonthOverMonthComparison, 
  StreamerComparison,
  StatisticsSummary,
  ChartData
} from '../types';
import { MonthlyDataParser } from './monthlyDataParser';

export class MultiMonthDataManager {
  private monthlyData: Map<number, MonthlyData> = new Map();
  private parser: MonthlyDataParser;

  constructor() {
    this.parser = new MonthlyDataParser();
  }

  /**
   * 添加月度数据
   * @param filename 文件名
   * @param content 文件内容
   * @returns 解析后的数据
   */
  addMonthData(filename: string, content: string): MonthlyData | null;
  addMonthData(month: number, data: MonthlyData): void;
  addMonthData(filenameOrMonth: string | number, contentOrData: string | MonthlyData): MonthlyData | null | void {
    if (typeof filenameOrMonth === 'string' && typeof contentOrData === 'string') {
      // 原有的解析逻辑
      const data = this.parser.parseMonthlyData(contentOrData, filenameOrMonth);
      if (data) {
        this.monthlyData.set(data.month, data);
        console.log(`成功添加 ${data.month} 月数据，共 ${data.streamerCount} 位主播`);
        return data;
      }
      return null;
    } else if (typeof filenameOrMonth === 'number' && typeof contentOrData === 'object') {
      // 直接添加已解析的数据
      this.monthlyData.set(filenameOrMonth, contentOrData);
      console.log(`成功添加 ${filenameOrMonth} 月数据，共 ${contentOrData.streamerCount} 位主播`);
    }
  }

  /**
   * 获取所有可用月份
   * @returns 月份数组（按升序排列）
   */
  getAvailableMonths(): number[] {
    return Array.from(this.monthlyData.keys()).sort((a, b) => a - b);
  }

  /**
   * 获取当前月份数据（最新月份）
   * @returns 当前月份数据
   */
  getCurrentMonthData(): MonthlyData | null {
    const months = this.getAvailableMonths();
    if (months.length === 0) return null;
    return this.monthlyData.get(months[months.length - 1]) || null;
  }

  /**
   * 获取上月数据
   * @returns 上月数据
   */
  getPreviousMonthData(): MonthlyData | null {
    const months = this.getAvailableMonths();
    if (months.length < 2) return null;
    return this.monthlyData.get(months[months.length - 2]) || null;
  }

  /**
   * 获取指定月份数据
   * @param month 月份
   * @returns 月份数据
   */
  getMonthData(month: number): MonthlyData | null {
    return this.monthlyData.get(month) || null;
  }

  /**
   * 计算环比数据
   * @returns 环比分析结果
   */
  calculateMonthOverMonthComparison(): MonthOverMonthComparison | null {
    const currentData = this.getCurrentMonthData();
    const previousData = this.getPreviousMonthData();

    if (!currentData) return null;

    const comparison: MonthOverMonthComparison = {
      currentMonth: currentData.month,
      previousMonth: previousData?.month || null,
      totalGiftValueChange: '-',
      streamerComparisons: [],
    };

    // 总流水环比
    if (previousData) {
      const change = currentData.totalGiftValue - previousData.totalGiftValue;
      const changePercent = ((change / previousData.totalGiftValue) * 100).toFixed(1);
      comparison.totalGiftValueChange = {
        amount: change,
        percentage: changePercent,
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'flat',
      };
    }

    // 主播环比分析
    currentData.streamers.forEach(currentStreamer => {
      const previousStreamer = previousData?.streamers.find(s => s.name === currentStreamer.name);

      const streamerComparison: StreamerComparison = {
        name: currentStreamer.name,
        currentRank: currentStreamer.rank,
        currentGiftValue: currentStreamer.giftValue,
        previousRank: previousStreamer?.rank || null,
        previousGiftValue: previousStreamer?.giftValue || null,
        rankChange: '-',
        giftValueChange: '-',
        isNewcomer: !previousStreamer,
      };

      if (previousStreamer) {
        // 排名变化（数值越小排名越高）
        const rankDiff = previousStreamer.rank - currentStreamer.rank;
        streamerComparison.rankChange = {
          value: rankDiff,
          trend: rankDiff > 0 ? 'up' : rankDiff < 0 ? 'down' : 'flat',
          text: rankDiff > 0 ? `↑${rankDiff}` : rankDiff < 0 ? `↓${Math.abs(rankDiff)}` : '-',
        };

        // 礼物值变化
        const giftValueDiff = currentStreamer.giftValue - previousStreamer.giftValue;
        const giftValuePercent = previousStreamer.giftValue > 0 
          ? ((giftValueDiff / previousStreamer.giftValue) * 100).toFixed(1)
          : '0.0';
        
        streamerComparison.giftValueChange = {
          amount: giftValueDiff,
          percentage: giftValuePercent,
          trend: giftValueDiff > 0 ? 'up' : giftValueDiff < 0 ? 'down' : 'flat',
          text: giftValueDiff > 0 ? `+${giftValuePercent}%` : `${giftValuePercent}%`,
        };
      }

      comparison.streamerComparisons.push(streamerComparison);
    });

    // 按当前排名排序
    comparison.streamerComparisons.sort((a, b) => a.currentRank - b.currentRank);

    return comparison;
  }

  /**
   * 生成统计概览
   * @param month 指定月份，不指定则使用当前月份
   * @returns 统计概览
   */
  generateStatisticsSummary(month?: number): StatisticsSummary | null {
    const data = month ? this.getMonthData(month) : this.getCurrentMonthData();
    if (!data) return null;

    const { streamers, totalGiftValue } = data;
    const averageGiftValue = totalGiftValue / streamers.length;
    const topThreePercentage = parseFloat(((data.topThreeTotal / totalGiftValue) * 100).toFixed(1));

    // 计算合格人数（假设合格线为100,000）
    const qualificationLine = data.qualificationLine || 100000;
    const qualifiedCount = streamers.filter(s => s.giftValue >= qualificationLine).length;
    const qualificationRate = parseFloat(((qualifiedCount / streamers.length) * 100).toFixed(1));

    // 礼物值分布统计
    const giftValueDistribution = {
      topTier: streamers.filter(s => s.giftValue > 700000).length,
      highTier: streamers.filter(s => s.giftValue >= 200000 && s.giftValue <= 700000).length,
      mediumTier: streamers.filter(s => s.giftValue >= 100000 && s.giftValue < 200000).length,
      lowTier: streamers.filter(s => s.giftValue < 100000).length,
    };

    return {
      totalGiftValue,
      streamerCount: streamers.length,
      averageGiftValue,
      topThreePercentage,
      qualifiedCount,
      qualificationRate,
      giftValueDistribution,
    };
  }

  /**
   * 生成图表数据
   * @returns 图表数据
   */
  generateChartData(): ChartData {
    const months = this.getAvailableMonths();
    
    // 排名图表数据（当前月份）
    const currentData = this.getCurrentMonthData();
    const rankingChart = currentData ? currentData.streamers.slice(0, 20).map(streamer => ({
      name: streamer.name,
      giftValue: streamer.giftValue,
      rank: streamer.rank,
      level: streamer.level || 'LOW',
    })) : [];

    // 趋势图表数据
    const trendChart = months.map(month => {
      const data = this.getMonthData(month)!;
      return {
        month: `${month}月`,
        totalGiftValue: data.totalGiftValue,
        streamerCount: data.streamerCount,
        averageGiftValue: data.averageGiftValue,
      };
    });

    // 分布图表数据（当前月份）
    const distributionChart = currentData ? [
      { range: '70万+', count: currentData.streamers.filter(s => s.giftValue > 700000).length, percentage: 0 },
      { range: '20-70万', count: currentData.streamers.filter(s => s.giftValue >= 200000 && s.giftValue <= 700000).length, percentage: 0 },
      { range: '10-20万', count: currentData.streamers.filter(s => s.giftValue >= 100000 && s.giftValue < 200000).length, percentage: 0 },
      { range: '10万以下', count: currentData.streamers.filter(s => s.giftValue < 100000).length, percentage: 0 },
    ].map(item => ({
      ...item,
      percentage: parseFloat(((item.count / currentData.streamerCount) * 100).toFixed(1)),
    })) : [];

    return {
      rankingChart,
      trendChart,
      distributionChart,
    };
  }

  /**
   * 搜索主播
   * @param keyword 关键词
   * @param month 指定月份
   * @returns 搜索结果
   */
  searchStreamers(keyword: string, month?: number): StreamerInfo[] {
    const data = month ? this.getMonthData(month) : this.getCurrentMonthData();
    if (!data) return [];

    const lowercaseKeyword = keyword.toLowerCase();
    return data.streamers.filter(streamer => 
      streamer.name.toLowerCase().includes(lowercaseKeyword)
    );
  }

  /**
   * 获取指定排名范围的主播
   * @param startRank 开始排名
   * @param endRank 结束排名
   * @param month 指定月份
   * @returns 主播列表
   */
  getStreamersByRankRange(startRank: number, endRank: number, month?: number): StreamerInfo[] {
    const data = month ? this.getMonthData(month) : this.getCurrentMonthData();
    if (!data) return [];

    return data.streamers.filter(streamer => 
      streamer.rank >= startRank && streamer.rank <= endRank
    );
  }

  /**
   * 获取前N名主播
   * @param topN 前N名
   * @param month 指定月份
   * @returns 主播列表
   */
  getTopStreamers(topN: number = 10, month?: number): StreamerInfo[] {
    const data = month ? this.getMonthData(month) : this.getCurrentMonthData();
    if (!data) return [];

    return data.streamers.slice(0, topN);
  }

  /**
   * 清除所有数据
   */
  clearAllData(): void {
    this.monthlyData.clear();
    console.log('已清除所有月度数据');
  }

  /**
   * 删除指定月份数据
   * @param month 月份
   */
  removeMonthData(month: number): boolean {
    const success = this.monthlyData.delete(month);
    if (success) {
      console.log(`已删除 ${month} 月数据`);
    }
    return success;
  }

  /**
   * 获取数据概览
   * @returns 数据概览信息
   */
  getDataOverview() {
    const months = this.getAvailableMonths();
    const overview = {
      totalMonths: months.length,
      monthRange: months.length > 0 ? `${months[0]}月 - ${months[months.length - 1]}月` : '无数据',
      totalStreamers: 0,
      totalGiftValue: 0,
    };

    months.forEach(month => {
      const data = this.getMonthData(month);
      if (data) {
        overview.totalGiftValue += data.totalGiftValue;
        // 使用最新月份的主播数量
        if (month === months[months.length - 1]) {
          overview.totalStreamers = data.streamerCount;
        }
      }
    });

    return overview;
  }
}