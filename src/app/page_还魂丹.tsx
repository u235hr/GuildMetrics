'use client';

import Header from '@/components/Header';
import ReactBitsTopThreeDisplay from '@/components/ReactBitsTopThreeDisplay';
import RankingTable from '@/components/RankingTable';
import { testData } from '@/data/testData';
import { usePageStore } from '@/store';
import { setupAutoRefresh, setupFrameRateLimit } from '@/utils/performanceConfig';
import { useEffect } from 'react';

export default function Home() {
  const { selectedMonth } = usePageStore();

  useEffect(() => {
    console.log('[App] Initializing performance optimizations...');
    setupAutoRefresh();
    setupFrameRateLimit();
    console.log('[App] Performance optimizations initialized');
  }, []);

  // 根据选择的月份获取数据
  const getCurrentData = () => {
    if (selectedMonth === '2025-07') {
      return testData.july2024;
    }
    return testData.june2024; // 默认6月数据
  };

  const currentData = getCurrentData();
  
  // 头像映射函数 - 根据名字分配不同的头像
  const getAvatar = (name: string) => {
    const avatarColors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'
    ];
    
    const nameCode = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = nameCode % avatarColors.length;
    const color = avatarColors[colorIndex];
    const firstChar = name.charAt(0);
    
    const svgContent = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="100" fill="${color}"/><text x="100" y="120" text-anchor="middle" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="white">${firstChar}</text></svg>`;
    const encodedSvg = encodeURIComponent(svgContent);
    
    return `data:image/svg+xml,${encodedSvg}`;
  };

  // 转换数据格式以匹配ReactBitsTopThreeDisplay的期望格式
  const topThreeData = currentData.streamers.slice(0, 3).map(streamer => ({
    rank: streamer.rank,
    name: streamer.name,
    amount: streamer.giftValue,
    avatar: getAvatar(streamer.name)
  }));

  // 转换数据格式以匹配RankingTable的期望格式（4名之后的数据）
  const rankingData = currentData.streamers.slice(3).map(streamer => ({
    rank: streamer.rank,
    name: streamer.name,
    amount: streamer.giftValue,
    mom_growth: 0, // 暂时设为0，后续可以计算真实增长率
    yoy_growth: 0
  }));

  console.log('Current data:', currentData);
  console.log('Top three data:', topThreeData);
  console.log('Ranking data:', rankingData.length);

  return (
    <main className="h-screen w-screen text-[min(1.5cqw,1.5cqh)] bg-gradient-to-br from-[#0a0a0a] to-[#1a1a3a] overflow-hidden">
      <div className="h-full w-full flex flex-col container-type-size">
        {/* Header - 固定高度 */}
        <div className="h-[10cqh] flex-shrink-0">
          <Header />
        </div>
        
        {/* Top 3 卡片展示 - 增加空间 */}
        <div className="h-[40cqh] flex-shrink-0 px-4">
          <ReactBitsTopThreeDisplay data={topThreeData} />
        </div>
        
        {/* 排名表格 - 剩余空间 */}
        <div className="flex-1 min-h-0 px-4 pb-4">
          <RankingTable data={rankingData} />
        </div>
      </div>
    </main>
  );
}