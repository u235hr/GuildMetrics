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
    data.find(item => item.rank === 2), // ??
    data.find(item => item.rank === 1), // ??
    data.find(item => item.rank === 3)  // ??
  ].filter(Boolean) as RankItem[], [data]);

  return (
    <div className="flex items-end justify-center gap-8">
      {/* ?? - ?? */}
      <div className="flex items-center justify-center bg-gradient-to-b from-gray-200 to-gray-400 text-black font-bold rounded-xl shadow-lg w-28 h-40 md:w-32 md:h-48">
        <ReactBitsProfileCard item={sortedData[0]} index={0} />
      </div>

      {/* ?? - ????? */}
      <div className="flex items-center justify-center bg-gradient-to-b from-yellow-200 to-yellow-500 text-black font-bold rounded-xl shadow-xl w-36 h-52 md:w-40 md:h-64">
        <ReactBitsProfileCard item={sortedData[1]} index={1} />
      </div>

      {/* ?? - ?? */}
      <div className="flex items-center justify-center bg-gradient-to-b from-orange-200 to-orange-600 text-black font-bold rounded-xl shadow-md w-24 h-36 md:w-28 md:h-40">
        <ReactBitsProfileCard item={sortedData[2]} index={2} />
      </div>
    </div>
  );
});

export default ReactBitsTopThreeDisplay;
