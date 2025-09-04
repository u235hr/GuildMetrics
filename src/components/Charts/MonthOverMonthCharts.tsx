import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

interface MonthOverMonthChartsProps {
  data: Array<{
    month: string;
    totalGiftValue: number;
    streamerCount: number;
    averageGiftValue: number;
    [key: string]: string | number;
  }>;
}

const formatYAxisTick = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return value.toString();
};

const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-700/80 backdrop-blur-sm p-3 border border-slate-600 rounded-lg">
        <p className="label text-slate-200 font-bold">{`${label}`}</p>
        {payload.map((pld, index: number) => (
          <p key={index} style={{ color: pld.color }}>
            {`${pld.name}: ${typeof pld.value === 'number' ? pld.value.toLocaleString() : pld.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const MonthOverMonthCharts: React.FC<MonthOverMonthChartsProps> = ({ data }) => {
  const hasData = data && data.length > 0;

  return (
    <div id="chart-container" className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">月度趋势分析</h2>
      {hasData ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="month" strokeOpacity={0.7} />
              <YAxis yAxisId="left" stroke="#8884d8" tickFormatter={formatYAxisTick} strokeOpacity={0.7} />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" strokeOpacity={0.7} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ opacity: 0.7 }} />
              <Line yAxisId="left" type="monotone" dataKey="totalGiftValue" name="总礼物值" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
              <Line yAxisId="right" type="monotone" dataKey="streamerCount" name="主播数量" stroke="#82ca9d" strokeWidth={2} />
              <Line yAxisId="left" type="monotone" dataKey="averageGiftValue" name="平均礼物值" stroke="#ffc658" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-80 flex flex-col justify-center items-center">
          <svg className="w-16 h-16 text-white/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-white/60">暂无足够数据进行趋势分析</p>
        </div>
      )}
    </div>
  );
};

export default MonthOverMonthCharts;