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
  // 重新排列数据：银(2) 金(1) 铜(3)
  const sortedData = [
    data.find(item => item.rank === 2), // 银在左边
    data.find(item => item.rank === 1), // 金在中间
    data.find(item => item.rank === 3)  // 铜在右边
  ].filter(Boolean) as RankItem[];

  const getBarHeight = (rank: number) => {
    // 缩小高度，为头像和礼物值留出更多空间
    if (rank === 1) return 'h-24'; // 最高
    if (rank === 2) return 'h-20'; // 第二
    if (rank === 3) return 'h-16'; // 第三
    return 'h-16';
  };

  const getBarColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-t from-yellow-600 to-yellow-400';
    if (rank === 2) return 'bg-gradient-to-t from-gray-600 to-gray-400';
    if (rank === 3) return 'bg-gradient-to-t from-orange-600 to-orange-400';
    return 'bg-gray-500';
  };

  const getBarWidth = (rank: number) => {
    if (rank === 1) return 'w-48'; // 缩小宽度
    if (rank === 2) return 'w-44'; // 第二
    if (rank === 3) return 'w-40'; // 第三
    return 'w-40';
  };

  const getRankText = (rank: number) => {
    if (rank === 1) return '冠军';
    if (rank === 2) return '亚军';
    if (rank === 3) return '季军';
    return '';
  };

  // 动画延迟：金牌(0ms)  银牌(500ms)  铜牌(1000ms)
  const getBarAnimationDelay = (index: number) => {
    if (index === 1) return '0ms'; // 金牌最先
    if (index === 0) return '500ms'; // 银牌第二
    if (index === 2) return '1000ms'; // 铜牌最后
    return '0ms';
  };

  // 头像和礼物值动画延迟：柱子升到顶后开始
  const getContentAnimationDelay = (index: number) => {
    if (index === 1) return '1500ms'; // 金牌柱子升完后
    if (index === 0) return '2000ms'; // 银牌柱子升完后
    if (index === 2) return '2500ms'; // 铜牌柱子升完后
    return '1500ms';
  };

  return (
    <div data-testid="top-three" className="h-full flex flex-col justify-center items-center text-base relative p-4">
      {/* 头像行 */}
      <div className="flex justify-center items-end gap-8 mb-4">
        {sortedData.map((item, index) => (
          <div 
            key={`avatar-${item.rank}`}
            className="flex flex-col items-center"
            style={{ 
              animationDelay: getContentAnimationDelay(index),
              animationFillMode: 'both'
            }}
          >
            <Image
              src={item.avatar}
              alt={item.name}
              width={48} 
              height={48}
              className="w-12 h-12 rounded-full border-2 border-white/50 object-cover shadow-xl animate-fadeInUp"
              onError={(e) => { e.currentTarget.src = '/globe.svg'; }}
            />
          </div>
        ))}
      </div>

      {/* 柱状图行 */}
      <div className="flex justify-center items-end gap-8 mb-4">
        {sortedData.map((item, index) => (
          <div key={`bar-${item.rank}`} className="relative flex flex-col items-center">
            {/* 柱状图主体 */}
            <div 
              className={`${getBarWidth(item.rank)} ${getBarHeight(item.rank)} ${getBarColor(item.rank)} rounded-t-lg shadow-xl border-2 border-white/30 relative overflow-hidden`}
              style={{ 
                animationDelay: getBarAnimationDelay(index),
                animationFillMode: 'both'
              }}
            >
              {/* 柱状图高光效果 */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-t-lg"></div>
              
              {/* 名字固定在柱子正中央 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white font-bold text-sm drop-shadow-lg text-center px-1">
                  {item.name}
                </div>
              </div>

              {/* 只有冠军有特殊标签 */}
              {item.rank === 1 && (
                <div className="absolute top-1 left-1 bg-yellow-500 text-white text-xs font-bold px-1 py-0.5 rounded-full shadow-lg">
                  {getRankText(item.rank)}
                </div>
              )}
            </div>

            {/* 柱状图底座 */}
            <div className={`${getBarWidth(item.rank)} h-1 bg-gradient-to-r from-gray-700 to-gray-600 rounded-b-lg shadow-lg`}></div>
          </div>
        ))}
      </div>

      {/* 礼物值行 */}
      <div className="flex justify-center items-center gap-8">
        {sortedData.map((item, index) => (
          <div 
            key={`gift-${item.rank}`}
            className="w-32 bg-black/80 backdrop-blur-sm rounded-lg p-2 shadow-xl border border-white/20 text-center animate-fadeInUp"
            style={{ 
              animationDelay: getContentAnimationDelay(index),
              animationFillMode: 'both'
            }}
          >
            <p className="text-yellow-400 font-bold text-sm">
              <CountUp 
                end={item.amount} 
                duration={2.5} 
                separator="," 
                prefix="" 
                start={0}
                enableScrollSpy={false}
              />
            </p>
            <p className="text-white/70 text-xs mt-1">{getRankText(item.rank)}</p>
          </div>
        ))}
      </div>

      {/* 背景装饰 */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent rounded-full"></div>
      
      {/* 聚光灯效果 */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-gradient-to-b from-yellow-400/10 via-transparent to-transparent rounded-full blur-xl"></div>
    </div>
  );
}
