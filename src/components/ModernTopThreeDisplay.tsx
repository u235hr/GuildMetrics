'use client';

import RankingProfileCard from './RankingProfileCard';

// Define the type for the props
type RankItem = {
  rank: number;
  name: string;
  amount: number;
  avatar: string;
};

type ModernTopThreeDisplayProps = {
  data: RankItem[];
};

export default function ModernTopThreeDisplay({ data }: ModernTopThreeDisplayProps) {
  // 重新排列数据：铜(3) 银(2) 金(1) - 翻转顺序
  const sortedData = [
    data.find(item => item.rank === 3), // 铜在左边
    data.find(item => item.rank === 2), // 银在中间
    data.find(item => item.rank === 1)  // 金在右边
  ].filter(Boolean) as RankItem[];

  return (
    <div 
      data-testid="modern-top-three" 
      className="h-full flex flex-col items-center justify-center p-8 relative"
    >
      {/* 标题 */}
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
          🏆 排行榜前三名
        </h2>
        <p className="text-white/70 text-lg">
          礼物数量排名
        </p>
      </div>

      {/* 三个卡片容器 */}
      <div className="flex items-end justify-center gap-8 relative">
        {sortedData.map((item, index) => (
          <RankingProfileCard
            key={`card-${item.rank}`}
            item={item}
            index={index}
            isFirst={index === 0}
          />
        ))}
      </div>

      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-400/10 via-gray-400/10 to-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-pink-500/5 to-red-500/5 rounded-full blur-2xl" />
      </div>

      {/* 底部装饰线 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent rounded-full" />
    </div>
  );
}