/**
 * 月度MD文件解析器 - 专门处理直播公会月度礼物值排名数据
 * 核心功能：解析MD文件、数据校正、排名修正
 */

import type { StreamerInfo, MonthlyData, ValidationResult, ValidationWarning, DataCorrection } from '../types';

export class MonthlyDataParser {
  private monthPattern = /(\d+)月币量排名/;
  private tablePattern = /\|\s*排名\s*\|\s*主播\s*\|\s*\d+月币量\s*\|[\s\S]*?\|\s*\*\*合计\*\*\s*\|\s*\|\s*\*\*([^*]+)\*\*/;
  private rowPattern = /\|\s*(\d+)\s*\|\s*([^|]+)\s*\|\s*(\d+(?:,\d{3})*)\s*\|/g;
  // 新增：支持简单表格格式的正则
  private simpleRowPattern = /\|\s*(\d+)\s*\|\s*([^|]+)\s*\|\s*(\d+(?:,\d{3})*)\s*\|/g;
  private simpleTableHeaderPattern = /\|\s*排名\s*\|\s*主播\s*\|\s*\d*月?币量\s*\|/;

  /**
   * 解析月度MD文件
   * @param content 文件内容
   * @param filename 文件名
   * @returns 解析后的月度数据
   */
  parseMonthlyData(content: string, filename: string): MonthlyData | null {
    try {
      // 从文件名或内容提取月份
      const monthMatch = filename.match(this.monthPattern) || content.match(this.monthPattern);
      const month = monthMatch ? parseInt(monthMatch[1]) : null;

      if (!month) {
        throw new Error('无法识别月份信息');
      }

      // 检查是否为简单表格格式
      const isSimpleFormat = this.simpleTableHeaderPattern.test(content) && !this.tablePattern.test(content);
      
      let totalGiftValue = 0;
      const streamers: StreamerInfo[] = [];
      let match;
      
      if (isSimpleFormat) {
        // 处理简单表格格式
        this.simpleRowPattern.lastIndex = 0;
        
        while ((match = this.simpleRowPattern.exec(content)) !== null) {
          const originalRank = parseInt(match[1]);
          const name = match[2].trim();
          const giftValue = parseInt(match[3].replace(/,/g, ''));

          if (name && !isNaN(giftValue) && name !== '合计') {
            streamers.push({
              id: `${month}-${name}`,
              originalRank,
              name,
              giftValue,
              month,
              year: new Date().getFullYear(),
              rank: 0, // 将在排序后设置
              percentageOfTotal: 0, // 将在计算后设置
            });
            totalGiftValue += giftValue;
          }
        }
      } else {
        // 处理原有的复杂表格格式
        const totalMatch = content.match(this.tablePattern);
        totalGiftValue = totalMatch ? parseInt(totalMatch[1].replace(/,/g, '')) : 0;
        
        this.rowPattern.lastIndex = 0;
        
        while ((match = this.rowPattern.exec(content)) !== null) {
          const originalRank = parseInt(match[1]);
          const name = match[2].trim();
          const giftValue = parseInt(match[3].replace(/,/g, ''));

          if (name && !isNaN(giftValue) && name !== '合计') {
            streamers.push({
              id: `${month}-${name}`,
              originalRank,
              name,
              giftValue,
              month,
              year: new Date().getFullYear(),
              rank: 0, // 将在排序后设置
              percentageOfTotal: 0, // 将在计算后设置
            });
          }
        }
      }

      // 数据校正和排名修正
      const correctedStreamers = this.correctRankingData(streamers, totalGiftValue);
      
      // 计算统计数据
      const averageGiftValue = totalGiftValue / correctedStreamers.length;
      const sortedGiftValues = correctedStreamers.map(s => s.giftValue).sort((a, b) => b - a);
      const medianGiftValue = this.calculateMedian(sortedGiftValues);
      const topThreeTotal = correctedStreamers.slice(0, 3).reduce((sum, s) => sum + s.giftValue, 0);

      return {
        month,
        year: new Date().getFullYear(),
        totalGiftValue,
        streamerCount: correctedStreamers.length,
        streamers: correctedStreamers,
        parseTime: new Date().toISOString(),
        topThreeTotal,
        averageGiftValue,
        medianGiftValue,
      };
    } catch (error) {
      console.error(`${filename} 解析失败:`, error);
      return null;
    }
  }

