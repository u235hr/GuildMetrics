/**
 * 多月数据管理器测试
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MultiMonthDataManager } from '../utils/multiMonthDataManager';
import { mockMonthlyData, mockPreviousMonthData, TestUtils } from './testUtils';

describe('MultiMonthDataManager', () => {
  let manager: MultiMonthDataManager;

  beforeEach(() => {
    manager = new MultiMonthDataManager();
  });

  describe('calculateMonthOverMonthComparison', () => {
    it('应该正确计算环比分析', () => {
      const result = manager.calculateMonthOverMonthComparison(
        mockMonthlyData,
        mockPreviousMonthData
      );

      expect(result).toBeDefined();
      expect(result.totalGiftValueChange).toBeDefined();
      expect(result.streamerComparisons).toBeDefined();
      expect(result.streamerComparisons.length).toBeGreaterThan(0);
    });

    it('应该正确计算总礼物值变化', () => {
      const currentData = TestUtils.createMockMonthlyData(7, 2024, 3);
      currentData.totalGiftValue = 1000000;
      
      const previousData = TestUtils.createMockMonthlyData(6, 2024, 3);
      previousData.totalGiftValue = 800000;

      const result = manager.calculateMonthOverMonthComparison(currentData, previousData);

      expect(result.totalGiftValueChange.trend).toBe('up');
      expect(parseFloat(result.totalGiftValueChange.percentage)).toBeCloseTo(25, 1);
    });

    it('应该正确处理总礼物值下降的情况', () => {
      const currentData = TestUtils.createMockMonthlyData(7, 2024, 3);
      currentData.totalGiftValue = 800000;
      
      const previousData = TestUtils.createMockMonthlyData(6, 2024, 3);
      previousData.totalGiftValue = 1000000;

      const result = manager.calculateMonthOverMonthComparison(currentData, previousData);

      expect(result.totalGiftValueChange.trend).toBe('down');
      expect(parseFloat(result.totalGiftValueChange.percentage)).toBeCloseTo(20, 1);
    });

    it('应该正确处理总礼物值持平的情况', () => {
      const currentData = TestUtils.createMockMonthlyData(7, 2024, 3);
      currentData.totalGiftValue = 1000000;
      
      const previousData = TestUtils.createMockMonthlyData(6, 2024, 3);
      previousData.totalGiftValue = 1000000;

      const result = manager.calculateMonthOverMonthComparison(currentData, previousData);

      expect(result.totalGiftValueChange.trend).toBe('flat');
      expect(parseFloat(result.totalGiftValueChange.percentage)).toBe(0);
    });

    it('应该正确计算主播个人变化', () => {
      // 创建有共同主播的测试数据
      const currentStreamers = [
        { id: '1', name: 'StreamerA', rank: 1, giftValue: 900000, originalRank: 1, percentageOfTotal: 45, level: 'TOP3', corrected: false },
        { id: '2', name: 'StreamerB', rank: 2, giftValue: 700000, originalRank: 2, percentageOfTotal: 35, level: 'TOP3', corrected: false },
        { id: '3', name: 'StreamerC', rank: 3, giftValue: 400000, originalRank: 3, percentageOfTotal: 20, level: 'TOP3', corrected: false },
      ];

      const previousStreamers = [
        { id: '1', name: 'StreamerA', rank: 2, giftValue: 800000, originalRank: 2, percentageOfTotal: 40, level: 'TOP3', corrected: false },
        { id: '2', name: 'StreamerB', rank: 1, giftValue: 850000, originalRank: 1, percentageOfTotal: 42.5, level: 'TOP3', corrected: false },
        { id: '3', name: 'StreamerC', rank: 3, giftValue: 350000, originalRank: 3, percentageOfTotal: 17.5, level: 'TOP3', corrected: false },
      ];

      const currentData = { ...mockMonthlyData, streamers: currentStreamers };
      const previousData = { ...mockPreviousMonthData, streamers: previousStreamers };

      const result = manager.calculateMonthOverMonthComparison(currentData, previousData);

      const baoerComparison = result.streamerComparisons.find(c => c.name === 'StreamerA');
      expect(baoerComparison).toBeDefined();
      expect(baoerComparison?.rankChange.trend).toBe('up'); // 从第2名升到第1名
      expect(baoerComparison?.giftValueChange.trend).toBe('up'); // 礼物值增长
    });

    it('应该正确处理新增主播', () => {
      const currentStreamers = [
        ...mockMonthlyData.streamers,
        { id: '6', name: '新主播', rank: 6, giftValue: 100000, originalRank: 6, percentageOfTotal: 1.5, level: 'LOW', corrected: false },
      ];

      const currentData = { ...mockMonthlyData, streamers: currentStreamers };
      const result = manager.calculateMonthOverMonthComparison(currentData, mockPreviousMonthData);

      const newStreamerComparison = result.streamerComparisons.find(c => c.name === '新主播');
      expect(newStreamerComparison?.rankChange).toBe('-');
      expect(newStreamerComparison?.giftValueChange).toBe('-');
    });

    it('应该正确处理离开的主播', () => {
      // 移除一个主播
      const currentStreamers = mockMonthlyData.streamers.slice(0, 2);
      const currentData = { ...mockMonthlyData, streamers: currentStreamers };

      const result = manager.calculateMonthOverMonthComparison(currentData, mockPreviousMonthData);

      // 离开的主播应该不在结果中
      const leftStreamerComparison = result.streamerComparisons.find(c => c.name === 'StreamerC');
      expect(leftStreamerComparison).toBeUndefined();
    });
  });

  describe('calculateStreamerComparison', () => {
    it('应该正确计算排名上升', () => {
      const currentStreamer = { rank: 2, giftValue: 500000 };
      const previousStreamer = { rank: 5, giftValue: 300000 };

      const rankChange = manager.calculateStreamerComparison(
        currentStreamer,
        previousStreamer,
        'rank'
      );

      expect(rankChange.trend).toBe('up');
      expect(rankChange.text).toBe('↑3');
    });

    it('应该正确计算排名下降', () => {
      const currentStreamer = { rank: 5, giftValue: 300000 };
      const previousStreamer = { rank: 2, giftValue: 500000 };

      const rankChange = manager.calculateStreamerComparison(
        currentStreamer,
        previousStreamer,
        'rank'
      );

      expect(rankChange.trend).toBe('down');
      expect(rankChange.text).toBe('↓3');
    });

    it('应该正确计算礼物值增长', () => {
      const currentStreamer = { rank: 2, giftValue: 600000 };
      const previousStreamer = { rank: 2, giftValue: 500000 };

      const giftValueChange = manager.calculateStreamerComparison(
        currentStreamer,
        previousStreamer,
        'giftValue'
      );

      expect(giftValueChange.trend).toBe('up');
      expect(giftValueChange.text).toBe('+20.0%');
    });

    it('应该正确计算礼物值下降', () => {
      const currentStreamer = { rank: 2, giftValue: 400000 };
      const previousStreamer = { rank: 2, giftValue: 500000 };

      const giftValueChange = manager.calculateStreamerComparison(
        currentStreamer,
        previousStreamer,
        'giftValue'
      );

      expect(giftValueChange.trend).toBe('down');
      expect(giftValueChange.text).toBe('-20.0%');
    });

    it('应该正确处理持平情况', () => {
      const currentStreamer = { rank: 2, giftValue: 500000 };
      const previousStreamer = { rank: 2, giftValue: 500000 };

      const rankChange = manager.calculateStreamerComparison(
        currentStreamer,
        previousStreamer,
        'rank'
      );

      const giftValueChange = manager.calculateStreamerComparison(
        currentStreamer,
        previousStreamer,
        'giftValue'
      );

      expect(rankChange.trend).toBe('flat');
      expect(rankChange.text).toBe('-');
      expect(giftValueChange.trend).toBe('flat');
      expect(giftValueChange.text).toBe('-');
    });
  });

  describe('calculateTrendChange', () => {
    it('应该正确计算上升趋势', () => {
      const result = manager.calculateTrendChange(1200, 1000);

      expect(result.trend).toBe('up');
      expect(result.text).toBe('+20.0%');
      expect(result.percentage).toBe('20.0');
    });

    it('应该正确计算下降趋势', () => {
      const result = manager.calculateTrendChange(800, 1000);

      expect(result.trend).toBe('down');
      expect(result.text).toBe('-20.0%');
      expect(result.percentage).toBe('20.0');
    });

    it('应该正确处理持平情况', () => {
      const result = manager.calculateTrendChange(1000, 1000);

      expect(result.trend).toBe('flat');
      expect(result.text).toBe('-');
      expect(result.percentage).toBe('0.0');
    });

    it('应该正确处理零除数', () => {
      const result = manager.calculateTrendChange(1000, 0);

      expect(result.trend).toBe('up');
      expect(result.text).toBe('+100.0%');
      expect(result.percentage).toBe('100.0');
    });

    it('应该正确处理小数点精度', () => {
      const result = manager.calculateTrendChange(1001, 1000);

      expect(result.percentage).toBe('0.1');
      expect(result.text).toBe('+0.1%');
    });
  });

  describe('formatTrendText', () => {
    it('应该格式化排名变化', () => {
      expect(manager.formatTrendText(3, 'rank', 'up')).toBe('↑3');
      expect(manager.formatTrendText(2, 'rank', 'down')).toBe('↓2');
      expect(manager.formatTrendText(0, 'rank', 'flat')).toBe('-');
    });

    it('应该格式化礼物值变化', () => {
      expect(manager.formatTrendText(20.5, 'giftValue', 'up')).toBe('+20.5%');
      expect(manager.formatTrendText(15.0, 'giftValue', 'down')).toBe('-15.0%');
      expect(manager.formatTrendText(0, 'giftValue', 'flat')).toBe('-');
    });

    it('应该处理边界情况', () => {
      expect(manager.formatTrendText(0.1, 'giftValue', 'up')).toBe('+0.1%');
      expect(manager.formatTrendText(100, 'rank', 'down')).toBe('↓100');
    });
  });
});