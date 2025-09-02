import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import Header from './Header';
import ModernTopThreeDisplay from './ModernTopThreeDisplay';
import ModernRankingTable from './ModernRankingTable';
import useResponsive from '../hooks/useResponsive';

const { Content } = Layout;

const MainDashboard: React.FC = () => {
  const { isMobile } = useResponsive();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="viewport-container">
      <Layout className="adaptive-layout">
        <Header />
        <Content className="main-content-area">
          <div className="dashboard-content-container">
            {/* 前三名展示区域 - 固定合理高度，避免遮挡 */}
            <div className="top-three-section">
              <ModernTopThreeDisplay />
            </div>

            {/* 排行榜区域 - 自适应填满剩余空间，内部可滚动 */}
            <div className="ranking-section">
              <ModernRankingTable />
            </div>
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default MainDashboard;