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
  cardSize?: string;
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

// Add proper TypeScript types to utility functions
const clamp = (value: number, min: number = 0, max: number = 100) => Math.min(Math.max(value, min), max);
const round = (value: number, precision: number = 3) => parseFloat(value.toFixed(precision));
const adjust = (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

const ReactBitsProfileCard = ({ item, index, cardSize }: ReactBitsProfileCardProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const getRankColors = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          gradient: 'linear-gradient(145deg,#FFD700 0%,#FFA500 100%)',
          medal: '',
          medalColor: 'text-yellow-500'
        };
      case 2:
        return {
          gradient: 'linear-gradient(145deg,#C0C0C0 0%,#A9A9A9 100%)',
          medal: '',
          medalColor: 'text-gray-500'
        };
      case 3:
        return {
          gradient: 'linear-gradient(145deg,#CD7F32 0%,#A0522D 100%)',
          medal: '',
          medalColor: 'text-amber-600'
        };
      default:
        return {
          gradient: 'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)',
          medal: '',
          medalColor: 'text-gray-500'
        };
    }
  };

  const colors = getRankColors(item.rank);

  const getCardSize = (rank: number) => {
    if (cardSize) return cardSize;
    // 固定宽度 + aspect-ratio: 4/5，避免因父容器尺寸导致塌陷
    switch (rank) {
      case 1:
        return 'w-[18rem] max-w-[80%] max-h-[80%]';
      case 2:
        return 'w-[18rem]';
      case 3:
        return 'w-[16rem]';
      default:
        return 'w-[16rem]';
    }
  };

  const getAnimationDelay = (index: number) => {
    // �ȴ�������Ⱦ���0.5�룬Ȼ��ʼ��Ƭ����
    // ����-����-ͭ�� ˳��ͭ�Ƶ�һ�������������
    const baseDelay = 0.5; // �ȴ�������Ⱦ���
    if (index === 0) return `${baseDelay + 0.4}s`;    // ���Ƶڶ�����ߣ�
    if (index === 1) return `${baseDelay + 0.8}s`;    // ��������м䣩
    if (index === 2) return `${baseDelay + 0.2}s`;    // ͭ�Ƶ�һ���ұߣ�
    return `${baseDelay + 0.2}s`;
  };

  const cardStyle = useMemo(() => ({
    '--behind-gradient': DEFAULT_BEHIND_GRADIENT,
    '--inner-gradient': colors.gradient
  }), [colors.gradient]);

  // 3D��бЧ������
  const animationHandlers = useMemo(() => {
    let rafId: number | null = null;

    const updateCardTransform = (offsetX: number, offsetY: number, card: HTMLElement, wrap: HTMLElement) => {
      const rect = wrap.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const deltaX = (offsetX - centerX) / centerX;
      const deltaY = (offsetY - centerY) / centerY;
      
      const rotateX = deltaY * -15;
      const rotateY = deltaX * 15;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    };

    const createSmoothAnimation = (duration: number, startX: number, startY: number, card: HTMLElement, wrap: HTMLElement) => {
      const startTime = performance.now();
      const rect = wrap.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const startDeltaX = (startX - centerX) / centerX;
      const startDeltaY = (startY - centerY) / centerY;
      const startRotateX = startDeltaY * -15;
      const startRotateY = startDeltaX * 15;
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const rotateX = startRotateX * (1 - easeOut);
        const rotateY = startRotateY * (1 - easeOut);
        const scale = 1 + (0.05 * (1 - easeOut));
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
        
        if (progress < 1) {
          rafId = requestAnimationFrame(animate);
        } else {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        }
      };
      
      rafId = requestAnimationFrame(animate);
    };

    return {
      updateCardTransform,
      createSmoothAnimation
    };
  }, []);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap || !animationHandlers) return;

    animationHandlers.updateCardTransform(event.nativeEvent.offsetX, event.nativeEvent.offsetY, card, wrap);
  }, [animationHandlers]);

  const handlePointerEnter = useCallback((event: React.PointerEvent) => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap || !animationHandlers) return;

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

  // ����ǽ��ƣ�ʹ�����Ⲽ��
  if (item.rank === 1) {
    return (
      <div className="relative inline-block">
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
            </div>
            
            {/* �������Ⲽ�� - ͷ��ռ�ϰ벿�ķ�֮�� */}
            <div className="pc-avatar-section">
              <div className="pc-avatar-container">
                <img
                  className="pc-avatar"
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

            {/* �������Ⲽ�� - ����ռ�°벿�ķ�֮һ */}
            <div className="pc-content-section">
              <h3 className="pc-name">{item.name}</h3>
              <p className="pc-amount">{item.amount.toLocaleString()}</p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // �������Ʊ���ԭ��Ч��
  return (
    <div className="relative inline-block">
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
            
            {/* ���� - ���Ͻ� */}
            <div className="absolute top-[0.5rem] right-[0.5rem] z-20">
              <div className={`text-[min(4vw,2rem)] drop-shadow-lg`}>
                {colors.medal}
              </div>
            </div>

            {/* ͷ������ */}
            <div className="pc-content pc-avatar-content">
              <img
                className="avatar"
                src={item.avatar}
                alt={`${item.name} avatar`}
                loading="lazy"
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>

            {/* �û���Ϣ */}
            <div className="pc-content">
              <div className="pc-details">
                <h3>{item.name}</h3>
                <p>{item.amount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReactBitsProfileCard;
