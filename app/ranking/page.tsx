'use client';

import { useEffect, useState } from 'react';
import { getRankingData, getTotalCoins, getTotalCount, RankingData } from '@/utils/dataLoader';
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
      avatar: '/avatars/1inc.png'
    },
    silver: {
      name: rankingData[1]?.name || '暂无数据',
      value: rankingData[1]?.coins.toLocaleString() || '0',
      avatar: '/avatars/avatar2.svg'
    },
    bronze: {
      name: rankingData[2]?.name || '暂无数据',
      value: rankingData[2]?.coins.toLocaleString() || '0',
      avatar: '/avatars/avatar3.svg'
    }
  };

  return (
        <Top3Container data={top3Data} />
  );
}
