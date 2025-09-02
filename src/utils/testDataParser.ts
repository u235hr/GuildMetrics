/**
 * 数据解析器测试工具 - 验证月度MD文件解析功能
 */

import { MonthlyDataParser } from './monthlyDataParser';

// 真实6月数据（从实际文件提取的部分数据）
const june_data_sample = `
| 排名 | 主播 | 6月币量 |
| :--- | :--- | :--- |
| 1 | StreamerA | 836669 |
| 2 | StreamerB | 797145 |
| 3 | StreamerC | 764030 |
| 4 | StreamerD | 297901 |
| 5 | StreamerE | 288709 |
| 6 | StreamerF | 276929 |
| 7 | StreamerG | 270791 |
| 8 | StreamerH | 227546 |
| 9 | StreamerI | 227003 |
| 10 | StreamerJ | 224118 |
| **合计** | | **7,567,811** |
人数 | | **47人** |
`;

// 测试函数
export function testDataParser() {
  console.log('🧪 开始测试月度数据解析器...');
  
  const parser = new MonthlyDataParser();
  
  // 测试6月数据解析
  const result = parser.parseMonthlyData(june_data_sample, '6月币量排名.md');
  
  if (result) {
    console.log('✅ 解析成功！');
    console.log('📊 解析结果:', {
      月份: result.month,
      年份: result.year,
      总礼物值: result.totalGiftValue.toLocaleString(),
      主播数量: result.streamerCount,
      前三名: result.streamers.slice(0, 3).map(s => ({
        排名: s.rank,
        姓名: s.name,
        礼物值: s.giftValue.toLocaleString(),
        占比: s.percentageOfTotal + '%'
      })),
      平均礼物值: result.averageGiftValue.toLocaleString(),
      中位数礼物值: result.medianGiftValue.toLocaleString()
    });
    
    // 验证数据
    const validation = parser.validateData(result);
    console.log('🔍 数据验证结果:', {
      是否有效: validation.isValid,
      警告数量: validation.warnings.length,
      修正数量: validation.corrections.length,
      总礼物值匹配: validation.totalGiftValueMatch
    });
    
    if (validation.warnings.length > 0) {
      console.log('⚠️ 数据警告:', validation.warnings);
    }
    
    if (validation.corrections.length > 0) {
      console.log('🔧 数据修正:', validation.corrections);
    }
    
    return result;
  } else {
    console.log('❌ 解析失败！');
    return null;
  }
}

// 测试环比功能
export function testMonthComparison() {
  console.log('🔄 开始测试环比分析功能...');
  
  // 这里可以在实际使用时添加环比测试
  console.log('📝 注意：环比功能需要在实际应用中使用真实数据进行测试');
}

// 导出测试函数，可以在浏览器控制台中调用
if (typeof window !== 'undefined') {
  (window as unknown as { [key: string]: unknown }).testDataParser = testDataParser;
  (window as unknown as { [key: string]: unknown }).testMonthComparison = testMonthComparison;
  console.log('🎯 测试函数已挂载到 window 对象，可在控制台中调用:');
  console.log('   - testDataParser() // 测试数据解析');
  console.log('   - testMonthComparison() // 测试环比分析');
}