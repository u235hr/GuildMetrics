'use client';

import { useEffect, useState } from 'react';
import { getRankingData, RankingData } from '@/utils/dataLoader';
import Top3Container from '@/components/pages/ranking/Top3Container';
import RestRankingList from '@/components/pages/ranking/RestRankingList';

export default function RankingPage() {
  // 扩展排名数据，提供更多测试数据
  const rankingData: RankingData[] = [
    { rank: 1, name: '宝儿', coins: 836669 },
    { rank: 2, name: '雪儿', coins: 797145 },
    { rank: 3, name: '小美', coins: 654321 },
    { rank: 4, name: '小红', coins: 543210 },
    { rank: 5, name: '小明', coins: 432109 },
    { rank: 6, name: '小丽', coins: 398765 },
    { rank: 7, name: '小强', coins: 356789 },
    { rank: 8, name: '小华', coins: 298456 },
    { rank: 9, name: '小芳', coins: 267890 },
    { rank: 10, name: '小刚', coins: 234567 },
    { rank: 11, name: '小梅', coins: 198234 },
    { rank: 12, name: '小军', coins: 167543 },
    { rank: 13, name: '小燕', coins: 145678 },
    { rank: 14, name: '小波', coins: 123456 },
    { rank: 15, name: '小琳', coins: 98765 },
    { rank: 16, name: '小东', coins: 87654 },
    { rank: 17, name: '小西', coins: 76543 },
    { rank: 18, name: '小南', coins: 65432 },
    { rank: 19, name: '小北', coins: 54321 },
    { rank: 20, name: '小中', coins: 43210 }
  ];

  // 准备Top3数据
  const top3Data = {
    gold: {
      name: rankingData[0]?.name || 'No Data',
      value: rankingData[0]?.coins.toLocaleString() || '0',
      avatar: '/avatars/外国女人头像1_未抠图.jpeg'
    },
    silver: {
      name: rankingData[1]?.name || 'No Data',
      value: rankingData[1]?.coins.toLocaleString() || '0',
      avatar: '/avatars/外国女人头像3_未抠图.jpg'
    },
    bronze: {
      name: rankingData[2]?.name || 'No Data',
      value: rankingData[2]?.coins.toLocaleString() || '0',
      avatar: '/avatars/外国女人头像4_未抠图.jpg'
    }
  };

  // 准备剩余排名数据（从第4名开始）
  const restRankingData = rankingData.slice(3).map((item, index) => {
    // 使用确定性算法生成数据，避免SSR水合错误
    const seed = item.rank * 137.5; // 使用rank作为种子
    const monthOverMonthSeed = (seed * 1.618) % 1; // 黄金比例
    const yearOverYearSeed = (seed * 2.718) % 1; // 自然对数
    const liveDurationSeed = (seed * 3.141) % 1; // 圆周率
    
    return {
      rank: item.rank, // 使用原始rank，不要重新计算
      name: item.name,
      coinAmount: item.coins,
      // 模拟环比数据（相对于上个月的变化百分比）
      monthOverMonth: monthOverMonthSeed > 0.3 ? (monthOverMonthSeed - 0.5) * 40 : undefined,
      // 模拟同比数据（相对于去年同期的变化百分比）
      yearOverYear: yearOverYearSeed > 0.2 ? (yearOverYearSeed - 0.5) * 60 : undefined,
      // 模拟直播时长数据（小时）
      liveDuration: liveDurationSeed > 0.1 ? liveDurationSeed * 200 : undefined
    };
  });

  console.log('📋 RestRankingList data:', {
    count: restRankingData.length,
    firstItem: restRankingData[0],
    lastItem: restRankingData[restRankingData.length - 1]
  });

  const THRESHOLD_VALUE = 100000; // 调整门槛值到合理范围
  const LIVE_DURATION_THRESHOLD = 100; // 直播时长门槛值（小时）

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      {/* 35% for Top3Container with container query */}
      <div className="flex-[35] w-full @container" style={{ overflow: 'visible' }}>
        <Top3Container data={top3Data} />
      </div>

      {/* 65% for RestRankingList */}
      <div className="flex-[65] w-full bg-[#060010] overflow-hidden">
        <RestRankingList
          items={restRankingData}
          thresholdValue={THRESHOLD_VALUE}
          liveDurationThreshold={LIVE_DURATION_THRESHOLD}
          onItemSelect={(item, index) => {
            console.log('Selected item:', item, 'Index:', index);
          }}
          showGradients={true}
          enableArrowNavigation={true}
          displayScrollbar={true}
          className="h-full"
        />
      </div>
    </div>
  );
}
