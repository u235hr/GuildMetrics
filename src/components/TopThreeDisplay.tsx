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
    // 奥运颁奖台风格 - 阶梯状高度，中间最高，庄重大气
    if (rank === 1) return 'h-48'; // 金牌 - 最高（192px）
    if (rank === 2) return 'h-36'; // 银牌 - 中等高度（144px）
    if (rank === 3) return 'h-28'; // 铜牌 - 最低（112px）
    return 'h-28';
  };

  // 高级真实金属反射效果 - 拉丝纹理 + 多层渐变 + 细微光带
  const createRealMetalSVG = (width: number, height: number, rank: number) => {
    // 更克制的金银铜色系（降低饱和度与对比）
    const baseColors = {
      1: ["#E6C200", "#CCAC00", "#8C6E00"],   // 金色（柔和）
      2: ["#EAEAEA", "#C8C8C8", "#9C9C9C"],   // 银色（柔和）
      3: ["#C88A5D", "#A86D3B", "#6F471F"],   // 铜色（柔和）
    };

    const [c1, c2, c3] = baseColors[rank as keyof typeof baseColors] || baseColors[1];
    const id = `realMetal${rank}`;

    const svgContent = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- 金属主渐变 - 斜向更自然 -->
          <linearGradient id="${id}Base" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${c1}" />
            <stop offset="40%" stop-color="${c2}" />
            <stop offset="100%" stop-color="${c3}" />
          </linearGradient>

          <!-- 拉丝纹理 - 横向细纹 -->
          <filter id="${id}Brush" x="0%" y="0%" width="100%" height="100%">
            <!-- 更细腻的磨砂拉丝纹理 -->
            <feTurbulence type="fractalNoise" baseFrequency="0.7 0.025" numOctaves="2" result="noise" seed="9"/>
            <feGaussianBlur in="noise" stdDeviation="0.45" result="softNoise"/>
            <feDisplacementMap in="SourceGraphic" in2="softNoise" scale="0.5"/>
            <feComposite operator="over" in2="SourceGraphic"/>
          </filter>

          <!-- 定向打光 - 顶左主光（柔和） -->
          <linearGradient id="${id}KeyLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.32)" />
            <stop offset="28%" stop-color="rgba(255,255,255,0.14)" />
            <stop offset="55%" stop-color="rgba(255,255,255,0.02)" />
            <stop offset="100%" stop-color="rgba(0,0,0,0)" />
          </linearGradient>

          <!-- 底右辅光（极弱） -->
          <linearGradient id="${id}FillLight" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.12)" />
            <stop offset="45%" stop-color="rgba(255,255,255,0.04)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0)" />
          </linearGradient>

          <!-- 顶沿高光（更易察觉的打光带） -->
          <linearGradient id="${id}TopEdge" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.5)" />
            <stop offset="6%" stop-color="rgba(255,255,255,0.18)" />
            <stop offset="12%" stop-color="rgba(255,255,255,0.02)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0)" />
          </linearGradient>

          <!-- 左右边缘细高光 -->
          <linearGradient id="${id}LeftRim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.22)" />
            <stop offset="8%" stop-color="rgba(255,255,255,0.06)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0)" />
          </linearGradient>
          <linearGradient id="${id}RightRim" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.22)" />
            <stop offset="8%" stop-color="rgba(255,255,255,0.06)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0)" />
          </linearGradient>

          <!-- 环境反射层 - 冷暖混合 -->
          <linearGradient id="${id}Env" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.12)" />
            <stop offset="30%" stop-color="rgba(255,255,255,0.05)" />
            <stop offset="50%" stop-color="rgba(0,0,0,0)" />
            <stop offset="70%" stop-color="rgba(255,255,255,0.04)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0.1)" />
          </linearGradient>

          <!-- 垂直渐变 - 增加层次 -->
          <linearGradient id="${id}Vertical" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.22)" />
            <stop offset="55%" stop-color="rgba(255,255,255,0)" />
            <stop offset="100%" stop-color="rgba(0,0,0,0.22)" />
          </linearGradient>

          <!-- 暗角 -->
          <radialGradient id="${id}Vignette" cx="50%" cy="50%" r="75%">
            <stop offset="70%" stop-color="rgba(0,0,0,0)" />
            <stop offset="100%" stop-color="rgba(0,0,0,0.15)" />
          </radialGradient>

          <!-- 真实阴影 -->
          <filter id="${id}Shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="0" dy="3" result="offsetblur"/>
            <feFlood flood-color="rgba(0,0,0,0.25)"/>
            <feComposite in2="offsetblur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <!-- 主金属底 -->
        <rect x="0" y="0" width="${width}" height="${height}"
              fill="url(#${id}Base)" rx="16" ry="16"
              filter="url(#${id}Shadow)"/>

        <!-- 垂直渐变层 -->
        <rect x="0" y="0" width="${width}" height="${height}"
              fill="url(#${id}Vertical)" rx="16" ry="16"
              opacity="0.5"/>

        <!-- 环境反射层 -->
        <rect x="0" y="0" width="${width}" height="${height}"
              fill="url(#${id}Env)" rx="16" ry="16"/>

        <!-- 拉丝纹理（弱化） -->
        <rect x="0" y="0" width="${width}" height="${height}"
              fill="url(#${id}Base)" rx="16" ry="16"
              filter="url(#${id}Brush)"
              opacity="0.6"/>

        <!-- 顶沿高光 -->
        <rect x="0" y="0" width="${width}" height="${height}"
              fill="url(#${id}TopEdge)" rx="16" ry="16"/>

        <!-- 左右边缘高光 -->
        <rect x="0" y="0" width="${width}" height="${height}"
              fill="url(#${id}LeftRim)" rx="16" ry="16"/>
        <rect x="0" y="0" width="${width}" height="${height}"
              fill="url(#${id}RightRim)" rx="16" ry="16"/>

        <!-- 顶左主光 -->
        <rect x="0" y="0" width="${width}" height="${height}"
              fill="url(#${id}KeyLight)" rx="16" ry="16"/>

        <!-- 底右辅光 -->
        <rect x="0" y="0" width="${width}" height="${height}"
              fill="url(#${id}FillLight)" rx="16" ry="16"/>

        <!-- 暗角 -->
        <rect x="0" y="0" width="${width}" height="${height}"
              fill="url(#${id}Vignette)" rx="16" ry="16"/>

        <!-- 移除闪点 -->
      </svg>
    `;

    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  };

  const getBarWidth = (rank: number) => {
    // 统一所有柱子宽度，保持视觉一致性
    return 'w-64'; // 统一宽度 - 256px
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  const getMedalStyle = (rank: number) => {
    // 金>银>铜，再放大一档
    if (rank === 1) return { fontSize: '3.2rem' };
    if (rank === 2) return { fontSize: '2.6rem' };
    if (rank === 3) return { fontSize: '2.2rem' };
    return { fontSize: '2.2rem' };
  };

  const getRibbonStyle = (rank: number) => {
    // 典礼感的绶带颜色（与金属形成对比）：金-皇家蓝，银-深红，铜-深紫
    const base = {
      width: '0.55rem',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.35)',
    } as React.CSSProperties;
    if (rank === 1) return { ...base, background: 'linear-gradient(180deg,#3B82F6,#1E40AF)' };
    if (rank === 2) return { ...base, background: 'linear-gradient(180deg,#EF4444,#7F1D1D)' };
    if (rank === 3) return { ...base, background: 'linear-gradient(180deg,#8B5CF6,#4C1D95)' };
    return { ...base, background: 'linear-gradient(180deg,#6B7280,#111827)' };
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
            
                          {/* 柱状图主体 - 烘焙金属质感 */}
              <div 
                className={`${getBarWidth(item.rank)} ${getBarHeight(item.rank)} relative overflow-hidden animate-growFromBottom`}
                style={{ 
                  animationDelay: `${getBarAnimationDelay(index)}s`,
                  animationFillMode: 'both',
                  backgroundImage: `url("${createRealMetalSVG(256, item.rank === 1 ? 192 : item.rank === 2 ? 144 : 112, item.rank)}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '12px'
                }}
              >
              {/* 固定在柱子左上角的奖牌 */}
              <div className="absolute z-30" style={{ top: '1.65rem', left: '0.8rem' }}>
                <span className="drop-shadow-[0_3px_6px_rgba(0,0,0,0.8)]" style={getMedalStyle(item.rank)}>
                  {getMedalEmoji(item.rank)}
                </span>
              </div>
              {/* 金属质感已包含内置高光效果 */}

                {/* 名字 - 在柱子剩余空间的水平中心，固定宽度确保一致性 */}
                <div 
                  className="absolute inset-x-0 z-10 animate-fadeInUp flex justify-center items-center"
                  style={{ 
                    animationDelay: `${getBarAnimationDelay(index) + 1.0}s`,
                    animationFillMode: 'both',
                    // 名字占据从顶部到数字位置之间的空间的中心
                    top: '0',
                    // 根据新的柱子高度调整名字位置，让名字在各自柱子的可用空间中居中
                    bottom: item.rank === 1 ? '3.5rem' : item.rank === 2 ? '3rem' : '2.5rem'
                  }}
                >
                  <p className={`text-white ${getNameSize(item.rank).className} font-bold drop-shadow-lg text-center`}
                     style={{ 
                       whiteSpace: 'nowrap',
                       overflow: 'hidden',
                       textOverflow: 'ellipsis',
                       fontSize: getNameSize(item.rank).fontSize,
                       textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)'
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
                  <p className="text-white font-bold text-lg drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)' }}>
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

                {/* 左上角金银铜牌 - 提示名次并增强金属感 */}
                {/* 左上角奖牌（不被裁剪）：放置在柱子容器外层的绝对层 */}
            </div>
            
                          {/* 移除底座，保持简洁设计 */}
          </div>
        ))}
      </div>

      {/* 背景装饰 */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent rounded-full"></div>
    </div>
  );
}
