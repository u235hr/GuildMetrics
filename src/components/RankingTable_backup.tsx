'use client';

// Define the type for the props
type TableItem = {
  rank: number;
  name: string;
  amount: number;
  mom_growth: number;
  yoy_growth: number; // Added
};

type RankingTableProps = {
  data: TableItem[];
};

const GrowthText = ({ value }: { value: number }) => {
  if (value === 0) {
      return <span className="font-semibold text-white/50">-</span>;
  }
  const isPositive = value > 0;
  const text = isPositive ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
  const colorClass = isPositive ? "text-red-400" : "text-green-400";
  return <span className={`font-semibold ${colorClass}`}>{text}</span>;
};

export default function RankingTable({ data }: RankingTableProps) {
  return (
    // 确保使用容器查询单位作为字体基准，并设置正确的高度
    <div data-testid="ranking-table" className="h-full text-sm bg-black/20 backdrop-blur-sm border border-white/10 rounded-[0.6em] overflow-y-auto shadow-lg">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-black/40 backdrop-blur-md z-10">
          <tr>
            {/* 严格按照规范设置列宽度 */}
            <th className="p-3 text-left w-[10%] font-semibold text-white/70">排名</th>
            <th className="p-3 text-left w-[30%] font-semibold text-white/70">主播名</th>
            <th className="p-3 text-left w-[25%] font-semibold text-white/70">礼物价值</th>
            <th className="p-3 text-left w-[17.5%] font-semibold text-white/70">月度环比</th>
            <th className="p-3 text-left w-[17.5%] font-semibold text-white/70">同比增长</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={`${item.rank}-${item.name}`} data-testid={`row-${item.rank}-${item.name}`} className="border-t border-white/10 hover:bg-white/5 transition-colors duration-200">
              <td className="p-3 text-white/80">{item.rank}</td>
              <td className="p-3 text-white/90 font-medium">{item.name}</td>
              <td className="p-3 text-white/80">¥{item.amount.toLocaleString()}</td>
              <td className="p-3"><GrowthText value={item.mom_growth} /></td>
              <td className="p-3"><GrowthText value={item.yoy_growth} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}