  /**
   * 修正排名数据 - 以礼物值为准进行排序
   * @param streamers 原始主播数据
   * @param totalGiftValue 总礼物值
   * @returns 修正后的主播数据
   */
  private correctRankingData(streamers: StreamerInfo[], totalGiftValue: number): StreamerInfo[] {
    // 按礼物值降序排序（以礼物值为准）
    const sorted = streamers.sort((a, b) => b.giftValue - a.giftValue);

    // 重新生成正确排名
    let currentRank = 1;
    return sorted.map((streamer, index) => {
      // 如果当前礼物值小于前一个，则排名更新
      if (index > 0 && streamer.giftValue < sorted[index - 1].giftValue) {
        currentRank = index + 1;
      }

      return {
          ...streamer,
          rank: currentRank,
          percentageOfTotal: Number(((streamer.giftValue / totalGiftValue) * 100).toFixed(2)),
          level: this.calculateStreamerLevel(streamer.giftValue, currentRank),
          correctedRank: streamer.originalRank !== currentRank,
        };
    });
  }

  /**
   * 计算主播等级
   * @param giftValue 礼物值
   * @param rank 排名
   * @returns 主播等级
   */
  private calculateStreamerLevel(giftValue: number, rank: number): 'TOP3' | 'HIGH' | 'MEDIUM' | 'LOW' {
    if (rank <= 3) return 'TOP3';
    if (giftValue >= 200000) return 'HIGH';
    if (giftValue >= 100000) return 'MEDIUM';
    return 'LOW';
  }

  private calculateMedian(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  validateData(data: MonthlyData): ValidationResult {
    const warnings: ValidationWarning[] = [];
    const corrections: DataCorrection[] = [];
    
    // 检查重复排名
    const rankCounts = new Map<number, number>();
    data.streamers.forEach(streamer => {
      const rank = streamer.originalRank || streamer.rank;
      const count = rankCounts.get(rank) || 0;
      rankCounts.set(rank, count + 1);
    });
    
    rankCounts.forEach((count, rank) => {
      if (count > 1) {
        warnings.push({
          type: 'DUPLICATE_RANK',
          message: `排名 ${rank} 出现 ${count} 次`,
          affectedStreamers: data.streamers.filter(s => (s.originalRank || s.rank) === rank).map(s => s.name),
          rank
        });
      }
    });
    
    // 检查排名跳跃
    const sortedRanks = data.streamers.map(s => s.originalRank || s.rank).sort((a, b) => a - b);
    for (let i = 1; i < sortedRanks.length; i++) {
      if (sortedRanks[i] - sortedRanks[i-1] > 1) {
        warnings.push({
          type: 'MISSING_RANK',
          message: `排名从 ${sortedRanks[i-1]} 跳跃到 ${sortedRanks[i]}`,
          rank: sortedRanks[i-1] + 1
        });
      }
    }
    
    // 检查礼物值与排名不匹配
    const sortedByGift = [...data.streamers].sort((a, b) => b.giftValue - a.giftValue);
    sortedByGift.forEach((streamer, index) => {
      const expectedRank = index + 1;
      const originalRank = streamer.originalRank || streamer.rank;
      if (originalRank !== expectedRank) {
        corrections.push({
          type: 'RANK_CORRECTION',
          streamerName: streamer.name,
          originalValue: originalRank,
          correctedValue: expectedRank,
          reason: '根据礼物值重新排序'
        });
      }
    });
    
    // 检查总礼物值匹配
    const calculatedTotal = data.streamers.reduce((sum, s) => sum + s.giftValue, 0);
    const totalGiftValueMatch = Math.abs(calculatedTotal - data.totalGiftValue) < 100;
    
    return {
      isValid: warnings.length === 0,
      warnings,
      corrections,
      totalGiftValueMatch
    };
  }

  async batchParseFiles(files: { name: string; content: string }[]): Promise<(MonthlyData | null)[]> {
    const results: (MonthlyData | null)[] = [];
    
    for (const file of files) {
      const result = this.parseMonthlyData(file.content, file.name);
      results.push(result);
    }
    
    return results;
  }

  extractTableData(text: string): StreamerInfo[] {
    const streamers: StreamerInfo[] = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      const match = line.match(/\|\s*(\d+)\s*\|\s*([^|]+)\s*\|\s*(\d+(?:,\d{3})*)\s*\|/);
      if (match) {
        const rank = parseInt(match[1]);
        const name = match[2].trim();
        const giftValue = parseInt(match[3].replace(/,/g, ''));
        
        if (name && !isNaN(giftValue) && name !== '合计') {
          streamers.push({
            id: `temp-${name}`,
            originalRank: rank,
            rank,
            name,
            giftValue,
            month: 0,
            year: new Date().getFullYear(),
            percentageOfTotal: 0,
          });
        }
      }
    }
    
    return streamers;
  }
}