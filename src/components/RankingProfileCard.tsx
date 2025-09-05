'use client';

import React from 'react';

type RankingProfileCardProps = {
  item: {
    rank: number;
    name: string;
    amount: number;
    avatar: string;
  };
  index: number;
};

const RankingProfileCard = ({ item, index }: RankingProfileCardProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold">
          {item.rank}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm opacity-80">{item.amount.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default RankingProfileCard;
