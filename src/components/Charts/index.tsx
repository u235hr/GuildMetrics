/**
 * 图表可视化组件集合 - 展示礼物值数据的各种图表
 * 包含：趋势图、分布图、对比图等
 */

import React, { useMemo } from 'react';
import { Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart } from 'recharts';
import useResponsive from '../../hooks/useResponsive';
import type { MonthlyData } from '../../types';

interface ChartsProps {
  currentMonthData: MonthlyData | null;
  previousMonthData: MonthlyData | null;
  loading?: boolean;
  qualificationLine?: number;
}

// 现代化图表颜色主题
const CHART_COLORS = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#56ab2f',
  warning: '#f093fb',
  error: '#ff6b6b',
  gold: '#ffd89b',
  silver: '#a8edea',
  bronze: '#d299c2',
  gradient: {
    primary: ['#667eea', '#764ba2'],
    success: ['#56ab2f', '#a8e6cf'],
    warning: ['#f093fb', '#f5576c'],
    error: ['#ff6b6b', '#ffa726'],
    gold: ['#ffd89b', '#19547b'],
    silver: ['#a8edea', '#fed6e3'],
    bronze: ['#d299c2', '#fef9d7'],
    rainbow: ['#667eea', '#764ba2', '#56ab2f', '#f093fb', '#ff6b6b', '#ffd89b', '#a8edea', '#d299c2']
  },
  glassmorphism: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'rgba(255, 255, 255, 0.2)',
    shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
  }
};

