/**
 * 测试工具函数和Mock数据
 */

import { StreamerInfo, MonthlyData, UserSettings } from '../types';

// Mock主播数据
export const mockStreamers: StreamerInfo[] = [
  {
    id: '1',
    name: 'StreamerA',
    rank: 1,
    originalRank: 1,
    giftValue: 836669,
    percentageOfTotal: 12.8,
    level: 'TOP3',
    corrected: false,
  },
  {
    id: '2',
    name: 'StreamerB',
    rank: 2,
    originalRank: 2,
    giftValue: 797145,
    percentageOfTotal: 12.2,
    level: 'TOP3',
    corrected: false,
  },
  {
    id: '3',
    name: 'StreamerC',
    rank: 3,
    originalRank: 3,
    giftValue: 764030,
    percentageOfTotal: 11.7,
    level: 'TOP3',
    corrected: false,
  },
  {
    id: '4',
    name: 'StreamerD',
    rank: 4,
    originalRank: 4,
    giftValue: 297901,
    percentageOfTotal: 4.6,
    level: 'HIGH',
    corrected: false,
  },
  {
    id: '5',
    name: 'StreamerE',
    rank: 5,
    originalRank: 5,
    giftValue: 288709,
    percentageOfTotal: 4.4,
    level: 'HIGH',
    corrected: false,
  },
];

// Mock月度数据
export const mockMonthlyData: MonthlyData = {
  month: 7,
  year: 2024,
  streamers: mockStreamers,
  totalGiftValue: 6534020,
  streamerCount: 5,
  topThreeTotal: 2397844,
  medianGiftValue: 764030,
  parseTime: '2024-07-01T00:00:00.000Z',
  fileName: '7月币量排名.md',
};

// Mock上个月数据
export const mockPreviousMonthData: MonthlyData = {
  month: 6,
  year: 2024,
  streamers: [
    {
      id: '1',
      name: 'StreamerA',
      rank: 2,
      originalRank: 2,
      giftValue: 800000,
      percentageOfTotal: 12.5,
      level: 'TOP3',
      corrected: false,
    },
    {
      id: '2',
      name: 'StreamerB',
      rank: 1,
      originalRank: 1,
      giftValue: 850000,
      percentageOfTotal: 13.2,
      level: 'TOP3',
      corrected: false,
    },
    {
      id: '3',
      name: 'StreamerC',
      rank: 3,
      originalRank: 3,
      giftValue: 750000,
      percentageOfTotal: 11.7,
      level: 'TOP3',
      corrected: false,
    },
  ],
  totalGiftValue: 6400000,
  streamerCount: 3,
  topThreeTotal: 2400000,
  medianGiftValue: 800000,
  parseTime: '2024-06-01T00:00:00.000Z',
  fileName: '6月币量排名.md',
};

// Mock用户设置
export const mockUserSettings: UserSettings = {
  theme: 'light',
  qualificationLine: 100000,
  autoSave: true,
};

// Mock文件内容
export const mockFileContent = `| 排名 | 主播 | 7月币量 |
| :--- | :--- | :--- |
| 1 | StreamerA | 836669 |
| 2 | StreamerB | 797145 |
| 3 | StreamerC | 764030 |
| 4 | StreamerD | 297901 |
| 5 | StreamerE | 288709 |
| **合计** | | **3,484,454** |`;

// 创建Mock File对象
export const createMockFile = (content: string = mockFileContent, filename: string = '7月币量排名.md') => {
  const blob = new Blob([content], { type: 'text/markdown' });
  const file = new File([blob], filename, { type: 'text/markdown' });
  return file;
};

// 延迟函数，用于测试异步操作
export const wait = (ms: number = 0) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟用户事件
export const mockUserEvent = {
  click: (element: HTMLElement) => {
    element.click();
  },
  type: (element: HTMLInputElement, text: string) => {
    element.value = text;
    element.dispatchEvent(new Event('input', { bubbles: true }));
  },
  upload: (element: HTMLInputElement, file: File) => {
    Object.defineProperty(element, 'files', {
      value: [file],
      writable: false,
    });
    element.dispatchEvent(new Event('change', { bubbles: true }));
  },
};

// 测试工具类
export class TestUtils {
  static formatGiftValue(value: number): string {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(1)}万`;
    }
    return value.toLocaleString();
  }

  static calculatePercentage(value: number, total: number): number {
    return Math.round((value / total) * 100 * 10) / 10;
  }

  static generateMockStreamers(count: number): StreamerInfo[] {
    const names = ['主播A', '主播B', '主播C', '主播D', '主播E', '主播F', '主播G', '主播H'];
    const streamers: StreamerInfo[] = [];

    for (let i = 0; i < count; i++) {
      const giftValue = Math.floor(Math.random() * 1000000) + 10000;
      streamers.push({
        id: String(i + 1),
        name: names[i] || `主播${i + 1}`,
        rank: i + 1,
        originalRank: i + 1,
        giftValue,
        percentageOfTotal: this.calculatePercentage(giftValue, 6534020),
        level: i < 3 ? 'TOP3' : i < 10 ? 'HIGH' : i < 20 ? 'MEDIUM' : 'LOW',
        corrected: false,
      });
    }

    return streamers;
  }

  static createMockMonthlyData(month: number, year: number = 2024, streamerCount: number = 5): MonthlyData {
    const streamers = this.generateMockStreamers(streamerCount);
    const totalGiftValue = streamers.reduce((sum, s) => sum + s.giftValue, 0);
    const topThreeTotal = streamers.slice(0, 3).reduce((sum, s) => sum + s.giftValue, 0);

    return {
      month,
      year,
      streamers,
      totalGiftValue,
      streamerCount,
      topThreeTotal,
      medianGiftValue: streamers[Math.floor(streamers.length / 2)]?.giftValue || 0,
      parseTime: new Date().toISOString(),
      fileName: `${month}月币量排名.md`,
    };
  }
}

const testUtils = {
  mockStreamers,
  mockMonthlyData,
  mockPreviousMonthData,
  mockUserSettings,
  mockFileContent,
  createMockFile,
  wait,
  mockUserEvent,
  TestUtils,
};

export default testUtils;