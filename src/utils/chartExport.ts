/**
 * 图表导出工具 - 支持图表截图和数据导出
 */

import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import type { MonthlyData } from '../types';

// HTML转Canvas配置
const HTML2CANVAS_OPTIONS = {
  useCORS: true,
  allowTaint: true,
  backgroundColor: '#ffffff',
  scale: 2, // 高DPI支持
  logging: false,
  width: 1200,
  height: 800
};

export class ChartExportManager {
  /**
   * 导出图表为PNG图片
   */
  static async exportChartAsPNG(elementId: string, filename: string = 'chart'): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`找不到ID为 ${elementId} 的元素`);
      }

      const canvas = await html2canvas(element, HTML2CANVAS_OPTIONS);
      const link = document.createElement('a');
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      console.log(`图表已导出为 ${link.download}`);
    } catch (error) {
      console.error('导出图表失败:', error);
      throw error;
    }
  }

  /**
   * 导出图表数据为Excel
   */
  static async exportDataAsExcel(
    currentMonthData: MonthlyData | null,
    previousMonthData: MonthlyData | null,
    filename: string = 'streamer_data'
  ): Promise<void> {
    try {
      if (!currentMonthData) {
        throw new Error('没有可导出的数据');
      }

      const workbook = XLSX.utils.book_new();

      // 当前月度数据工作表
      const currentSheetData = [
        ['排名', '主播姓名', '礼物值', '原始排名', '校正状态'],
        ...currentMonthData.streamers.map(streamer => [
          streamer.rank,
          streamer.name,
          streamer.giftValue,
          streamer.originalRank,
          streamer.corrected ? '已校正' : '正常'
        ])
      ];
      
      const currentSheet = XLSX.utils.aoa_to_sheet(currentSheetData);
      XLSX.utils.book_append_sheet(workbook, currentSheet, `${currentMonthData.month}月数据`);

      // 如果有上月数据，添加环比分析表
      if (previousMonthData) {
        const comparisonData = this.generateComparisonData(currentMonthData, previousMonthData);
        const comparisonSheet = XLSX.utils.aoa_to_sheet(comparisonData);
        XLSX.utils.book_append_sheet(workbook, comparisonSheet, '环比分析');
      }

      // 统计摘要表
      const summaryData = this.generateSummaryData(currentMonthData, previousMonthData);
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, '数据摘要');

      // 导出文件
      const exportFilename = `${filename}_${currentMonthData.year}年${currentMonthData.month}月_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, exportFilename);
      
      console.log(`数据已导出为 ${exportFilename}`);
    } catch (error) {
      console.error('导出Excel失败:', error);
      throw error;
    }
  }

  /**
   * 生成环比分析数据
   */
  private static generateComparisonData(
    currentMonthData: MonthlyData, 
    previousMonthData: MonthlyData
  ): (string | number)[][] {
    const header = ['主播姓名', '当前排名', '当前礼物值', '上月排名', '上月礼物值', '礼物值变化', '变化率(%)', '排名变化'];
    const data: (string | number)[][] = [header];

    const currentMap = new Map(currentMonthData.streamers.map(s => [s.name, s]));
    const previousMap = new Map(previousMonthData.streamers.map(s => [s.name, s]));
    
    const allStreamers = new Set([...currentMap.keys(), ...previousMap.keys()]);
    
    allStreamers.forEach(name => {
      const current = currentMap.get(name);
      const previous = previousMap.get(name);
      
      if (current && previous) {
        const giftValueChange = current.giftValue - previous.giftValue;
        const changeRate = ((current.giftValue - previous.giftValue) / previous.giftValue) * 100;
        const rankChange = previous.rank - current.rank; // 排名上升为正数
        
        data.push([
          name,
          current.rank,
          current.giftValue,
          previous.rank,
          previous.giftValue,
          giftValueChange,
          Math.round(changeRate * 100) / 100,
          rankChange
        ]);
      }
    });

    return data;
  }

  /**
   * 生成统计摘要数据
   */
  private static generateSummaryData(
    currentMonthData: MonthlyData,
    previousMonthData: MonthlyData | null
  ): (string | number)[][] {
    const data: (string | number)[][] = [
      ['指标', '当前月', '上月', '变化', '变化率(%)']
    ];

    // 总礼物值
    const currentTotal = currentMonthData.totalGiftValue;
    const previousTotal = previousMonthData?.totalGiftValue || 0;
    const totalChange = currentTotal - previousTotal;
    const totalChangeRate = previousTotal > 0 ? (totalChange / previousTotal) * 100 : 0;
    
    data.push([
      '总礼物值',
      currentTotal,
      previousTotal || '-',
      totalChange || '-',
      Math.round(totalChangeRate * 100) / 100 || '-'
    ]);

    // 主播数量
    const currentCount = currentMonthData.streamers.length;
    const previousCount = previousMonthData?.streamers.length || 0;
    const countChange = currentCount - previousCount;
    const countChangeRate = previousCount > 0 ? (countChange / previousCount) * 100 : 0;
    
    data.push([
      '主播数量',
      currentCount,
      previousCount || '-',
      countChange || '-',
      Math.round(countChangeRate * 100) / 100 || '-'
    ]);

    // 平均礼物值
    const currentAvg = currentTotal / currentCount;
    const previousAvg = previousTotal > 0 ? previousTotal / previousCount : 0;
    const avgChange = currentAvg - previousAvg;
    const avgChangeRate = previousAvg > 0 ? (avgChange / previousAvg) * 100 : 0;
    
    data.push([
      '平均礼物值',
      Math.round(currentAvg),
      Math.round(previousAvg) || '-',
      Math.round(avgChange) || '-',
      Math.round(avgChangeRate * 100) / 100 || '-'
    ]);

    // 数据解析信息
    data.push(['', '', '', '', '']);
    data.push(['数据信息', '', '', '', '']);
    data.push(['解析时间', new Date(currentMonthData.parseTime).toLocaleString(), '', '', '']);
    data.push(['数据年月', `${currentMonthData.year}年${currentMonthData.month}月`, '', '', '']);
    if (previousMonthData) {
      data.push(['对比年月', `${previousMonthData.year}年${previousMonthData.month}月`, '', '', '']);
    }

    return data;
  }

  /**
   * 导出数据为CSV格式
   */
  static async exportDataAsCSV(
    monthlyData: MonthlyData,
    filename: string = 'streamer_data'
  ): Promise<void> {
    try {
      const headers = ['排名', '主播姓名', '礼物值', '原始排名', '校正状态'];
      const csvContent = [
        headers.join(','),
        ...monthlyData.streamers.map(streamer => [
          streamer.rank,
          `"${streamer.name}"`, // 姓名用引号包围，防止CSV解析问题
          streamer.giftValue,
          streamer.originalRank,
          streamer.corrected ? '已校正' : '正常'
        ].join(','))
      ].join('\n');

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' }); // 添加BOM支持中文
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${monthlyData.year}年${monthlyData.month}月_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log(`数据已导出为CSV格式`);
    } catch (error) {
      console.error('导出CSV失败:', error);
      throw error;
    }
  }

  /**
   * 导出礼物值分布数据
   */
  static exportDistributionData(monthlyData: MonthlyData): {
    ranges: Array<{name: string; count: number; percentage: number; totalGiftValue: number}>;
    summary: {total: number; ranges: number; avgPerRange: number};
  } {
    const ranges = [
      { name: '10万以下', min: 0, max: 100000 },
      { name: '10-20万', min: 100000, max: 200000 },
      { name: '20-50万', min: 200000, max: 500000 },
      { name: '50-100万', min: 500000, max: 1000000 },
      { name: '100万以上', min: 1000000, max: Infinity }
    ];

    const distribution = ranges.map(range => {
      const streamersInRange = monthlyData.streamers.filter(s => 
        s.giftValue >= range.min && s.giftValue < range.max
      );
      
      const count = streamersInRange.length;
      const percentage = (count / monthlyData.streamers.length) * 100;
      const totalGiftValue = streamersInRange.reduce((sum, s) => sum + s.giftValue, 0);

      return {
        name: range.name,
        count,
        percentage,
        totalGiftValue
      };
    }).filter(item => item.count > 0);

    return {
      ranges: distribution,
      summary: {
        total: monthlyData.streamers.length,
        ranges: distribution.length,
        avgPerRange: monthlyData.streamers.length / distribution.length
      }
    };
  }
}

// 导出默认实例
export default ChartExportManager;