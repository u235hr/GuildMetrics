'use client';

import { useEffect, useState } from 'react';
import { getRankingData, RankingData } from '@/utils/dataLoader';
import Top3Container from '@/components/Top3Container';
import RestRankingList from '@/components/RestRankingList';

export default function RankingPage() {
  const [rankingData, setRankingData] = useState<RankingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Starting to load ranking data...');
        const data = await getRankingData('june');
        console.log('Loaded ranking data:', data);
        setRankingData(data);
      } catch (error) {
        console.error('Failed to load ranking data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className='h-full flex items-center justify-center'>
        <div className='text-white text-xl'>Loading...</div>
      </div>
    );
  }

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
  const restRankingData = rankingData.slice(3).map((item, index) => ({
    rank: index + 4, // 从第4名开始
    name: item.name,
    coinAmount: item.coins,
    // 模拟环比数据（相对于上个月的变化百分比）
    monthOverMonth: Math.random() > 0.3 ? (Math.random() - 0.5) * 40 : undefined,
    // 模拟同比数据（相对于去年同期的变化百分比）
    yearOverYear: Math.random() > 0.2 ? (Math.random() - 0.5) * 60 : undefined,
    // 模拟直播时长数据（小时）
    liveDuration: Math.random() > 0.1 ? Math.random() * 200 : undefined
  }));

  const THRESHOLD_VALUE = 5000; // 币量门槛值
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
