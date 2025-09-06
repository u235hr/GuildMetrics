import React from 'react';

interface RankingItem {
  rank: number;
  name: string;
  amount: number;
  momGrowth?: number;
  yoyGrowth?: number;
}

interface RankingTableProps {
  data: RankingItem[];
}

const GrowthText = ({ value }: { value: number | undefined }) => {
  if (value === undefined || value === 0) {
    return <span className="font-semibold text-white/50">-</span>;
  }
  const isPositive = value > 0;
  const text = isPositive ? '+' + value.toFixed(1) + '%' : value.toFixed(1) + '%';
  const colorClass = isPositive ? 'text-red-400' : 'text-green-400';
  return <span className={'font-semibold ' + colorClass}>{text}</span>;
};

export default function RankingTable({ data }: RankingTableProps) {
  return (
    <div data-testid="ranking-table" className="h-full w-full text-sm bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg overflow-y-auto shadow-lg">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-black/40 backdrop-blur-sm z-10">
          <tr>
            <th className="text-left p-4 text-white/80 font-semibold border-b border-white/10">排名</th>
            <th className="text-left p-4 text-white/80 font-semibold border-b border-white/10">主播名</th>
            <th className="text-right p-4 text-white/80 font-semibold border-b border-white/10">礼物值</th>
            <th className="text-right p-4 text-white/80 font-semibold border-b border-white/10">环比增长</th>
            <th className="text-right p-4 text-white/80 font-semibold border-b border-white/10">同比增长</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.rank} className="hover:bg-white/5 transition-colors">
              <td className="p-4 text-white/90 font-medium border-b border-white/5">{item.rank}</td>
              <td className="p-4 text-white/90 font-medium border-b border-white/5">{item.name}</td>
              <td className="p-4 text-right text-white/90 font-medium border-b border-white/5">
                {item.amount.toLocaleString()}
              </td>
              <td className="p-4 text-right border-b border-white/5">
                <GrowthText value={item.momGrowth} />
              </td>
              <td className="p-4 text-right border-b border-white/5">
                <GrowthText value={item.yoyGrowth} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
