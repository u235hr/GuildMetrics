'use client';

import React from 'react';
import { Layout, Typography, Breadcrumb, Row, Col } from 'antd';
import { HomeOutlined, TrophyOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Header from '../../components/Header';
import TopThreeDisplay from '../../components/TopThreeDisplay';
import RankingTable from '../../components/RankingTable';

const { Content } = Layout;
const { Title } = Typography;

const RankingPage: React.FC = () => {
  return (
    <Layout className="single-screen-layout">
      <Header />
      <Content className="content-area">
        <div className="scrollable-content">
          <div className="container-custom">
            {/* 面包屑导航 */}
            <div className="compact-margin">
              <Breadcrumb
                items={[
                  {
                    title: (
                      <Link href="/" className="flex items-center">
                        <HomeOutlined className="mr-1" />
                        主页
                      </Link>
                    ),
                  },
                  {
                    title: (
                      <span className="flex items-center">
                        <TrophyOutlined className="mr-1" />
                        排行榜
                      </span>
                    ),
                  },
                ]}
              />
            </div>
            
            {/* 页面标题 */}
            <div className="compact-margin">
              <Title level={2} className="responsive-title text-gradient">
                主播排行榜
              </Title>
              <p className="responsive-subtitle text-gray-600 dark:text-gray-400">
                查看月度之星和所有主播的礼物流水排名
              </p>
            </div>

            {/* 大屏数据展示布局 */}
            <div className="dashboard-grid">
              {/* 第一行：前三名主播卡片 */}
              <div className="top-three-section">
                <TopThreeDisplay />
              </div>

              {/* 第二行：其他主播列表（固定高度，可滚动） */}
              <div className="other-streamers-section">
                <div className="internal-scroll">
                  <RankingTable />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default RankingPage;