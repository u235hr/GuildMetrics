'use client';

import Image from 'next/image';
import CountUp from 'react-countup';

// Define the type for the props
type RankItem = {
  rank: number;
  name: string;
  amount: number;
  avatar: string;
};

type TopThreeDisplayProps = {
  data: RankItem[];
};

export default function TopThreeDisplay({ data }: TopThreeDisplayProps) {
  // The component now receives data via props
  const getCardClasses = (rank: number) => {
    // 调整卡片尺寸以适应容器高度
    const baseClasses = "relative w-[15em] h-[10em] rounded-[1em] p-[1em] flex flex-col items-center justify-center shadow-[inset_2px_2px_6px_rgba(255,255,255,0.4),inset_-4px_-4px_8px_rgba(0,0,0,0.2),0_8px_12px_rgba(0,0,0,0.5)] transition-transform duration-300";
    if (rank === 1) return `${baseClasses} bg-gradient-to-br from-gold-start to-gold-end z-10 scale-105`;
    if (rank === 2) return `${baseClasses} bg-gradient-to-br from-silver-start to-silver-end`;
    if (rank === 3) return `${baseClasses} bg-gradient-to-br from-bronze-start to-bronze-end`;
    return baseClasses;
  };

  const getRankText = (rank: number) => {
    if (rank === 1) return '冠军';
    if (rank === 2) return '亚军';
    if (rank === 3) return '季军';
    return '';
  }

  return (
    <div data-testid="top-three" className="h-full flex justify-center items-center gap-6 text-base">
      {data.map((item) => (
        <div key={item.rank} data-testid={`top-card-${item.rank}`} className={getCardClasses(item.rank) + ' w-64 h-40'}>
          <div className="absolute top-2 left-3 text-sm font-bold text-white/80 drop-shadow-lg">
            {getRankText(item.rank)}
          </div>
          <div className="flex flex-col items-center text-white">
            <Image
              src={item.avatar}
              alt={item.name}
              width={48} height={48}
              className="w-12 h-12 rounded-full border-2 border-white/50 object-cover shadow-lg"
              onError={(e) => { e.currentTarget.src = '/globe.svg'; }} // Fallback avatar
            />
            <h3 className="mt-2 text-base font-bold drop-shadow-md">{item.name}</h3>
            <p className="mt-1 text-base font-bold">
              <CountUp end={item.amount} duration={2.5} separator="," prefix="¥" />
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}