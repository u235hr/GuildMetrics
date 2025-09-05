'use client';

import { memo, useMemo } from 'react';
import ReactBitsProfileCard from './ReactBitsProfileCard';

type RankItem = {
  rank: number;
  name: string;
  amount: number;
  avatar: string;
};

type ReactBitsTopThreeDisplayProps = {
  data: RankItem[];
};

const ReactBitsTopThreeDisplay = memo(function ReactBitsTopThreeDisplay({ data }: ReactBitsTopThreeDisplayProps) {
  const sortedData = useMemo(() => [
    data.find(item => item.rank === 2),
    data.find(item => item.rank === 1),
    data.find(item => item.rank === 3)
  ].filter(Boolean) as RankItem[], [data]);

  return (
    <div
      data-testid="react-bits-top-three"
      className="h-full w-full flex flex-col items-center justify-center p-4 relative overflow-hidden"
    >
      <div className="mb-8 text-center flex-shrink-0">
        <h2>
           排行榜前三名
        </h2>
        <p className="text-lg">
          礼物数量排名
        </p>
      </div>

      <div className="flex items-center justify-center gap-8 relative flex-1 w-full max-w-5xl">
        {sortedData.map((item, index) => (
          <div key={`card-${item.rank}`} className="flex-shrink-0">
            <ReactBitsProfileCard
              item={item}
              index={index}
              isFirst={index === 1}
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-400/10 via-gray-400/10 to-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-pink-500/5 to-red-500/5 rounded-full blur-2xl" />
      </div>
    </div>
  );
});

export default ReactBitsTopThreeDisplay;
