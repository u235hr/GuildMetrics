import React, { useEffect, useState } from 'react';
import Header from './Header';
import ModernTopThreeDisplay from './ModernTopThreeDisplay';
import ModernRankingTable from './ModernRankingTable';
import useResponsive from '../hooks/useResponsive';

const MainDashboard: React.FC = () => {
  const { isMobile } = useResponsive();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="viewport-container">
      {/* 使用原生HTML元素和Tailwind CSS实现布局 */}
      <div className="h-screen flex flex-col gap-4 p-4 bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1B]">
        {/* Header占10%高度 */}
        <div className="h-[10%]">
          <Header />
        </div>
        
        {/* 主要内容区域 */}
        <div className="flex flex-col h-[90%] gap-4">
          {/* Top 3排名卡片占30%高度 */}
          <div className="h-[30%]">
            <ModernTopThreeDisplay />
          </div>

          {/* 其余排名表格占65%高度 */}
          <div className="h-[65%] pb-4">
            <ModernRankingTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;