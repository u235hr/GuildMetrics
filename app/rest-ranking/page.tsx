'use client';

import React from 'react';
import RestRankingList from '@/components/RestRankingList';

// 模拟数据 - 从第四名开始到最后一名的排名
const mockRankingData = [
  { rank: 4, name: '张三', coinAmount: 15000 },
  { rank: 5, name: '李四', coinAmount: 12000 },
  { rank: 6, name: '王五', coinAmount: 10000 },
  { rank: 7, name: '赵六', coinAmount: 8500 },
  { rank: 8, name: '钱七', coinAmount: 7000 },
  { rank: 9, name: '孙八', coinAmount: 6000 },
  { rank: 10, name: '周九', coinAmount: 5000 },
  { rank: 11, name: '吴十', coinAmount: 4500 },
  { rank: 12, name: '郑十一', coinAmount: 4000 },
  { rank: 13, name: '王十二', coinAmount: 3500 },
  { rank: 14, name: '冯十三', coinAmount: 3000 },
  { rank: 15, name: '陈十四', coinAmount: 2500 },
  { rank: 16, name: '褚十五', coinAmount: 2000 },
  { rank: 17, name: '卫十六', coinAmount: 1800 },
  { rank: 18, name: '蒋十七', coinAmount: 1500 },
  { rank: 19, name: '沈十八', coinAmount: 1200 },
  { rank: 20, name: '韩十九', coinAmount: 1000 },
  { rank: 21, name: '杨二十', coinAmount: 800 },
  { rank: 22, name: '朱二一', coinAmount: 600 },
  { rank: 23, name: '秦二二', coinAmount: 400 },
  { rank: 24, name: '尤二三', coinAmount: 200 },
  { rank: 25, name: '许二四', coinAmount: 100 },
];

const THRESHOLD_VALUE = 5000; // 门槛值：5000币

export default function RestRankingPage() {
  const handleItemSelect = (item: any, index: number) => {
    console.log('Selected item:', item, 'Index:', index);
  };

  return (
    <div className="min-h-screen bg-[#060010] p-8">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">剩余排名榜</h1>
          <p className="text-gray-400 text-lg">第4名至最后一名排名列表</p>
        </div>

        {/* 门槛值说明 */}
        <div className="mb-6 p-4 bg-[#1a1a1a] rounded-lg border border-red-500/30">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-white">门槛以上 (≥{THRESHOLD_VALUE.toLocaleString()}币)</span>
            <div className="w-4 h-4 bg-gray-500 rounded ml-8"></div>
            <span className="text-gray-400">门槛以下 (&lt;{THRESHOLD_VALUE.toLocaleString()}币)</span>
          </div>
        </div>

        {/* 排名列表 */}
        <RestRankingList
          items={mockRankingData}
          thresholdValue={THRESHOLD_VALUE}
          liveDurationThreshold={100}
          onItemSelect={handleItemSelect}
          showGradients={true}
          enableArrowNavigation={true}
          displayScrollbar={true}
        />

        {/* 统计信息 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1a1a1a] p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">
              {mockRankingData.filter(item => item.coinAmount >= THRESHOLD_VALUE).length}
            </div>
            <div className="text-gray-400">门槛以上人数</div>
          </div>
          
          <div className="bg-[#1a1a1a] p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-400">
              {mockRankingData.filter(item => item.coinAmount < THRESHOLD_VALUE).length}
            </div>
            <div className="text-gray-400">门槛以下人数</div>
          </div>
          
          <div className="bg-[#1a1a1a] p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {mockRankingData.length}
            </div>
            <div className="text-gray-400">总人数</div>
          </div>
        </div>
      </div>
    </div>
  );
}
