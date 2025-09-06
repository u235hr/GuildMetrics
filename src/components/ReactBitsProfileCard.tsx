'use client';

import React from 'react';

type RankItem = {
  rank: number;
  name: string;
  amount: number;
  avatar: string;
};

type ReactBitsProfileCardProps = {
  item: RankItem;
  index: number;
};

const ReactBitsProfileCard = ({ item, index }: ReactBitsProfileCardProps) => {
  const getRankColors = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          medal: '',
          medalColor: 'text-yellow-800'
        };
      case 2:
        return {
          medal: '',
          medalColor: 'text-gray-700'
        };
      case 3:
        return {
          medal: '',
          medalColor: 'text-orange-800'
        };
      default:
        return {
          medal: '',
          medalColor: 'text-gray-600'
        };
    }
  };

  const colors = getRankColors(item.rank);

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center p-2">
      {/* ?? - ?? */}
      <div className="text-2xl mb-2">
        <span className={colors.medalColor}>
          {colors.medal}
        </span>
      </div>

      {/* ?? */}
      <div className="w-12 h-12 mb-2">
        <img
          className="w-full h-full rounded-full border-2 border-white/80 shadow-md object-cover"
          src={item.avatar}
          alt={`${item.name} avatar`}
          loading="lazy"
          onError={e => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>

      {/* ???? */}
      <div className="text-center">
        <h3 className="text-xs font-bold text-black truncate w-full mb-1">
          {item.name}
        </h3>
        <p className="text-xs font-semibold text-black">
          {item.amount.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ReactBitsProfileCard;
