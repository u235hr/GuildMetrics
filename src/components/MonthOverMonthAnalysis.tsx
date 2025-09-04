import React from 'react';
import type { StreamerComparison } from '../types';
import { useMonthComparison, useChartData } from '../store';
import MonthOverMonthCharts from './Charts/MonthOverMonthCharts';

const MonthOverMonthAnalysis: React.FC = () => {
  const comparisonData = useMonthComparison();
  const chartData = useChartData();

  if (!comparisonData) {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-white">月度环比分析</h2>
        <div className="h-96 flex flex-col justify-center items-center">
          <svg className="w-16 h-16 text-white/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-white/60">需要至少两个月的数据才能进行环比分析</p>
        </div>
      </div>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': 
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
          </svg>
        );
      case 'down': 
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        );
      default: 
        return (
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14"></path>
          </svg>
        );
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      <MonthOverMonthCharts data={chartData.trendChart} />
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-white">主播环比详情</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 px-4 text-left text-white/70 font-medium">主播</th>
                <th className="py-3 px-4 text-left text-white/70 font-medium">当前排名</th>
                <th className="py-3 px-4 text-left text-white/70 font-medium">上月排名</th>
                <th className="py-3 px-4 text-left text-white/70 font-medium">排名变化</th>
                <th className="py-3 px-4 text-left text-white/70 font-medium">当前礼物值</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.streamerComparisons.map((record) => (
                <tr key={record.name} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-white">{record.name}</span>
                      {record.isNewcomer && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                          新人
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-white/80">{record.currentRank}</td>
                  <td className="py-3 px-4 text-white/80">{record.previousRank || '-'}</td>
                  <td className="py-3 px-4">
                    {record.rankChange === '-' ? (
                      <span>-</span>
                    ) : (
                      <div className={`flex items-center gap-1 ${getTrendColor(record.rankChange.trend)}`}>
                        {getTrendIcon(record.rankChange.trend)}
                        <span>{record.rankChange.text}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-white/80">
                    {record.currentGiftValue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="text-white/60 text-sm">
            显示 {comparisonData.streamerComparisons.length} 条记录
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20 transition-colors text-sm">
              1
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthOverMonthAnalysis;