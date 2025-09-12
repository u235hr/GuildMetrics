// app/components/GoldProfileCard.tsx
'use client';
import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import './GoldProfileCard.css';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

// 完全复制原始模板的Props接口
interface GoldProfileCardProps {
  avatarUrl: string;
  iconUrl?: string;
  grainUrl?: string;
  behindGradient?: string;
  innerGradient?: string;
  showBehindGradient?: boolean;
  className?: string;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  mobileTiltSensitivity?: number;
  miniAvatarUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  onContactClick?: () => void;
}

// 完全复制原始模板的默认值

// 默认背景渐变
// 代码实现原理：
// 1. 使用radial-gradient和conic-gradient创建一个复杂的渐变背景
// 2. 使用radial-gradient创建一个内层渐变，用于模拟光晕效果
// 3. 使用radial-gradient创建一个外层渐变，用于模拟光晕效果
// 4. 使用conic-gradient创建一个内层渐变，用于模拟光晕效果
// 5. 使用conic-gradient创建一个外层渐变，用于模拟光晕效果
// 6. 使用radial-gradient创建一个内层渐变，用于模拟光晕效果
const DEFAULT_BEHIND_GRADIENT =
  'radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(266,100%,90%,var(--card-opacity)) 4%,hsla(266,50%,80%,calc(var(--card-opacity)*0.75)) 10%,hsla(266,25%,70%,calc(var(--card-opacity)*0.5)) 50%,hsla(266,0%,60%,0) 100%),radial-gradient(35% 52% at 55% 20%,#00ffaac4 0%,#073aff00 100%),radial-gradient(100% 100% at 50% 50%,#00c1ffff 1%,#073aff00 76%),conic-gradient(from 124deg at 50% 50%,#c137ffff 0%,#07c6ffff 40%,#07c6ffff 60%,#c137ffff 100%)';


// 动画配置常量
const ANIMATION_CONFIG = {
  SMOOTH_DURATION: 600,//平滑动画持续时间
  INITIAL_DURATION: 1500,//初始动画持续时间
  INITIAL_X_OFFSET: 70,//初始X偏移量
  INITIAL_Y_OFFSET: 60,//初始Y偏移量
  DEVICE_BETA_OFFSET: 20//设备偏移量
} as const;

// 工具函数
// 一个辅助函数，确保一个值被限制在最小值和最大值之间
const clamp = (value: number, min = 0, max = 100): number => Math.min(Math.max(value, min), max);
const round = (value: number, precision = 3): number => parseFloat(value.toFixed(precision));
const adjust = (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));
const easeInOutCubic = (x: number): number => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

