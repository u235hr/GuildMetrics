'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import StatisticsCards from '../../components/StatisticsCards';
import Charts from '../../components/Charts';
import MonthOverMonthAnalysis from '../../components/MonthOverMonthAnalysis';
import { usePageStore } from '../../store';

const DataAnalysisPage: React.FC = () => {
  const { selectedMonth } = usePageStore();
  
  // 模拟数据，实际应用中这些数据应该从API获取
  const currentMonthData = { totalGifts: 0, totalUsers: 0, avgGifts: 0 };
  const userSettings = { theme: 'dark', language: 'zh' };
  const monthComparison = { current: 0, previous: 0, growth: 0 };
  
  // 构造 Charts 组件需要的 MonthlyData 格式
  const currentMonthDataFormatted = currentMonthData && currentMonthData.length > 0 ? {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    totalGiftValue: currentMonthData.reduce((sum, streamer) => sum + streamer.giftValue, 0),
    streamerCount: currentMonthData.length,
    streamers: currentMonthData,
    parseTime: new Date().toISOString(),
    topThreeTotal: currentMonthData.slice(0, 3).reduce((sum, streamer) => sum + streamer.giftValue, 0),
    averageGiftValue: currentMonthData.reduce((sum, streamer) => sum + streamer.giftValue, 0) / currentMonthData.length,
    medianGiftValue: (() => {
      const sorted = [...currentMonthData].sort((a, b) => a.giftValue - b.giftValue);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 0 
        ? (sorted[mid - 1].giftValue + sorted[mid].giftValue) / 2
        : sorted[mid].giftValue;
    })()
  } : null;
  
  // 从 monthComparison 中获取上月数据
  const previousMonthDataFormatted = monthComparison ? {
    month: monthComparison.previousMonth || (new Date().getMonth()),
    year: new Date().getFullYear(),
    totalGiftValue: 0, // 这里需要从实际数据中获取
    streamerCount: 0,
    streamers: [],
    parseTime: new Date().toISOString(),
    topThreeTotal: 0,
    averageGiftValue: 0,
    medianGiftValue: 0
  } : null;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1B]">
      <div className="h-[10%]">
        <Header />
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-7xl mx-auto">
          {/* 面包屑导航 */}
          <nav className="flex text-sm text-gray-400 mb-4">
            <Link href="/" className="flex items-center hover:text-white transition-colors">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              主页
            </Link>
            <span className="mx-2">/</span>
            <span className="flex items-center text-white">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              数据分析
            </span>
          </nav>
          
          {/* 页面标题 */}
          <div className="mb-6">
            <h1 className="text-[min(1.8cqw,1.8cqh)] font-bold text-white">
              数据分析中心
            </h1>
            <p className="text-[min(1.2cqw,1.2cqh)] text-gray-400">
              深入分析主播数据，洞察业务趋势和表现
            </p>
          </div>

          {/* 统计卡片 */}
          <div className="h-25vh mb-6">
            <StatisticsCards />
          </div>

          {/* 图表分析 */}
          <div className="flex-1 space-y-6">
            <div className="h-50vh">
              <Charts 
                currentMonthData={currentMonthDataFormatted}
                previousMonthData={previousMonthDataFormatted}
                qualificationLine={userSettings.qualificationLine}
              />
            </div>
            <div className="h-30vh">
              <MonthOverMonthAnalysis />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataAnalysisPage;