'use client';

import React from 'react';
import { Layout, Typography, Breadcrumb, Row, Col } from 'antd';
import { HomeOutlined, BarChartOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Header from '../../components/Header';
import StatisticsCards from '../../components/StatisticsCards';
import Charts from '../../components/Charts';
import MonthOverMonthAnalysis from '../../components/MonthOverMonthAnalysis';
import { useCurrentMonthData, useUserSettings, useMonthComparison } from '../../store';

const { Content } = Layout;
const { Title } = Typography;

const DataAnalysisPage: React.FC = () => {
  const currentMonthData = useCurrentMonthData();
  const userSettings = useUserSettings();
  const monthComparison = useMonthComparison();
  
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
    <Layout className="single-screen-layout">
      <Header />
      <Content className="content-area">
        <div className="scrollable-content">
          <div className="container-custom compact-spacing">
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
                        <BarChartOutlined className="mr-1" />
                        数据分析
                      </span>
                    ),
                  },
                ]}
              />
            </div>
            
            <div className="compact-margin">
              <Title level={2} className="responsive-title text-gradient">
                数据分析中心
              </Title>
              <p className="responsive-text text-gray-600 dark:text-gray-400">
                深入分析主播数据，洞察业务趋势和表现
              </p>
            </div>

            {/* 统计卡片 */}
            <div className="h-25vh compact-margin">
              <StatisticsCards />
            </div>

            {/* 图表分析 */}
            <div className="flex-1 compact-spacing">
              <Row gutter={[16, 16]} className="h-full">
                <Col span={24} className="h-50vh">
                  <Charts 
                    currentMonthData={currentMonthDataFormatted}
                    previousMonthData={previousMonthDataFormatted}
                    qualificationLine={userSettings.qualificationLine}
                  />
                </Col>
                <Col span={24} className="h-30vh">
                  <MonthOverMonthAnalysis />
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default DataAnalysisPage;