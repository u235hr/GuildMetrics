'use client';

import { usePageStore } from '@/store';
import Header from '@/components/Header';
import StatisticsCards from '@/components/StatisticsCards';
import MonthOverMonthAnalysis from '@/components/MonthOverMonthAnalysis';
import Link from 'next/link';

export default function DataAnalysisPage() {
  const { selectedMonth } = usePageStore();

  return (
    <div className="h-screen w-screen @container text-[min(1.5cqw,1.5cqh)] bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1B]">
      <div className="h-full w-full flex flex-col">
        {/* Header - 固定高度 */}
        <div className="h-[10cqh]">
          <Header />
        </div>

        {/* 面包屑导航 */}
        <div className="text-[0.8em] text-white/60 px-[1em] py-[0.5em]">
          <nav className="flex">
            <Link href="/" className="flex items-center hover:text-white transition-colors">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              主页
            </Link>
            <span className="mx-[0.5em]">/</span>
            <span className="flex items-center text-white">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          {/* 环比分析 */}
          <div className="flex-1">
            <MonthOverMonthAnalysis />
          </div>
        </div>
      </div>
    </div>
  );
}
