'use client';

import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import './ReactBitsProfileCard.css';

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

const DEFAULT_BEHIND_GRADIENT =
  'radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(266,100%,90%,var(--card-opacity)) 4%,hsla(266,50%,80%,calc(var(--card-opacity)*0.75)) 10%,hsla(266,25%,70%,calc(var(--card-opacity)*0.5)) 50%,hsla(266,0%,60%,0) 100%),radial-gradient(35% 52% at 55% 20%,#00ffaac4 0%,#073aff00 100%),radial-gradient(100% 100% at 50% 50%,#00c1ffff 1%,#073aff00 76%),conic-gradient(from 124deg at 50% 50%,#c137ffff 0%,#07c6ffff 40%,#07c6ffff 60%,#c137ffff 100%)';

const ANIMATION_CONFIG = {
  SMOOTH_DURATION: 600,
  INITIAL_DURATION: 1500,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20
};

const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);
const round = (value, precision = 3) => parseFloat(value.toFixed(precision));
const adjust = (value, fromMin, fromMax, toMin, toMax) =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));
const easeInOutCubic = x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

const ReactBitsProfileCard = ({ item, index }: ReactBitsProfileCardProps) => {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);

  const getRankColors = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          gradient: 'linear-gradient(145deg,#FFD700 0%,#FFA500 100%)',
          medal: '🥇',
          medalColor: 'text-yellow-500'
        };
      case 2:
        return {
          gradient: 'linear-gradient(145deg,#C0C0C0 0%,#A9A9A9 100%)',
          medal: '🥈',
          medalColor: 'text-gray-500'
        };
      case 3:
        return {
          gradient: 'linear-gradient(145deg,#CD7F32 0%,#A0522D 100%)',
          medal: '🥉',
          medalColor: 'text-amber-600'
        };
      default:
        return {
          gradient: 'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)',
          medal: '🏅',
          medalColor: 'text-gray-500'
        };
    }
  };

  const colors = getRankColors(item.rank);

  const getCardSize = (rank: number) => {
    // 使用响应式尺寸，适应屏幕，放大40%
    switch (rank) {
      case 1:
        return 'w-[min(28vw,17rem)] h-[min(35vh,21rem)]'; // 金牌 - 最大
      case 2:
        return 'w-[min(25vw,14rem)] h-[min(31vh,18rem)]'; // 银牌 - 次之
      case 3:
        return 'w-[min(22vw,11rem)] h-[min(28vh,15rem)]'; // 铜牌 - 最小
      default:
        return 'w-[min(22vw,11rem)] h-[min(28vh,15rem)]';
    }
  };

  const getAnimationDelay = (index: number) => {
    // 等待背景渲染完成0.5秒，然后开始卡片动画
    // 银牌-金牌-铜牌 顺序：铜牌第一个翻，金牌最后翻
    const baseDelay = 0.5; // 等待背景渲染完成
    if (index === 0) return `${baseDelay + 0.4}s`;    // 银牌第二（左边）
    if (index === 1) return `${baseDelay + 0.8}s`;    // 金牌最后（中间）
    if (index === 2) return `${baseDelay}s`;          // 铜牌第一（右边）
    return `${baseDelay}s`;
  };

  const animationHandlers = useMemo(() => {
    let rafId = null;

    const updateCardTransform = (offsetX, offsetY, card, wrap) => {
      const width = card.clientWidth;
      const height = card.clientHeight;

      const percentX = clamp((100 / width) * offsetX);
      const percentY = clamp((100 / height) * offsetY);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties = {
        '--pointer-x': `${percentX}%`,
        '--pointer-y': `${percentY}%`,
        '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
        '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        '--pointer-from-top': `${percentY / 100}`,
        '--pointer-from-left': `${percentX / 100}`,
        '--rotate-x': `${round(-(centerX / 5))}deg`,
        '--rotate-y': `${round(centerY / 4)}deg`
      };

      Object.entries(properties).forEach(([property, value]) => {
        wrap.style.setProperty(property, value);
      });
    };

    const createSmoothAnimation = (duration, startX, startY, card, wrap) => {
      const startTime = performance.now();
      const targetX = wrap.clientWidth / 2;
      const targetY = wrap.clientHeight / 2;

      const animationLoop = currentTime => {
        const elapsed = currentTime - startTime;
        const progress = clamp(elapsed / duration);
        const easedProgress = easeInOutCubic(progress);

        const currentX = adjust(easedProgress, 0, 1, startX, targetX);
        const currentY = adjust(easedProgress, 0, 1, startY, targetY);

        updateCardTransform(currentX, currentY, card, wrap);

        if (progress < 1) {
          rafId = requestAnimationFrame(animationLoop);
        }
      };

      rafId = requestAnimationFrame(animationLoop);
    };

    return {
      updateCardTransform,
      createSmoothAnimation,
      cancelAnimation: () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };
  }, []);

  // 数据大屏不需要任何鼠标交互
  const handlePointerMove = useCallback(() => {}, []);
  const handlePointerEnter = useCallback(() => {}, []);
  const handlePointerLeave = useCallback(() => {}, []);

  useEffect(() => {
    // 数据大屏不需要任何鼠标交互，完全禁用
    return () => {
      animationHandlers.cancelAnimation();
    };
  }, [animationHandlers]);

  const cardStyle = useMemo(
    () => ({
      '--behind-gradient': DEFAULT_BEHIND_GRADIENT,
      '--inner-gradient': colors.gradient
    }),
    [colors.gradient]
  );

  return (
    <div
      ref={wrapRef}
      className={`pc-card-wrapper ${getCardSize(item.rank)} transform-gpu animate-flipIn`}
      style={{
        animationDelay: getAnimationDelay(index),
        animationFillMode: 'both',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        ...cardStyle
      }}
    >
      <section ref={cardRef} className="pc-card">
        <div className="pc-inside">
          <div className="pc-shine" />
          <div className="pc-glare" />
          
          {/* 奖牌 - 右上角 */}
          <div className="absolute top-[0.5rem] right-[0.5rem] z-20">
            <div className={`text-[min(4vw,2rem)] drop-shadow-lg ${colors.medalColor}`}>
              {colors.medal}
            </div>
          </div>

          {/* 排名数字 - 左上角 */}
          <div className="absolute top-[0.5rem] left-[0.5rem] z-20">
            <div className="w-[min(3vw,2rem)] h-[min(3vw,2rem)] rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-bold text-[min(1.5vw,0.875rem)] drop-shadow-lg">#{item.rank}</span>
            </div>
          </div>

          {/* 头像内容 */}
          <div className="pc-content pc-avatar-content">
            <img
              className="avatar"
              src={item.avatar}
              alt={`${item.name} avatar`}
              loading="lazy"
              onError={e => {
                const target = e.target;
                target.style.display = 'none';
              }}
            />
          </div>

          {/* 用户信息 */}
          <div className="pc-content">
            <div className="pc-details">
              <h3>{item.name}</h3>
              <p>¥{item.amount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReactBitsProfileCard;
