'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import TopThreeDisplay from '../../components/TopThreeDisplay';
import RankingTable from '../../components/RankingTable';
import { testData } from '@/data/testData';

const RankingPage: React.FC = () => {
  // 获取7月数据作为默认显示
  const julyData = testData.july2024.streamers;
  
  // 前三名数据
  const topThreeData = julyData.slice(0, 3).map(streamer => ({
    rank: streamer.rank,
    name: streamer.name,
    amount: streamer.giftValue,
    avatar: streamer.avatar || '/globe.svg'
  }));

  // 其余排名数据
  const rankingTableData = julyData.slice(3).map(streamer => ({
    rank: streamer.rank,
    name: streamer.name,
    amount: streamer.giftValue,
    mom_growth: 0, // 临时数据，实际应从数据源获取
    yoy_growth: 0  // 临时数据，实际应从数据源获取
  }));

  return (
    // 使用原生HTML元素和Tailwind CSS实现布局
    <div className="h-screen flex flex-col gap-4 p-4 bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1B]">
      {/* Header占10%高度 */}
      <div className="h-[10%]">
        <Header />
      </div>
      
      {/* 面包屑导航 */}
      <div className="compact-margin">
        <nav className="flex text-sm text-gray-400">
          <Link href="/" className="flex items-center hover:text-white transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            主页
          </Link>
          <span className="mx-2">/</span>
          <span className="flex items-center text-white">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
            </svg>
            排行榜
          </span>
        </nav>
      </div>
      
      {/* 页面标题 */}
      <div className="compact-margin">
        <h1 className="text-[min(1.8cqw,1.8cqh)] font-bold text-white">
          主播排行榜
        </h1>
        <p className="text-[min(1.2cqw,1.2cqh)] text-gray-400">
          查看月度之星和所有主播的礼物流水排名
        </p>
      </div>

      {/* 主要内容区域 */}
      <div className="flex flex-col h-[85%] gap-4">
        {/* Top 3排名卡片占30%高度 */}
        <div className="h-[30%]">
          <TopThreeDisplay data={topThreeData} />
        </div>

        {/* 其余排名表格占55%高度 */}
        <div className="h-[55%]">
          <RankingTable data={rankingTableData} />
        </div>
      </div>
    </div>
  );
};

export default RankingPage;