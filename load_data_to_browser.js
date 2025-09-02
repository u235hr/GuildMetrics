// 在浏览器控制台执行此脚本来加载测试数据

// 6月数据
const juneData = {
  "month": 6,
  "year": 2024,
  "streamers": [
    {"name": "StreamerA", "coins": 1023456, "rank": 1, "hours": 180, "avgViewers": 2500, "peakViewers": 8000, "followers": 45000},
    {"name": "StreamerB", "coins": 987654, "rank": 2, "hours": 165, "avgViewers": 2200, "peakViewers": 7500, "followers": 42000},
    {"name": "StreamerC", "coins": 654321, "rank": 3, "hours": 150, "avgViewers": 1800, "peakViewers": 6000, "followers": 38000},
    {"name": "小美", "coins": 543210, "rank": 4, "hours": 140, "avgViewers": 1600, "peakViewers": 5500, "followers": 35000},
    {"name": "StreamerCC", "coins": 432109, "rank": 5, "hours": 135, "avgViewers": 1400, "peakViewers": 5000, "followers": 32000},
    {"name": "娜娜", "coins": 321098, "rank": 6, "hours": 130, "avgViewers": 1200, "peakViewers": 4500, "followers": 30000},
    {"name": "琪琪", "coins": 298765, "rank": 7, "hours": 125, "avgViewers": 1100, "peakViewers": 4200, "followers": 28000},
    {"name": "菲菲", "coins": 276543, "rank": 8, "hours": 120, "avgViewers": 1000, "peakViewers": 4000, "followers": 26000},
    {"name": "莎莎", "coins": 254321, "rank": 9, "hours": 115, "avgViewers": 950, "peakViewers": 3800, "followers": 24000},
    {"name": "蓉蓉", "coins": 232109, "rank": 10, "hours": 110, "avgViewers": 900, "peakViewers": 3600, "followers": 22000}
  ]
};

// 7月数据
const julyData = {
  "month": 7,
  "year": 2024,
  "streamers": [
    {"name": "StreamerB", "coins": 1156789, "rank": 1, "hours": 185, "avgViewers": 2800, "peakViewers": 8500, "followers": 48000},
    {"name": "StreamerA", "coins": 1098765, "rank": 2, "hours": 175, "avgViewers": 2600, "peakViewers": 8200, "followers": 46000},
    {"name": "StreamerC", "coins": 698765, "rank": 3, "hours": 155, "avgViewers": 1900, "peakViewers": 6200, "followers": 40000},
    {"name": "小美", "coins": 587654, "rank": 4, "hours": 145, "avgViewers": 1700, "peakViewers": 5800, "followers": 37000},
    {"name": "StreamerCC", "coins": 476543, "rank": 5, "hours": 140, "avgViewers": 1500, "peakViewers": 5200, "followers": 34000},
    {"name": "娜娜", "coins": 365432, "rank": 6, "hours": 135, "avgViewers": 1300, "peakViewers": 4800, "followers": 32000},
    {"name": "琪琪", "coins": 334567, "rank": 7, "hours": 130, "avgViewers": 1200, "peakViewers": 4500, "followers": 30000},
    {"name": "菲菲", "coins": 312345, "rank": 8, "hours": 125, "avgViewers": 1100, "peakViewers": 4200, "followers": 28000},
    {"name": "莎莎", "coins": 289876, "rank": 9, "hours": 120, "avgViewers": 1000, "peakViewers": 4000, "followers": 26000},
    {"name": "蓉蓉", "coins": 267543, "rank": 10, "hours": 115, "avgViewers": 950, "peakViewers": 3800, "followers": 24000}
  ]
};

// 将数据存储到localStorage
function loadTestData() {
  try {
    // 存储数据到localStorage
    const storageData = {
      monthlyData: new Map([
        [6, juneData],
        [7, julyData]
      ]),
      currentMonthData: julyData.streamers,
      selectedMonth: 7,
      availableMonths: [6, 7],
      monthOverMonthComparison: {
        currentMonth: julyData,
        previousMonth: juneData,
        comparison: {
          totalCoinsChange: ((julyData.streamers.reduce((sum, s) => sum + s.coins, 0) - juneData.streamers.reduce((sum, s) => sum + s.coins, 0)) / juneData.streamers.reduce((sum, s) => sum + s.coins, 0) * 100).toFixed(2) + '%',
          avgCoinsChange: '+8.5%',
          topStreamerChange: 'StreamerB (↑1)',
          newEntries: 0,
          droppedOut: 0
        }
      }
    };
    
    // 转换Map为可序列化的格式
    const serializedData = {
      ...storageData,
      monthlyData: Array.from(storageData.monthlyData.entries())
    };
    
    localStorage.setItem('streamer-dashboard-data', JSON.stringify(serializedData));
    
    console.log('✅ 测试数据已成功加载到localStorage');
    console.log('📊 数据概览:');
    console.log(`- 6月: ${juneData.streamers.length}位主播, 总礼物值: ${juneData.streamers.reduce((sum, s) => sum + s.coins, 0).toLocaleString()}`);
    console.log(`- 7月: ${julyData.streamers.length}位主播, 总礼物值: ${julyData.streamers.reduce((sum, s) => sum + s.coins, 0).toLocaleString()}`);
    console.log('🔄 请刷新页面查看数据');
    
    // 自动刷新页面
    setTimeout(() => {
      location.reload();
    }, 1000);
    
  } catch (error) {
    console.error('❌ 加载测试数据失败:', error);
  }
}

// 执行数据加载
loadTestData();

console.log('🚀 数据加载脚本已执行，请等待页面刷新...');