'use client';

import { useEffect, useState } from 'react';
import { getRankingData, RankingData } from '@/utils/dataLoader';
import Top3Container from '@/components/Top3Container';

export default function RankingPage() {
  const [rankingData, setRankingData] = useState<RankingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getRankingData('june');
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
        <div className='text-white text-xl'>加载中...</div>
      </div>
    );
  }

  // 准备Top3数据
  const top3Data = {
    gold: {
      name: rankingData[0]?.name || '暂无数据',
      value: rankingData[0]?.coins.toLocaleString() || '0',
      avatar: '/avatars/外国女人头像1_未抠图.jpeg'
    },
    silver: {
      name: rankingData[1]?.name || '暂无数据',
      value: rankingData[1]?.coins.toLocaleString() || '0',
      avatar: '/avatars/外国女人头像3_未抠图.jpg'
    },
    bronze: {
      name: rankingData[2]?.name || '暂无数据',
      value: rankingData[2]?.coins.toLocaleString() || '0',
      avatar: '/avatars/外国女人头像4_未抠图.jpg'
    }
  };

  return (
    <div className="h-full w-full">
      {/* 35% for Top3Container with container query */}
      <div className="h-[35%] w-full @container" style={{ overflow: 'visible' }}>
        <Top3Container data={top3Data} />
      </div>

      {/* 55% for RestRankingTable (Placeholder) */}
      <div className="h-[55%] w-full border-2 border-white">
        <p className="text-gray-500">RestRankingTable Placeholder (55%)</p>
      </div>
    </div>
  );
}