// 数据格式化工具
const formatGiftValue = (value: number): string => {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}万`;
  }
  return value.toLocaleString();
};

const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

const Charts: React.FC<ChartsProps> = ({ 
  currentMonthData, 
  previousMonthData, 
  loading = false,
  qualificationLine = 50000 
}) => {
  const { isMobile, isTablet } = useResponsive();
  // 计算趋势图数据
  const trendData = useMemo(() => {
    if (!currentMonthData && !previousMonthData) return [];
    
    const data = [];
    
    if (previousMonthData) {
      data.push({
        month: `${previousMonthData.year}年${previousMonthData.month}月`,
        totalGiftValue: previousMonthData.totalGiftValue,
        streamerCount: previousMonthData.streamers.length,
        avgGiftValue: Math.round(previousMonthData.totalGiftValue / previousMonthData.streamers.length),
        qualifiedCount: previousMonthData.streamers.filter(s => s.giftValue >= qualificationLine).length
      });
    }
    
    if (currentMonthData) {
      data.push({
        month: `${currentMonthData.year}年${currentMonthData.month}月`,
        totalGiftValue: currentMonthData.totalGiftValue,
        streamerCount: currentMonthData.streamers.length,
        avgGiftValue: Math.round(currentMonthData.totalGiftValue / currentMonthData.streamers.length),
        qualifiedCount: currentMonthData.streamers.filter(s => s.giftValue >= qualificationLine).length
      });
    }
    
    return data;
  }, [currentMonthData, previousMonthData, qualificationLine]);

  // 计算分布图数据
  const distributionData = useMemo(() => {
    if (!currentMonthData) return [];
    
    const ranges = [
      { name: '10万以下', min: 0, max: 100000, color: CHART_COLORS.error },
      { name: '10-20万', min: 100000, max: 200000, color: CHART_COLORS.warning },
      { name: '20-50万', min: 200000, max: 500000, color: CHART_COLORS.primary },
      { name: '50-100万', min: 500000, max: 1000000, color: CHART_COLORS.success },
      { name: '100万以上', min: 1000000, max: Infinity, color: CHART_COLORS.gold }
    ];
    
    return ranges.map(range => {
      const count = currentMonthData.streamers.filter(s => 
        s.giftValue >= range.min && s.giftValue < range.max
      ).length;
      
      const percentage = (count / currentMonthData.streamers.length) * 100;
      
      return {
        name: range.name,
        count,
        percentage,
        color: range.color
      };
    }).filter(item => item.count > 0);
  }, [currentMonthData]);

  // 计算排行榜数据（前10名）
  const topStreamersData = useMemo(() => {
    if (!currentMonthData) return [];
    
    return currentMonthData.streamers
      .slice(0, 10)
      .map((streamer, index) => ({
        rank: index + 1,
        name: streamer.name.length > 6 ? `${streamer.name.slice(0, 6)}...` : streamer.name,
        fullName: streamer.name,
        giftValue: streamer.giftValue,
        color: index < 3 ? [CHART_COLORS.gold, CHART_COLORS.silver, CHART_COLORS.bronze][index] : CHART_COLORS.primary
      }));
  }, [currentMonthData]);

  // 计算达标率数据
  const qualificationData = useMemo(() => {
    if (!currentMonthData) return [];
    
    const qualified = currentMonthData.streamers.filter(s => s.giftValue >= qualificationLine).length;
    const unqualified = currentMonthData.streamers.length - qualified;
    const qualificationRate = (qualified / currentMonthData.streamers.length) * 100;
    
    return [
      { name: '达标', value: qualified, percentage: qualificationRate, color: CHART_COLORS.success },
      { name: '未达标', value: unqualified, percentage: 100 - qualificationRate, color: CHART_COLORS.error }
    ];
  }, [currentMonthData, qualificationLine]);

  // 计算前三名占月度流水比例数据
  const topThreeRatioData = useMemo(() => {
    if (!currentMonthData) return [];
    
    const topThreeTotal = currentMonthData.streamers.slice(0, 3).reduce((sum, streamer) => sum + streamer.giftValue, 0);
    const totalGiftValue = currentMonthData.totalGiftValue;
    const othersTotal = totalGiftValue - topThreeTotal;
    
    const topThreePercentage = (topThreeTotal / totalGiftValue) * 100;
    const othersPercentage = (othersTotal / totalGiftValue) * 100;
    
    return [
      { name: '前三名', value: topThreeTotal, percentage: topThreePercentage, color: CHART_COLORS.gold },
      { name: '其他主播', value: othersTotal, percentage: othersPercentage, color: CHART_COLORS.primary }
    ];
  }, [currentMonthData]);

  // 计算月流水环比数据
  const monthlyRevenueComparisonData = useMemo(() => {
    if (!currentMonthData || !previousMonthData) return [];
    
    const currentRevenue = currentMonthData.totalGiftValue;
    const previousRevenue = previousMonthData.totalGiftValue;
    const growthRate = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    
    return [
      {
        month: `${previousMonthData.year}年${previousMonthData.month}月`,
        revenue: previousRevenue,
        growth: 0
      },
      {
        month: `${currentMonthData.year}年${currentMonthData.month}月`,
        revenue: currentRevenue,
        growth: growthRate
      }
    ];
  }, [currentMonthData, previousMonthData]);

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg h-96">
        <h2 className="text-xl font-bold mb-4 text-white">数据图表</h2>
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-white/80">加载图表数据中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentMonthData) {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg h-96">
        <h2 className="text-xl font-bold mb-4 text-white">数据图表</h2>
        <div className="flex flex-col items-center justify-center h-full">
          <svg className="w-16 h-16 text-white/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-white/60">暂无数据，请先上传月度数据文件</p>
        </div>
      </div>
    );
  }

  // 自定义卡片样式
  const cardStyle = {
    background: `linear-gradient(135deg, ${CHART_COLORS.glassmorphism.background}, rgba(255, 255, 255, 0.05))`,
    backdropFilter: 'blur(10px)',
    border: `1px solid ${CHART_COLORS.glassmorphism.border}`,
    borderRadius: '1rem',
    boxShadow: CHART_COLORS.glassmorphism.shadow,
    overflow: 'hidden' as const
  };

  const titleStyle = {
    background: `linear-gradient(135deg, ${CHART_COLORS.gradient.primary[0]}, ${CHART_COLORS.gradient.primary[1]})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 600,
    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
    margin: 0
  };

  return (
    <div className="charts-container" style={{ padding: '24px', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      {/* 标题区域 */}
      <div style={{ 
        marginBottom: '32px', 
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))',
        padding: '24px',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.3)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <svg style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: CHART_COLORS.primary, marginBottom: 'clamp(0.5rem, 1vw, 0.75rem)' }} className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        <h2 style={{
          background: `linear-gradient(135deg, ${CHART_COLORS.gradient.primary[0]}, ${CHART_COLORS.gradient.primary[1]})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: '8px 0 4px 0'
        }} className="text-2xl font-bold">
          数据分析图表
        </h2>
        <p style={{ color: '#666', fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)' }}>深度洞察主播表现数据，助力精准决策</p>
      </div>

      <div className="space-y-6">
      {/* 趋势对比图 */}
      {trendData.length > 1 && (
        <div style={cardStyle} className="w-full p-4 rounded-xl">
          <h3 className="text-lg font-bold mb-4" style={titleStyle}>月度趋势对比</h3>
          <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.gradient.primary[0]} stopOpacity={0.8}/>
                  <stop offset="50%" stopColor={CHART_COLORS.gradient.primary[1]} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={CHART_COLORS.gradient.primary[1]} stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.gradient.success[0]} stopOpacity={0.8}/>
                  <stop offset="50%" stopColor={CHART_COLORS.gradient.success[1]} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={CHART_COLORS.gradient.success[1]} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" />
              <XAxis dataKey="month" stroke="#666" fontSize={12} />
              <YAxis yAxisId="left" orientation="left" tickFormatter={formatGiftValue} stroke="#666" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                  backdropFilter: 'blur(10px)'
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'totalGiftValue' || name === 'avgGiftValue') {
                    return [formatGiftValue(value), name === 'totalGiftValue' ? '总礼物值' : '平均礼物值'];
                  }
                  return [value, name === 'streamerCount' ? '主播数量' : '达标人数'];
                }}
              />
              <Legend />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="totalGiftValue" 
                stroke={CHART_COLORS.gradient.primary[0]}
                fillOpacity={1}
                fill="url(#colorTotal)"
                strokeWidth={3}
                name="总礼物值"
              />
              <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="streamerCount" 
                  stroke={CHART_COLORS.gradient.warning[0]}
                  strokeWidth={3}
                  name="主播数量"
                  dot={{ fill: CHART_COLORS.gradient.warning[0], strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: CHART_COLORS.gradient.warning[0], strokeWidth: 2 }}
                />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="qualifiedCount" 
                stroke={CHART_COLORS.gradient.success[0]}
                strokeWidth={3}
                name="达标人数"
                dot={{ fill: CHART_COLORS.gradient.success[0], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: CHART_COLORS.gradient.success[0], strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 排名前10图表 */}
        <div style={cardStyle} className="h-96 p-4 rounded-xl">
          <h3 className="text-lg font-bold mb-4" style={titleStyle}>{isMobile ? "TOP10" : "礼物值排行榜 TOP10"}</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topStreamersData} layout="horizontal">
              <defs>
                {topStreamersData.map((entry, index) => (
                  <linearGradient key={`gradient-${index}`} id={`barGradient-${index}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={0.8}/>
                    <stop offset="100%" stopColor={entry.color} stopOpacity={1}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" />
              <XAxis type="number" tickFormatter={formatGiftValue} stroke="#666" fontSize={isMobile ? 10 : 12} />
              <YAxis dataKey="name" type="category" width={isMobile ? 60 : 80} stroke="#666" fontSize={isMobile ? 10 : 12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                  backdropFilter: 'blur(10px)'
                }}
                formatter={(value: number) => [formatGiftValue(value), '礼物值']}
                labelFormatter={(label: string) => {
                  const streamer = topStreamersData.find(s => s.name === label);
                  return streamer ? streamer.fullName : label;
                }}
              />
              <Bar dataKey="giftValue" radius={[0, 8, 8, 0]}>
                {topStreamersData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#barGradient-${index})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 礼物值分布图 */}
        <div style={cardStyle} className="h-96 p-4 rounded-xl">
          <h3 className="text-lg font-bold mb-4" style={titleStyle}>礼物值分布</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {distributionData.map((entry, index) => (
                  <linearGradient key={`pieGradient-${index}`} id={`pieGradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={0.8}/>
                    <stop offset="100%" stopColor={entry.color} stopOpacity={1}/>
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="count"
                label={({ name, percentage }) => `${name} ${formatPercentage(percentage)}`}
                labelLine={false}
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#pieGradient-${index})`} stroke="rgba(255,255,255,0.8)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                  backdropFilter: 'blur(10px)'
                }}
                formatter={(value: number, name: string, props: any) => [
                  `${value}人 (${formatPercentage(props.payload?.percentage || 0)})`,
                  '人数'
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 前三名占月度流水比例图 */}
        <div style={cardStyle} className="h-96 p-4 rounded-xl">
          <h3 className="text-lg font-bold mb-4" style={titleStyle}>前三名占月度流水比例</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {topThreeRatioData.map((entry, index) => (
                  <linearGradient key={`topThreeGradient-${index}`} id={`topThreeGradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={0.8}/>
                    <stop offset="100%" stopColor={entry.color} stopOpacity={1}/>
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={topThreeRatioData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percentage }) => `${name}: ${formatPercentage(percentage)}`}
                labelLine={false}
              >
                {topThreeRatioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#topThreeGradient-${index})`} stroke="rgba(255,255,255,0.8)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                  backdropFilter: 'blur(10px)'
                }}
                formatter={(value: number, name: string, props: any) => [
                  `${formatGiftValue(value)} (${formatPercentage(props.payload?.percentage || 0)})`,
                  '礼物值'
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 达标率图表 */}
        <div style={cardStyle} className="h-96 p-4 rounded-xl">
          <h3 className="text-lg font-bold mb-4" style={titleStyle}>{`达标率分析 (合格线: ${formatGiftValue(qualificationLine)})`}</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {qualificationData.map((entry, index) => (
                  <linearGradient key={`qualGradient-${index}`} id={`qualGradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={0.8}/>
                    <stop offset="100%" stopColor={entry.color} stopOpacity={1}/>
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={qualificationData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                label={({ name, percentage }) => `${name}: ${formatPercentage(percentage)}`}
                labelLine={false}
              >
                {qualificationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#qualGradient-${index})`} stroke="rgba(255,255,255,0.8)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                  backdropFilter: 'blur(10px)'
                }}
                formatter={(value: number, name: string, props: any) => [
                  `${value}人 (${formatPercentage(props.payload?.percentage || 0)})`,
                  '人数'
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Charts;