'use client';

import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';

type RankItem = {
  rank: number;
  name: string;
  amount: number;
  avatar: string;
};

type ReactBitsProfileCardProps = {
  item: RankItem;
  index: number;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  showBehindGradient?: boolean;
};

const ReactBitsProfileCard = ({ 
  item, 
  index, 
  enableTilt = true, 
  enableMobileTilt = false,
  showBehindGradient = true 
}: ReactBitsProfileCardProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
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

  // 根据排名获取颜色和渐变
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          behindGradient: 'radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(60,100%,90%,var(--card-opacity)) 4%,hsla(60,50%,80%,calc(var(--card-opacity)*0.75)) 10%,hsla(60,25%,70%,calc(var(--card-opacity)*0.5)) 50%,hsla(60,0%,60%,0) 100%),radial-gradient(35% 52% at 55% 20%,#ffd700c4 0%,#ffb30000 100%),radial-gradient(100% 100% at 50% 50%,#ffd700ff 1%,#ffb30000 76%),conic-gradient(from 124deg at 50% 50%,#ffd700ff 0%,#ffb300ff 40%,#ffb300ff 60%,#ffd700ff 100%)',
          innerGradient: 'linear-gradient(145deg,#ffd7008c 0%,#ffb30044 100%)',
          textGradient: 'linear-gradient(to bottom, #fff, #ffd700)',
          titleGradient: 'linear-gradient(to bottom, #fff, #ffb300)'
        };
      case 2:
        return {
          behindGradient: 'radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(0,0%,90%,var(--card-opacity)) 4%,hsla(0,0%,80%,calc(var(--card-opacity)*0.75)) 10%,hsla(0,0%,70%,calc(var(--card-opacity)*0.5)) 50%,hsla(0,0%,60%,0) 100%),radial-gradient(35% 52% at 55% 20%,#c0c0c0c4 0%,#a0a0a000 100%),radial-gradient(100% 100% at 50% 50%,#c0c0c0ff 1%,#a0a0a000 76%),conic-gradient(from 124deg at 50% 50%,#c0c0c0ff 0%,#a0a0a0ff 40%,#a0a0a0ff 60%,#c0c0c0ff 100%)',
          innerGradient: 'linear-gradient(145deg,#c0c0c08c 0%,#a0a0a044 100%)',
          textGradient: 'linear-gradient(to bottom, #fff, #c0c0c0)',
          titleGradient: 'linear-gradient(to bottom, #fff, #a0a0a0)'
        };
      case 3:
        return {
          behindGradient: 'radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(30,100%,90%,var(--card-opacity)) 4%,hsla(30,50%,80%,calc(var(--card-opacity)*0.75)) 10%,hsla(30,25%,70%,calc(var(--card-opacity)*0.5)) 50%,hsla(30,0%,60%,0) 100%),radial-gradient(35% 52% at 55% 20%,#cd7f32c4 0%,#8b451300 100%),radial-gradient(100% 100% at 50% 50%,#cd7f32ff 1%,#8b451300 76%),conic-gradient(from 124deg at 50% 50%,#cd7f32ff 0%,#8b4513ff 40%,#8b4513ff 60%,#cd7f32ff 100%)',
          innerGradient: 'linear-gradient(145deg,#cd7f328c 0%,#8b451344 100%)',
          textGradient: 'linear-gradient(to bottom, #fff, #cd7f32)',
          titleGradient: 'linear-gradient(to bottom, #fff, #8b4513)'
        };
      default:
        return {
          behindGradient: 'radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(220,100%,90%,var(--card-opacity)) 4%,hsla(220,50%,80%,calc(var(--card-opacity)*0.75)) 10%,hsla(220,25%,70%,calc(var(--card-opacity)*0.5)) 50%,hsla(220,0%,60%,0) 100%),radial-gradient(35% 52% at 55% 20%,#4a90e2c4 0%,#2c5aa000 100%),radial-gradient(100% 100% at 50% 50%,#4a90e2ff 1%,#2c5aa000 76%),conic-gradient(from 124deg at 50% 50%,#4a90e2ff 0%,#2c5aa0ff 40%,#2c5aa0ff 60%,#4a90e2ff 100%)',
          innerGradient: 'linear-gradient(145deg,#4a90e28c 0%,#2c5aa044 100%)',
          textGradient: 'linear-gradient(to bottom, #fff, #4a90e2)',
          titleGradient: 'linear-gradient(to bottom, #fff, #2c5aa0)'
        };
    }
  };

  const rankStyle = getRankStyle(item.rank);

  // 3D倾斜效果处理
  const animationHandlers = useMemo(() => {
    if (!enableTilt) return null;

    let rafId: number | null = null;

    const updateCardTransform = (offsetX: number, offsetY: number, card: HTMLElement, wrap: HTMLElement) => {
      const width = card.clientWidth;
      const height = card.clientHeight;

      const percentX = Math.min(Math.max((100 / width) * offsetX, 0), 100);
      const percentY = Math.min(Math.max((100 / height) * offsetY, 0), 100);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties = {
        '--pointer-x': `${percentX}%`,
        '--pointer-y': `${percentY}%`,
        '--background-x': `${Math.min(Math.max(percentX * 0.3 + 35, 35), 65)}%`,
        '--background-y': `${Math.min(Math.max(percentY * 0.3 + 35, 35), 65)}%`,
        '--pointer-from-center': `${Math.min(Math.hypot(percentY - 50, percentX - 50) / 50, 1)}`,
        '--pointer-from-top': `${percentY / 100}`,
        '--pointer-from-left': `${percentX / 100}`,
        '--rotate-x': `${Math.max(Math.min(-(centerX / 5), 15), -15)}deg`,
        '--rotate-y': `${Math.max(Math.min(centerY / 4, 15), -15)}deg`
      };

      Object.entries(properties).forEach(([property, value]) => {
        wrap.style.setProperty(property, value);
      });
    };

    const createSmoothAnimation = (duration: number, startX: number, startY: number, card: HTMLElement, wrap: HTMLElement) => {
      const startTime = performance.now();
      const targetX = wrap.clientWidth / 2;
      const targetY = wrap.clientHeight / 2;

      const animationLoop = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const currentX = startX + (targetX - startX) * easedProgress;
        const currentY = startY + (targetY - startY) * easedProgress;

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
  }, [enableTilt]);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap || !animationHandlers) return;

    const rect = card.getBoundingClientRect();
    animationHandlers.updateCardTransform(event.clientX - rect.left, event.clientY - rect.top, card, wrap);
  }, [animationHandlers]);

  const handlePointerEnter = useCallback(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap || !animationHandlers) return;

    animationHandlers.cancelAnimation();
    wrap.classList.add('active');
    card.classList.add('active');
  }, [animationHandlers]);

  const handlePointerLeave = useCallback((event: React.PointerEvent) => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap || !animationHandlers) return;

    animationHandlers.createSmoothAnimation(600, event.nativeEvent.offsetX, event.nativeEvent.offsetY, card, wrap);
    wrap.classList.remove('active');
    card.classList.remove('active');
  }, [animationHandlers]);

  const cardStyle = useMemo(() => ({
    '--behind-gradient': showBehindGradient ? rankStyle.behindGradient : 'none',
    '--inner-gradient': rankStyle.innerGradient,
    '--text-gradient': rankStyle.textGradient,
    '--title-gradient': rankStyle.titleGradient
  }), [rankStyle, showBehindGradient]);

  return (
    <div 
      ref={wrapRef} 
      className="pc-card-wrapper" 
      style={cardStyle}
    >
      <section 
        ref={cardRef} 
        className="pc-card"
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <div className="pc-inside">
          <div className="pc-shine" />
          <div className="pc-glare" />
          <div className="pc-content pc-avatar-content">
            <img
              className="avatar"
              src={item.avatar}
              alt={`${item.name} avatar`}
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        </div>
        
        <div className="pc-content">
          <div className="pc-details">
            <h3 style={{ backgroundImage: rankStyle.titleGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {item.name}
            </h3>
            <p style={{ backgroundImage: rankStyle.textGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {countValue.toLocaleString()}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReactBitsProfileCard;