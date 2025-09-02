/**
 * 月度数据解析器测试
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MonthlyDataParser } from '../utils/monthlyDataParser';
import { mockFileContent, TestUtils } from './testUtils';

describe('MonthlyDataParser', () => {
  let parser: MonthlyDataParser;

  beforeEach(() => {
    parser = new MonthlyDataParser();
  });

  describe('parseMonthlyData', () => {
    it('应该正确解析有效的MD文件内容', () => {
      const result = parser.parseMonthlyData(mockFileContent, '7月币量排名.md');

      expect(result).toBeDefined();
      expect(result?.month).toBe(7);
      expect(result?.year).toBe(new Date().getFullYear());
      expect(result?.streamers).toHaveLength(5);
      expect(result?.totalGiftValue).toBe(3484454);
    });

    it('应该正确提取主播信息', () => {
      const result = parser.parseMonthlyData(mockFileContent, '7月币量排名.md');
      const firstStreamer = result?.streamers[0];

      expect(firstStreamer).toBeDefined();
      expect(firstStreamer?.name).toBe('StreamerA');
      expect(firstStreamer?.rank).toBe(1);
      expect(firstStreamer?.giftValue).toBe(836669);
      expect(firstStreamer?.originalRank).toBe(1);
    });

    it('应该从文件名中正确提取月份', () => {
      const testCases = [
        { filename: '6月币量排名.md', expectedMonth: 6 },
        { filename: '12月数据.md', expectedMonth: 12 },
        { filename: '2024年1月排名.md', expectedMonth: 1 },
      ];

      testCases.forEach(({ filename, expectedMonth }) => {
        const result = parser.parseMonthlyData(mockFileContent, filename);
        expect(result?.month).toBe(expectedMonth);
      });
    });

    it('应该处理无效的文件内容', () => {
      const invalidContent = '这不是有效的表格内容';
      const result = parser.parseMonthlyData(invalidContent, '7月币量排名.md');

      expect(result).toBeNull();
    });

    it('应该处理空文件内容', () => {
      const result = parser.parseMonthlyData('', '7月币量排名.md');
      expect(result).toBeNull();
    });

    it('应该正确计算总礼物值', () => {
      const result = parser.parseMonthlyData(mockFileContent, '7月币量排名.md');
      const expectedTotal = 836669 + 797145 + 764030 + 297901 + 288709;
      
      expect(result?.totalGiftValue).toBe(expectedTotal);
    });

    it('应该正确计算主播数量', () => {
      const result = parser.parseMonthlyData(mockFileContent, '7月币量排名.md');
      expect(result?.streamerCount).toBe(5);
    });

    it('应该正确计算前三名总计', () => {
      const result = parser.parseMonthlyData(mockFileContent, '7月币量排名.md');
      const expectedTopThree = 836669 + 797145 + 764030;
      
      expect(result?.topThreeTotal).toBe(expectedTopThree);
    });
  });

  describe('correctRankingData', () => {
    it('应该修正重复排名', () => {
      const streamersWithDuplicateRanks = [
        { id: '1', name: '主播A', rank: 1, giftValue: 1000, originalRank: 1, percentageOfTotal: 0, level: 'HIGH', corrected: false },
        { id: '2', name: '主播B', rank: 2, giftValue: 800, originalRank: 2, percentageOfTotal: 0, level: 'HIGH', corrected: false },
        { id: '3', name: '主播C', rank: 2, giftValue: 600, originalRank: 2, percentageOfTotal: 0, level: 'MEDIUM', corrected: false },
        { id: '4', name: '主播D', rank: 3, giftValue: 400, originalRank: 3, percentageOfTotal: 0, level: 'MEDIUM', corrected: false },
      ];

      const result = parser.correctRankingData(streamersWithDuplicateRanks, 2800);

      expect(result[0].rank).toBe(1);
      expect(result[1].rank).toBe(2);
      expect(result[2].rank).toBe(3);
      expect(result[3].rank).toBe(4);
      expect(result[2].corrected).toBe(true);
      expect(result[3].corrected).toBe(true);
    });

    it('应该按礼物值正确排序', () => {
      const unordereedStreamers = [
        { id: '1', name: '主播A', rank: 1, giftValue: 500, originalRank: 1, percentageOfTotal: 0, level: 'MEDIUM', corrected: false },
        { id: '2', name: '主播B', rank: 2, giftValue: 1000, originalRank: 2, percentageOfTotal: 0, level: 'HIGH', corrected: false },
        { id: '3', name: '主播C', rank: 3, giftValue: 800, originalRank: 3, percentageOfTotal: 0, level: 'HIGH', corrected: false },
      ];

      const result = parser.correctRankingData(unordereedStreamers, 2300);

      expect(result[0].giftValue).toBe(1000);
      expect(result[1].giftValue).toBe(800);
      expect(result[2].giftValue).toBe(500);
      expect(result[0].name).toBe('主播B');
      expect(result[1].name).toBe('主播C');
      expect(result[2].name).toBe('主播A');
    });

    it('应该正确计算百分比', () => {
      const streamers = [
        { id: '1', name: '主播A', rank: 1, giftValue: 1000, originalRank: 1, percentageOfTotal: 0, level: 'HIGH', corrected: false },
        { id: '2', name: '主播B', rank: 2, giftValue: 500, originalRank: 2, percentageOfTotal: 0, level: 'MEDIUM', corrected: false },
      ];

      const result = parser.correctRankingData(streamers, 1500);

      expect(result[0].percentageOfTotal).toBeCloseTo(66.7, 1);
      expect(result[1].percentageOfTotal).toBeCloseTo(33.3, 1);
    });

    it('应该正确分配等级', () => {
      const streamers = TestUtils.generateMockStreamers(10);
      streamers[0].giftValue = 1000000; // TOP3
      streamers[1].giftValue = 800000;  // TOP3
      streamers[2].giftValue = 600000;  // TOP3
      streamers[3].giftValue = 400000;  // HIGH
      streamers[4].giftValue = 150000;  // MEDIUM
      streamers[5].giftValue = 50000;   // LOW

      const totalGiftValue = streamers.reduce((sum, s) => sum + s.giftValue, 0);
      const result = parser.correctRankingData(streamers, totalGiftValue);

      expect(result[0].level).toBe('TOP3');
      expect(result[1].level).toBe('TOP3');
      expect(result[2].level).toBe('TOP3');
      expect(result[3].level).toBe('HIGH');
      expect(result[4].level).toBe('MEDIUM');
      expect(result[5].level).toBe('LOW');
    });
  });

  describe('extractMonthFromFilename', () => {
    it('应该从各种文件名格式中提取月份', () => {
      const testCases = [
        { filename: '6月币量排名.md', expected: 6 },
        { filename: '12月数据统计.md', expected: 12 },
        { filename: '2024年3月排名.md', expected: 3 },
        { filename: 'streamer_data_9月.md', expected: 9 },
        { filename: '十一月排名.md', expected: 11 },
        { filename: '十二月.md', expected: 12 },
      ];

      testCases.forEach(({ filename, expected }) => {
        const result = parser.extractMonthFromFilename(filename);
        expect(result).toBe(expected);
      });
    });

    it('应该处理无效的文件名', () => {
      const invalidFilenames = [
        'invalid.md',
        '数据.md',
        'test.txt',
        '',
      ];

      invalidFilenames.forEach(filename => {
        const result = parser.extractMonthFromFilename(filename);
        expect(result).toBe(new Date().getMonth() + 1);
      });
    });
  });

  describe('parseTableRows', () => {
    it('应该正确解析表格行', () => {
      const tableContent = `| 1 | StreamerA | 836669 |
| 2 | StreamerB | 797145 |
| 3 | StreamerC | 764030 |`;

      const result = parser.parseTableRows(tableContent);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual(['1', 'StreamerA', '836669']);
      expect(result[1]).toEqual(['2', 'StreamerB', '797145']);
      expect(result[2]).toEqual(['3', 'StreamerC', '764030']);
    });

    it('应该忽略标题行和分隔行', () => {
      const tableContent = `| 排名 | 主播 | 7月币量 |
| :--- | :--- | :--- |
| 1 | StreamerA | 836669 |`;

      const result = parser.parseTableRows(tableContent);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(['1', 'StreamerA', '836669']);
    });

    it('应该忽略合计行', () => {
      const tableContent = `| 1 | StreamerA | 836669 |
| **合计** | | **836669** |`;

      const result = parser.parseTableRows(tableContent);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(['1', 'StreamerA', '836669']);
    });
  });
});