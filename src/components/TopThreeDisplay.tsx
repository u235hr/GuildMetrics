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
    // 增加高度，在横屏大空间中更有视觉冲击力
    if (rank === 1) return 'h-40'; // 金牌 - 更高
    if (rank === 2) return 'h-32'; // 银牌 - 较高
    if (rank === 3) return 'h-24'; // 铜牌 - 高
    return 'h-24';
  };

  const getBarColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-t from-yellow-600 to-yellow-400';
    if (rank === 2) return 'bg-gradient-to-t from-gray-600 to-gray-400';
    if (rank === 3) return 'bg-gradient-to-t from-orange-600 to-orange-400';
    return 'bg-gray-500';
  };

  const getBarWidth = (rank: number) => {
    // 统一所有柱子宽度，保持视觉一致性
    return 'w-64'; // 统一宽度 - 256px
  };

  const getRankText = (rank: number) => {
    if (rank === 1) return '冠军';
    if (rank === 2) return '亚军';
    if (rank === 3) return '季军';
    return '';
  };

  // 动画延迟：金牌(0s)  银牌(0.5s)  铜牌(1s)
  const getBarAnimationDelay = (index: number) => {
    if (index === 1) return 0; // 金牌最先
    if (index === 0) return 0.5; // 银牌第二
    if (index === 2) return 1; // 铜牌最后
    return 0;
  };

  // 头像和礼物值动画延迟：柱子升到顶后开始
  const getContentAnimationDelay = (index: number) => {
    if (index === 1) return 1.5; // 金牌柱子升完后
    if (index === 0) return 2; // 银牌柱子升完后
    if (index === 2) return 2.5; // 铜牌柱子升完后
    return 1.5;
  };

  // 头像离柱子顶端的固定距离（所有头像都一样）
  const getAvatarGap = () => {
    return 'mb-2'; // 统一的小间距，让头像贴近柱子顶端
  };

  // 根据排名计算头像大小
  const getAvatarSize = (rank: number) => {
    // 基础大小是80px
    if (rank === 1) return { size: 88, style: { width: '88px', height: '88px' } }; // 金牌 +10% (80*1.1=88px)
    if (rank === 2) return { size: 84, style: { width: '84px', height: '84px' } }; // 银牌 +5% (80*1.05=84px)
    if (rank === 3) return { size: 80, style: { width: '80px', height: '80px' } }; // 铜牌 不变 (80px)
    return { size: 80, style: { width: '80px', height: '80px' } };
  };

  // 根据排名计算名字大小
  const getNameSize = (rank: number) => {
    // 基础大小是text-lg (18px)
    if (rank === 1) return { className: 'text-xl', fontSize: '1.25rem' }; // 金牌 +10% (18*1.1≈20px)
    if (rank === 2) return { className: 'text-lg', fontSize: '1.125rem' }; // 银牌 +5% (18*1.05≈19px)  
    if (rank === 3) return { className: 'text-lg', fontSize: '1rem' }; // 铜牌 不变 (18px)
    return { className: 'text-lg', fontSize: '1rem' };
  };

  return (
    <div data-testid="top-three" className="h-full flex flex-col items-center text-base relative p-4">
      {/* 头像、名字、数字、柱子 - 垂直布局 */}
      <div className="flex-1 flex justify-center items-end gap-24 relative" style={{ marginTop: '-4rem' }}>
        {sortedData.map((item, index) => (
          <div key={`column-${item.rank}`} className="relative flex flex-col items-center">
            {/* 头像 - 固定位置，不参与生长动画 */}
            <div 
              className={`${getAvatarGap()} animate-fadeInUp`}
              style={{ 
                animationDelay: `${getContentAnimationDelay(index)}s`,
                animationFillMode: 'both'
              }}
            >
              <Image
                src={item.avatar}
                alt={item.name}
                width={getAvatarSize(item.rank).size} 
                height={getAvatarSize(item.rank).size}
                className="rounded-full border-2 border-white/50 object-cover shadow-xl"
                style={getAvatarSize(item.rank).style}
                onError={(e) => { e.currentTarget.src = '/globe.svg'; }}
              />
            </div>
            
            {/* 柱状图主体 - 只有柱子从下往上生长 */}
            <div 
              className={`${getBarWidth(item.rank)} ${getBarHeight(item.rank)} ${getBarColor(item.rank)} rounded-t-lg shadow-xl border-2 border-white/30 relative overflow-hidden animate-growFromBottom`}
              style={{ 
                animationDelay: `${getBarAnimationDelay(index)}s`,
                animationFillMode: 'both'
              }}
            >
              {/* 柱状图高光效果 */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-t-lg"></div>

                {/* 名字 - 在柱子剩余空间的水平中心，固定宽度确保一致性 */}
                <div 
                  className="absolute inset-x-0 z-10 animate-fadeInUp flex justify-center items-center"
                  style={{ 
                    animationDelay: `${getBarAnimationDelay(index) + 1.0}s`,
                    animationFillMode: 'both',
                    // 名字占据从顶部到数字位置之间的空间的中心
                    top: '0',
                    // 根据柱子高度调整名字位置，让名字在各自柱子的可用空间中居中
                    bottom: item.rank === 1 ? '2.75rem' : item.rank === 2 ? '2.5rem' : '2.25rem'
                  }}
                >
                  <p className={`text-white/90 ${getNameSize(item.rank).className} font-bold drop-shadow-lg text-center`}
                     style={{ 
                       whiteSpace: 'nowrap',
                       overflow: 'hidden',
                       textOverflow: 'ellipsis',
                       fontSize: getNameSize(item.rank).fontSize
                     }}>
                    {item.name}
                  </p>
                </div>

                {/* 礼物值数字 - 以金牌数字位置为基准，绝对定位对齐 */}
                <div 
                  className="absolute left-0 right-0 flex justify-center items-center z-10 animate-fadeInUp"
                  style={{ 
                    animationDelay: `${getBarAnimationDelay(index) + 1.2}s`,
                    animationFillMode: 'both',
                    // 所有数字都对齐到距离底部0.25rem的位置（再下移一点点）
                    bottom: '0.25rem',
                    height: '2rem'
                  }}
                >
                  <p className="text-yellow-400 font-bold text-lg drop-shadow-lg">
                    <CountUp 
                      end={item.amount} 
                      duration={1.5}
                      separator=","
                      start={0}
                      delay={getBarAnimationDelay(index) + 1.2}
                      enableScrollSpy={false}
                    />
                  </p>
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

      {/* 背景装饰 */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent rounded-full"></div>
    </div>
  );
}
