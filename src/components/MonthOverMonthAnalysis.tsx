import React from 'react';
import { Card, Table, Tag, Empty } from 'antd';
import {
  RiseOutlined,
  FallOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { StreamerComparison } from '../types';
import { useMonthComparison, useChartData } from '../store';
import MonthOverMonthCharts from './Charts/MonthOverMonthCharts';



const MonthOverMonthAnalysis: React.FC = () => {
  const comparisonData = useMonthComparison();
  const chartData = useChartData();

  if (!comparisonData) {
    return (
      <Card title="月度环比分析">
        <div className="h-96 flex justify-center items-center">
          <Empty description="需要至少两个月的数据才能进行环比分析" />
        </div>
      </Card>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <RiseOutlined className="text-green-500" />;
      case 'down': return <FallOutlined className="text-red-500" />;
      default: return <MinusOutlined className="text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const columns: ColumnsType<StreamerComparison> = [
    { title: '主播', dataIndex: 'name', key: 'name', fixed: 'left', width: 120, render: (name, record) => <div className="flex items-center gap-2"><span>{name}</span>{record.isNewcomer && <Tag color="success">新人</Tag>}</div> },
    { title: '当前排名', dataIndex: 'currentRank', key: 'currentRank', width: 100, sorter: (a, b) => a.currentRank - b.currentRank },
    { title: '上月排名', dataIndex: 'previousRank', key: 'previousRank', width: 100, render: rank => rank || '-' },
    { title: '排名变化', dataIndex: 'rankChange', key: 'rankChange', width: 120, render: (rc) => rc === '-' ? '-' : <div className={`flex items-center gap-1 ${getTrendColor(rc.trend)}`}>{getTrendIcon(rc.trend)} {rc.text}</div> },
    { title: '当前礼物值', dataIndex: 'currentGiftValue', key: 'currentGiftValue', width: 150, render: val => val.toLocaleString(), sorter: (a, b) => a.currentGiftValue - b.currentGiftValue },
  ];

  return (
    <div className="flex flex-col space-y-8">
      <MonthOverMonthCharts data={chartData.trendChart} />
      <Card title="主播环比详情">
        <Table columns={columns} dataSource={comparisonData.streamerComparisons} rowKey="name" scroll={{ x: 600 }} pagination={{ pageSize: 10, showSizeChanger: false }} />
      </Card>
    </div>
  );
};

export default MonthOverMonthAnalysis;