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
    const baseClasses = "relative w-[20em] h-[12em] rounded-[1em] p-[1em] flex flex-col items-center justify-center shadow-[inset_2px_2px_6px_rgba(255,255,255,0.4),inset_-4px_-4px_8px_rgba(0,0,0,0.2),0_8px_12px_rgba(0,0,0,0.5)] transition-transform duration-300";
    if (rank === 1) return `${baseClasses} bg-gradient-to-br from-gold-start to-gold-end z-10 scale-110`;
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
    <div className="h-full flex justify-center items-center gap-[2em] container-type-size text-[min(2cqw,2cqh)]">
      {data.map((item) => (
        <div key={item.rank} className={getCardClasses(item.rank)}>
          <div className="absolute top-[0.8em] left-[1em] text-[1.1em] font-bold text-white/80 drop-shadow-lg">
            {getRankText(item.rank)}
          </div>
          <div className="flex flex-col items-center text-white">
            <Image
              src={item.avatar}
              alt={item.name}
              width={64} height={64}
              className="w-[4em] h-[4em] rounded-full border-[0.2em] border-white/50 object-cover shadow-lg"
              onError={(e) => { e.currentTarget.src = '/globe.svg'; }} // Fallback avatar
            />
            <h3 className="mt-[0.6em] text-[1.2em] font-bold drop-shadow-md">{item.name}</h3>
            <p className="mt-[0.2em] text-[1.1em] font-bold">
              <CountUp end={item.amount} duration={2.5} separator="," prefix="¥" />
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}