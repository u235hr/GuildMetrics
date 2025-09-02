// 自动加载测试数据脚本
const fs = require('fs');
const path = require('path');

// 读取测试数据文件
const june2024Data = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'src/test/real_data_june_2024.json'), 'utf8')
);

const july2024Data = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'src/test/real_data_july_2024.json'), 'utf8')
);

// 转换数据格式以匹配应用期望的格式
function convertToAppFormat(data, month, year) {
  const streamers = data.streamers.map(streamer => ({
    id: `${streamer.name}_${month}_${year}`,
    name: streamer.name,
    rank: streamer.rank,
    giftValue: streamer.coins, // 将coins转换为giftValue
    month: month,
    year: year,
    percentageOfTotal: 0, // 将在后面计算
    level: streamer.rank <= 3 ? 'TOP3' : streamer.rank <= 10 ? 'HIGH' : streamer.rank <= 20 ? 'MEDIUM' : 'LOW'
  }));

  // 计算总礼物值
  const totalGiftValue = streamers.reduce((sum, s) => sum + s.giftValue, 0);
  
  // 计算每个主播的百分比
  streamers.forEach(streamer => {
    streamer.percentageOfTotal = (streamer.giftValue / totalGiftValue) * 100;
  });

  return {
    month: month,
    year: year,
    totalGiftValue: totalGiftValue,
    streamerCount: streamers.length,
    streamers: streamers,
    parseTime: new Date().toISOString(),
    topThreeTotal: streamers.slice(0, 3).reduce((sum, s) => sum + s.giftValue, 0),
    averageGiftValue: totalGiftValue / streamers.length,
    medianGiftValue: streamers[Math.floor(streamers.length / 2)].giftValue
  };
}

// 转换数据
const june2024Converted = convertToAppFormat(june2024Data, 6, 2024);
const july2024Converted = convertToAppFormat(july2024Data, 7, 2024);

// 创建localStorage数据
const localStorageData = {
  monthlyData: {
    '2024-6': june2024Converted,
    '2024-7': july2024Converted
  },
  currentMonth: 7,
  currentYear: 2024,
  qualificationLine: 50000 // 设置一个合理的合格线
};

// 输出可以直接在浏览器控制台执行的代码
console.log('=== 在浏览器控制台执行以下代码来加载测试数据 ===\n');
console.log(`localStorage.setItem('streamer-dashboard-data', '${JSON.stringify(localStorageData)}');`);
console.log('\nlocation.reload();');
console.log('\n=== 数据加载完成后页面将自动刷新 ===');

// 同时保存为JSON文件供手动导入
fs.writeFileSync(
  path.join(__dirname, 'test_data_for_import.json'),
  JSON.stringify(localStorageData, null, 2)
);

console.log('\n✅ 测试数据已保存到 test_data_for_import.json');
console.log('📊 数据概览:');
console.log(`   6月: ${june2024Converted.streamerCount}位主播, 总礼物值: ${june2024Converted.totalGiftValue.toLocaleString()}`);
console.log(`   7月: ${july2024Converted.streamerCount}位主播, 总礼物值: ${july2024Converted.totalGiftValue.toLocaleString()}`);
console.log(`   环比变化: ${((july2024Converted.totalGiftValue - june2024Converted.totalGiftValue) / june2024Converted.totalGiftValue * 100).toFixed(2)}%`);