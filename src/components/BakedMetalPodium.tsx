'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import CountUp from 'react-countup';

interface PodiumData {
  rank: number;
  name: string;
  amount: number;
  avatar: string;
}

interface BakedMetalPodiumProps {
  data: PodiumData[];
}

export default function BakedMetalPodium({ data }: BakedMetalPodiumProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full flex items-center justify-center">
      <div className="text-white/60">Loading...</div>
    </div>;
  }

  // 排列数据：银(左) 金(中) 铜(右)
  const orderedData = [
    data.find(item => item.rank === 2), // 银在左边
    data.find(item => item.rank === 1), // 金在中间
    data.find(item => item.rank === 3)  // 铜在右边
  ].filter(Boolean) as PodiumData[];

  // 烘焙的金属材质SVG
  const createBakedMetalSVG = (rank: number, width: number, height: number) => {
    let gradientId: string;
    let gradientStops: string;
    let shadowColor: string;

    switch (rank) {
      case 1: // 金色 - 烘焙金属效果
        gradientId = 'goldMetal';
        gradientStops = `
          <stop offset="0%" stop-color="#ffed4e" stop-opacity="1"/>
          <stop offset="15%" stop-color="#ffd700" stop-opacity="1"/>
          <stop offset="35%" stop-color="#ffcc00" stop-opacity="1"/>
          <stop offset="50%" stop-color="#e6b800" stop-opacity="1"/>
          <stop offset="65%" stop-color="#ffcc00" stop-opacity="1"/>
          <stop offset="85%" stop-color="#ffd700" stop-opacity="1"/>
          <stop offset="100%" stop-color="#b8860b" stop-opacity="1"/>
        `;
        shadowColor = 'rgba(255, 215, 0, 0.6)';
        break;
      case 2: // 银色 - 烘焙金属效果
        gradientId = 'silverMetal';
        gradientStops = `
          <stop offset="0%" stop-color="#f8f8ff" stop-opacity="1"/>
          <stop offset="15%" stop-color="#e8e8e8" stop-opacity="1"/>
          <stop offset="35%" stop-color="#d3d3d3" stop-opacity="1"/>
          <stop offset="50%" stop-color="#c0c0c0" stop-opacity="1"/>
          <stop offset="65%" stop-color="#d3d3d3" stop-opacity="1"/>
          <stop offset="85%" stop-color="#e8e8e8" stop-opacity="1"/>
          <stop offset="100%" stop-color="#a9a9a9" stop-opacity="1"/>
        `;
        shadowColor = 'rgba(192, 192, 192, 0.6)';
        break;
      case 3: // 铜色 - 烘焙金属效果
        gradientId = 'bronzeMetal';
        gradientStops = `
          <stop offset="0%" stop-color="#daa520" stop-opacity="1"/>
          <stop offset="15%" stop-color="#cd7f32" stop-opacity="1"/>
          <stop offset="35%" stop-color="#b8860b" stop-opacity="1"/>
          <stop offset="50%" stop-color="#8b4513" stop-opacity="1"/>
          <stop offset="65%" stop-color="#b8860b" stop-opacity="1"/>
          <stop offset="85%" stop-color="#cd7f32" stop-opacity="1"/>
          <stop offset="100%" stop-color="#654321" stop-opacity="1"/>
        `;
        shadowColor = 'rgba(205, 127, 50, 0.6)';
        break;
      default:
        gradientId = 'defaultMetal';
        gradientStops = `<stop offset="0%" stop-color="#888888"/><stop offset="100%" stop-color="#555555"/>`;
        shadowColor = 'rgba(136, 136, 136, 0.6)';
    }

    const svgContent = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- 烘焙的金属渐变 -->
          <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
            ${gradientStops}
          </linearGradient>
          
          <!-- 高光效果 -->
          <linearGradient id="${gradientId}Highlight" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.8)" stop-opacity="1"/>
            <stop offset="50%" stop-color="rgba(255,255,255,0.4)" stop-opacity="1"/>
            <stop offset="100%" stop-color="rgba(255,255,255,0.1)" stop-opacity="1"/>
          </linearGradient>
          
          <!-- 阴影滤镜 -->
          <filter id="${gradientId}Shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="${shadowColor}"/>
          </filter>
          
          <!-- 内阴影效果 -->
          <filter id="${gradientId}Inner" x="-50%" y="-50%" width="200%" height="200%">
            <feOffset dx="0" dy="2"/>
            <feGaussianBlur stdDeviation="3" result="offset-blur"/>
            <feFlood flood-color="rgba(0,0,0,0.3)"/>
            <feComposite in2="offset-blur" operator="in"/>
          </filter>
        </defs>
        
        <!-- 主体金属块 -->
        <rect x="0" y="0" width="${width}" height="${height}" 
              fill="url(#${gradientId})" 
              rx="12" ry="12"
              filter="url(#${gradientId}Shadow)"/>
        
        <!-- 高光层 -->
        <rect x="0" y="0" width="${width}" height="${height * 0.4}" 
              fill="url(#${gradientId}Highlight)" 
              rx="12" ry="12"
              opacity="0.7"/>
        
        <!-- 内阴影边缘 -->
        <rect x="2" y="2" width="${width - 4}" height="${height - 4}" 
              fill="none" 
              stroke="rgba(0,0,0,0.2)" 
              stroke-width="1"
              rx="10" ry="10"/>
      </svg>
    `;

    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  };

  const getBarHeight = (rank: number) => {
    if (rank === 1) return 'h-48'; // 金牌 - 最高
    if (rank === 2) return 'h-36'; // 银牌 - 中等
    if (rank === 3) return 'h-28'; // 铜牌 - 最低
    return 'h-28';
  };

  const getBarWidth = () => 'w-64'; // 统一宽度

  const getNameSize = (rank: number) => {
    if (rank === 1) return { className: 'text-xl', fontSize: '1.25rem' };
    if (rank === 2) return { className: 'text-lg', fontSize: '1.125rem' };
    if (rank === 3) return { className: 'text-lg', fontSize: '1rem' };
    return { className: 'text-lg', fontSize: '1rem' };
  };

  const getAvatarSize = (rank: number) => {
    if (rank === 1) return { size: 88, style: { width: '88px', height: '88px' } };
    if (rank === 2) return { size: 84, style: { width: '84px', height: '84px' } };
    if (rank === 3) return { size: 80, style: { width: '80px', height: '80px' } };
    return { size: 80, style: { width: '80px', height: '80px' } };
  };

  const getBarAnimationDelay = (index: number) => index * 0.5;
  const getContentAnimationDelay = (index: number) => index * 0.5 + 1.0;

  return (
    <div data-testid="baked-metal-podium" className="h-full flex flex-col items-center text-base relative p-4">
      <div className="flex-1 flex justify-center items-end gap-24 relative" style={{ marginTop: '-4rem' }}>
        {orderedData.map((item, index) => {
          const heightClass = getBarHeight(item.rank);
          const widthClass = getBarWidth();
          
          // 计算实际像素高度用于SVG生成
          const pixelHeight = item.rank === 1 ? 192 : item.rank === 2 ? 144 : 112;
          const pixelWidth = 256;

          return (
            <div key={`baked-column-${item.rank}`} className="relative flex flex-col items-center">
              {/* 头像 - 固定位置 */}
              <div 
                className="mb-2 animate-fadeInUp"
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
              
              {/* 烘焙金属柱状图 */}
              <div 
                className={`${widthClass} ${heightClass} relative overflow-hidden animate-growFromBottom`}
                style={{ 
                  animationDelay: `${getBarAnimationDelay(index)}s`,
                  animationFillMode: 'both',
                  backgroundImage: `url("${createBakedMetalSVG(item.rank, pixelWidth, pixelHeight)}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '12px'
                }}
              >
                {/* 名字 */}
                <div 
                  className="absolute inset-x-0 z-10 animate-fadeInUp flex justify-center items-center"
                  style={{ 
                    animationDelay: `${getBarAnimationDelay(index) + 1.0}s`,
                    animationFillMode: 'both',
                    top: '0',
                    bottom: item.rank === 1 ? '3.5rem' : item.rank === 2 ? '3rem' : '2.5rem'
                  }}
                >
                  <p className={`text-white/95 ${getNameSize(item.rank).className} font-bold drop-shadow-lg text-center`}
                     style={{ 
                       whiteSpace: 'nowrap',
                       overflow: 'hidden',
                       textOverflow: 'ellipsis',
                       fontSize: getNameSize(item.rank).fontSize,
                       textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                     }}>
                    {item.name}
                  </p>
                </div>

                {/* 礼物值数字 */}
                <div 
                  className="absolute left-0 right-0 flex justify-center items-center z-10 animate-fadeInUp"
                  style={{ 
                    animationDelay: `${getBarAnimationDelay(index) + 1.2}s`,
                    animationFillMode: 'both',
                    bottom: '0.25rem',
                    height: '2rem'
                  }}
                >
                  <p className="text-white font-bold text-lg drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
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

                {/* 冠军标签 */}
                {item.rank === 1 && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    冠军
                  </div>
                )}
              </div>
              
              {/* 底座 - 也使用烘焙效果 */}
              <div 
                className={`${widthClass} h-3`}
                style={{
                  backgroundImage: `url("${createBakedMetalSVG(item.rank, pixelWidth, 12)}")`,
                  backgroundSize: 'cover',
                  borderRadius: '0 0 8px 8px',
                  opacity: 0.9
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}


