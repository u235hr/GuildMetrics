'use client';

import React from 'react';
import Header from '../../components/Header';
import ModernTopThreeDisplay from '../../components/ModernTopThreeDisplay';
import ModernRankingTable from '../../components/ModernRankingTable';
import { cn } from '@/lib/utils';
import useResponsive from '../../hooks/useResponsive';

// 自定义样式
const customStyles = `
  @keyframes gentleGlow {
    0%, 100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.2); }
    50% { box-shadow: 0 0 25px rgba(59, 130, 246, 0.4); }
  }
  
  @keyframes slowRotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .gentle-glow {
    animation: gentleGlow 4s ease-in-out infinite;
  }
  
  .slow-rotate {
    animation: slowRotate 60s linear infinite;
  }
`;

const ModernRankingPage: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  return (
    <>
      {/* 注入自定义样式 */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* 静态背景装饰 */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/5 rounded-full" />
          <div className="absolute top-20 right-20 w-16 h-16 bg-purple-400/5 rounded-full" />
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-indigo-400/5 rounded-full" />
          <div className="absolute bottom-10 right-10 w-12 h-12 bg-pink-400/5 rounded-full" />
          {/* 缓慢旋转装饰 */}
          <div className="absolute top-1/3 left-1/4 w-32 h-32 border border-blue-200/10 rounded-full slow-rotate" />
          <div className="absolute bottom-1/3 right-1/4 w-28 h-28 border border-purple-200/10 rounded-full slow-rotate" style={{ animationDirection: 'reverse' }} />
        </div>
        
        {/* 头部 */}
        <div className="relative z-10">
          <Header />
        </div>
        
        {/* 主要内容区域 - 使用 CSS Grid 两行布局 */}
        <main className="flex-1 grid grid-rows-[auto_1fr] container mx-auto px-4 py-6 gap-6 overflow-hidden relative z-10 min-h-0">
          {/* TOP3 展示区域 - 使用相对单位的最小高度 */}
          <section 
            className="flex-shrink-0 animate-in fade-in slide-in-from-top-8 duration-1000 min-h-[clamp(2.25rem,8vh,5rem)] w-full"
          >
            <div className="relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 rounded-3xl blur-xl gentle-glow" />
              <div className="relative h-full">
                <ModernTopThreeDisplay />
              </div>
            </div>
          </section>
          
          {/* 排行榜区域 - 占用剩余空间 */}
          <section className="flex-1 flex flex-col min-h-0">
            <div className="relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/2 to-pink-600/2 rounded-3xl blur-lg" />
              <div className="relative h-full">
                <ModernRankingTable />
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default ModernRankingPage;