const ProfileCardComponent: React.FC<GoldProfileCardProps> = ({
  avatarUrl = '<Placeholder for avatar URL>',
  iconUrl = '<Placeholder for icon URL>',
  grainUrl = '<Placeholder for grain URL>',
  behindGradient,
  innerGradient,
  showBehindGradient = true,
  className = '',
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  miniAvatarUrl,
  name = 'Javi A. Torres',
  title = 'Software Engineer',
  handle = 'javicodes',
  status = 'Online',
  contactText = 'Contact',
  showUserInfo = true,
  onContactClick
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // 使用全局性能监控
  const { updateWiggle } = usePerformanceMonitor();

  const animationHandlers = useMemo(() => {
    if (!enableTilt) return null;

    let rafId: number | null = null;

    const updateCardTransform = (offsetX: number, offsetY: number, card: HTMLElement, wrap: HTMLElement) => {
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

    const createSmoothAnimation = (
      duration: number,
      startX: number,
      startY: number,
      card: HTMLElement,
      wrap: HTMLElement
    ) => {
      const startTime = performance.now();
      const targetX = wrap.clientWidth / 2;
      const targetY = wrap.clientHeight / 2;

      const animationLoop = (currentTime: number) => {
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
  }, [enableTilt]);

  // ========== 3D wiggle动画管理 ==========
  const wiggleAnimationRef = useRef<number | null>(null);

  const startWiggleAnimation = useCallback(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;

    if (!card || !wrap) return;

    // 停止之前的动画，避免重复启动
    if (wiggleAnimationRef.current) {
      cancelAnimationFrame(wiggleAnimationRef.current);
    }

    const animate = () => {
// ========== 3D wiggle效果 - 使用噪声函数替代随机值 ==========
const time = Date.now() * 0.001;

// 基于时间的平滑噪声，避免突然变化
const noiseX = Math.sin(time * 0.7) * 0.8 + Math.sin(time * 1.3) * 0.4;
const noiseY = Math.cos(time * 0.9) * 0.6 + Math.cos(time * 1.1) * 0.3;

// 计算X轴的wiggle角度，叠加多个正弦波和噪声
const wiggleX = Math.sin(time) * 3 +  //乘以4作为标准正弦波的幅度,一般修改此参数来调整X轴摆动幅度
               Math.sin(time * 1.7) * 1.5 + 
               Math.sin(time * 0.3) * 0.8 + 
               noiseX;

// 计算Y轴的wiggle角度，叠加多个余弦波和噪声
const wiggleY = Math.cos(time * 0.8) * 3 +  //乘以3作为标准余弦波的幅度,一般修改此参数来调整Y轴摆动幅度
               Math.cos(time * 1.3) * 1.2 + 
               Math.cos(time * 0.5) * 0.6 + 
               noiseY;

// 更新全局性能监控的wiggle数据
updateWiggle(wiggleX, wiggleY);

      // 应用3D变换
      card.style.transform = `perspective(1000px) rotateX(${wiggleX}deg) rotateY(${wiggleY}deg)`;

      // 虚拟鼠标位置计算
      const rect = card.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const offsetX = centerX - wiggleY * 10;
      const offsetY = centerY + wiggleX * 10;

      const percentX = (offsetX / rect.width) * 100;
      const percentY = (offsetY / rect.height) * 100;
      
      // 更新CSS变量
      wrap.style.setProperty('--pointer-x', `${percentX}%`);
      wrap.style.setProperty('--pointer-y', `${percentY}%`);
      wrap.style.setProperty('--background-x', `${adjust(percentX, 0, 100, 35, 65)}%`);
      wrap.style.setProperty('--background-y', `${adjust(percentY, 0, 100, 35, 65)}%`);
      
      // 继续下一帧
      wiggleAnimationRef.current = requestAnimationFrame(animate);
    };

    // 启动动画循环
    wiggleAnimationRef.current = requestAnimationFrame(animate);
  }, [updateWiggle]);

  const stopWiggleAnimation = useCallback(() => {
    if (wiggleAnimationRef.current) {
      cancelAnimationFrame(wiggleAnimationRef.current);
      wiggleAnimationRef.current = null;
    }
  }, []);

  // ========== 简化的useEffect ==========
  useEffect(() => {
    console.log('🎮 GoldProfileCard 组件已挂载，启动性能监控');
    // 启动wiggle动画
    startWiggleAnimation();
    
    // 组件卸载时停止动画
    return () => {
      console.log('🎮 GoldProfileCard 组件已卸载，停止性能监控');
      stopWiggleAnimation();
    };
  }, [startWiggleAnimation, stopWiggleAnimation]);

  const cardStyle = useMemo(
    () =>
      ({
        '--icon': iconUrl ? `url(${iconUrl})` : 'none',
        '--behind-gradient': showBehindGradient ? (behindGradient ?? DEFAULT_BEHIND_GRADIENT) : 'none',
        '--inner-gradient': innerGradient ?? 'none'
      }) as React.CSSProperties,
    [iconUrl, grainUrl, showBehindGradient, behindGradient, innerGradient]
  );

  const handleContactClick = useCallback(() => {
    onContactClick?.();
  }, [onContactClick]);

  return (
    <div ref={wrapRef} className={`pc-card-wrapper h-full ${className}`.trim()} style={cardStyle}>
      <section ref={cardRef} className="pc-card">
        <div className="pc-inside">
          <div className="pc-shine" />
          <div className="pc-glare" />
          <div className="pc-content pc-avatar-content">
            <img
              className="avatar"
              src={avatarUrl}
              alt={`${name || 'User'} avatar`}
              loading="lazy"
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            {showUserInfo && (
              <div className="pc-user-info">
                <div className="pc-user-details">
                  <div className="pc-mini-avatar">
                    <img
                      src={miniAvatarUrl || avatarUrl}
                      alt={`${name || 'User'} mini avatar`}
                      loading="lazy"
                      onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.style.opacity = '0.5';
                        target.src = avatarUrl;
                      }}
                    />
                  </div>
                  <div className="pc-user-text">
                    <div className="pc-handle">@{handle}</div>
                    <div className="pc-status">{status}</div>
                  </div>
                </div>
                <button
                  className="pc-contact-btn"
                  onClick={handleContactClick}
                  style={{ pointerEvents: 'auto' }}
                  type="button"
                  aria-label={`Contact ${name || 'user'}`}
                >
                  {contactText}
                </button>
              </div>
            )}
          </div>
          <div className="pc-content">
            <div className="pc-details">
              <h3>{name}</h3>
              <p>{title}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);

export default ProfileCard;