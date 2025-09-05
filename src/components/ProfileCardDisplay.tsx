'use client';

import { memo, useMemo, useCallback } from 'react';
import ProfileCard from './ProfileCard';

type RankItem = {
  rank: number;
  name: string;
  amount: number;
  avatar: string;
};

type ProfileCardDisplayProps = {
  data: RankItem[];
};

// 将getSize移到组件外部，避免重复创建
const getSize = (rank: number) => {
  switch (rank) {
    case 1: return { width: 'min(28vw, 18rem)', height: 'min(38vh, 22rem)' };
    case 2: return { width: 'min(24vw, 16rem)', height: 'min(34vh, 20rem)' };
    case 3: return { width: 'min(22vw, 14rem)', height: 'min(30vh, 18rem)' };
    default: return { width: 'min(22vw, 14rem)', height: 'min(30vh, 18rem)' };
  }
};

const ProfileCardDisplay = memo(function ProfileCardDisplay({ data }: ProfileCardDisplayProps) {
  const sortedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return [
      data.find(item => item.rank === 2), // 银在左边
      data.find(item => item.rank === 1), // 金在中间
      data.find(item => item.rank === 3)  // 铜在右边
    ].filter(Boolean) as RankItem[];
  }, [data]);

  // 使用useCallback缓存getSize函数
  const getSizeForRank = useCallback((rank: number) => getSize(rank), []);

  return (
    <div
      data-testid="profile-card-display"
      className="w-full h-full flex flex-col items-center justify-center p-4 relative overflow-hidden"
    >
      {/* 前三名卡片容器 */}
      <div className="flex items-end justify-center gap-8 relative w-full max-w-5xl h-full">
        {sortedData.map((item, index) => (
          <div 
            key={`card-${item.rank}`} 
            className="flex-shrink-0 relative"
            style={{ 
              width: getSizeForRank(item.rank).width, 
              height: getSizeForRank(item.rank).height,
            }}
          >
            <ProfileCard
              item={item}
              index={index}
            />
          </div>
        ))}
      </div>

      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-400/10 via-gray-400/10 to-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-pink-500/5 to-red-500/5 rounded-full blur-2xl" />
      </div>
    </div>
  );
});

export default ProfileCardDisplay;