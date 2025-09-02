
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts';
import { Card, Empty } from 'antd';



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

import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

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
    <Card id="chart-container" title="月度趋势分析">
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
        <div className="h-80 flex justify-center items-center">
          <Empty description="暂无足够数据进行趋势分析" />
        </div>
      )}
    </Card>
  );
};

export default MonthOverMonthCharts;
