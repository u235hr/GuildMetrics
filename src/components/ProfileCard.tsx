'use client';

import React, { useEffect, useState } from 'react';

type RankItem = {
  rank: number;
  name: string;
  amount: number;
  avatar: string;
};

type ProfileCardProps = {
  item: RankItem;
  index: number;
};

const ProfileCard = ({ item, index }: ProfileCardProps) => {
  const [countValue, setCountValue] = useState(0);

  // 数字计数动画
  useEffect(() => {
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;
    const endValue = item.amount;

    const animateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeOutCubic;
      
      setCountValue(Math.floor(currentValue));
      
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animateCount);
    }, index * 200);

    return () => clearTimeout(timer);
  }, [item.amount, index]);

  // 根据排名获取样式
  const getCardStyle = (rank: number) => {
    switch (rank) {
      case 1: // 金牌
        return {
          background: 'linear-gradient(135deg, #ffd700 0%, #ffb300 50%, #ff8c00 100%)',
          borderColor: '#ffd700',
          shadowColor: 'rgba(255, 215, 0, 0.5)',
          textColor: '#8b4513',
          rankBg: 'linear-gradient(135deg, #fff 0%, #ffd700 100%)'
        };
      case 2: // 银牌
        return {
          background: 'linear-gradient(135deg, #c0c0c0 0%, #a9a9a9 50%, #808080 100%)',
          borderColor: '#c0c0c0',
          shadowColor: 'rgba(192, 192, 192, 0.5)',
          textColor: '#2f2f2f',
          rankBg: 'linear-gradient(135deg, #fff 0%, #c0c0c0 100%)'
        };
      case 3: // 铜牌
        return {
          background: 'linear-gradient(135deg, #cd7f32 0%, #b8860b 50%, #8b4513 100%)',
          borderColor: '#cd7f32',
          shadowColor: 'rgba(205, 127, 50, 0.5)',
          textColor: '#fff',
          rankBg: 'linear-gradient(135deg, #fff 0%, #cd7f32 100%)'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #4a90e2 0%, #2c5aa0 50%, #1e3a8a 100%)',
          borderColor: '#4a90e2',
          shadowColor: 'rgba(74, 144, 226, 0.5)',
          textColor: '#fff',
          rankBg: 'linear-gradient(135deg, #fff 0%, #4a90e2 100%)'
        };
    }
  };

  const cardStyle = getCardStyle(item.rank);

  return (
    <div className="relative w-full h-full">
      <div 
        className="relative w-full h-full rounded-2xl shadow-2xl transition-all duration-300 ease-out flex flex-col items-center justify-center p-8 transform-gpu"
        style={{
          background: cardStyle.background,
          border: `3px solid ${cardStyle.borderColor}`,
          boxShadow: `0 20px 40px -12px ${cardStyle.shadowColor}, 0 0 0 1px rgba(255, 255, 255, 0.1)`
        }}
      >
        {/* 背景光效 */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none" />

        {/* 头像 */}
        <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white/60 shadow-xl mb-6">
          <img
            src={item.avatar}
            alt={`${item.name} avatar`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `data:image/svg+xml,${encodeURIComponent(
                `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="100" r="100" fill="#666"/>
                  <text x="100" y="120" text-anchor="middle" font-family="Arial" font-size="80" font-weight="bold" fill="white">
                    ${item.name.charAt(0)}
                  </text>
                </svg>`
              )}`;
            }}
          />
          {/* 头像光晕 */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/30" />
        </div>

        {/* 名字 */}
        <h3 
          className="text-2xl md:text-3xl font-bold mb-3 text-center drop-shadow-sm"
          style={{ color: cardStyle.textColor }}
        >
          {item.name}
        </h3>

        {/* 金额 */}
        <p 
          className="text-xl md:text-2xl font-semibold text-center drop-shadow-sm"
          style={{ color: cardStyle.textColor }}
        >
          {countValue.toLocaleString()}
        </p>

        {/* 排名标识 - 右上角 */}
        <div className="absolute top-6 right-6">
          <div 
            className="w-16 h-16 rounded-full backdrop-blur-sm flex items-center justify-center border-2 border-white/40"
            style={{ background: cardStyle.rankBg }}
          >
            <span 
              className="text-2xl font-bold drop-shadow-lg"
              style={{ color: cardStyle.textColor }}
            >
              #{item.rank}
            </span>
          </div>
        </div>

        {/* 底部装饰线 */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-b-2xl" />
      </div>
    </div>
  );
};

export default ProfileCard;