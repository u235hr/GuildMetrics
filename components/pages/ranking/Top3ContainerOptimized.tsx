'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import TiltedGoldCard from './TiltedGoldCard';
import TiltedSilverCard from './TiltedSilverCard';
import TiltedBronzeCard from './TiltedBronzeCard';
import ElectricBorder from '../../ElectricBorder';
import { useAnimationManager } from '../../../hooks/useAnimationManager';

interface Top3ContainerOptimizedProps {
  data: {
    gold: { name: string; value: string; avatar: string };
    silver: { name: string; value: string; avatar: string };
    bronze: { name: string; value: string; avatar: string };
  };
}

export default function Top3ContainerOptimized({ data }: Top3ContainerOptimizedProps) {
  const [showSilver, setShowSilver] = useState(false);
  const [showBronze, setShowBronze] = useState(false);
  const [showGold, setShowGold] = useState(false);
  const [goldCanExpand, setGoldCanExpand] = useState(false);
  
  // 新增状态：银卡和铜卡的向上移动和礼物值显示
  const [silverMoveUp, setSilverMoveUp] = useState(false);
  const [bronzeMoveUp, setBronzeMoveUp] = useState(false);
  const [showSilverValue, setShowSilverValue] = useState(false);
  const [showBronzeValue, setShowBronzeValue] = useState(false);

  const { addAnimation, removeAnimation } = useAnimationManager();
  const animationStateRef = useRef({
    isMounted: true,
    currentStep: 0,
    startTime: 0,
  });
  
  // 定时器管理
  const timersRef = useRef<Set<NodeJS.Timeout>>(new Set());
  
  const safeSetTimeout = useCallback((callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      timersRef.current.delete(timer);
      callback();
    }, delay);
    
    timersRef.current.add(timer);
    return timer;
  }, []);
  
  // 清理所有定时器
  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  // 优化的动画序列管理
  const animationSteps = [
    { delay: 200, action: () => setShowSilver(true) },
    { delay: 500, action: () => setShowBronze(true) },
    { delay: 500, action: () => setShowGold(true) },
    { delay: 500, action: () => {
      setSilverMoveUp(true);
      setShowSilverValue(true);
      setBronzeMoveUp(true);
      setShowBronzeValue(true);
    }},
    { delay: 200, action: () => setGoldCanExpand(true) },
  ];

  // 统一的动画序列执行器
  const executeAnimationSequence = () => {
    if (!animationStateRef.current.isMounted) return;

    console.log('Starting optimized card sequence animation');
    
    // 重置所有状态
    setShowSilver(false);
    setShowBronze(false);
    setShowGold(false);
    setGoldCanExpand(false);
    setSilverMoveUp(false);
    setBronzeMoveUp(false);
    setShowSilverValue(false);
    setShowBronzeValue(false);

    animationStateRef.current.currentStep = 0;
    animationStateRef.current.startTime = performance.now();

    // 添加动画任务到统一管理器
    addAnimation(
      'card-sequence-animation',
      (timestamp) => {
        const { currentStep, startTime } = animationStateRef.current;
        const elapsed = timestamp - startTime;
        
        // 计算累积延迟
        let cumulativeDelay = 300; // 初始延迟
        for (let i = 0; i < currentStep; i++) {
          cumulativeDelay += animationSteps[i].delay;
        }

        // 检查是否到达当前步骤的执行时间
        if (elapsed >= cumulativeDelay && currentStep < animationSteps.length) {
          if (animationStateRef.current.isMounted) {
            animationSteps[currentStep].action();
            animationStateRef.current.currentStep++;
          }
        }

        // 检查是否完成所有步骤
        if (currentStep >= animationSteps.length) {
          console.log('Card sequence animation completed');
          return false; // 停止动画
        }

        return animationStateRef.current.isMounted; // 继续动画
      },
      {
        priority: 8, // 高优先级
        interval: 16, // 每帧检查
      }
    );
  };

  // 资源预加载优化
  const preloadResources = async (): Promise<boolean> => {
    try {
      const imagePromises = [
        data.gold.avatar,
        data.silver.avatar,
        data.bronze.avatar
      ].map(src => {
        return new Promise<boolean>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = src;
        });
      });

      const fontPromise = document.fonts.ready;
      const [goldLoaded, silverLoaded, bronzeLoaded] = await Promise.all([
        ...imagePromises,
        fontPromise
      ]);

      return Boolean(goldLoaded) && Boolean(silverLoaded) && Boolean(bronzeLoaded);
    } catch (error) {
      console.warn('Resource preload failed:', error);
      return true; // 继续执行，避免阻塞
    }
  };

  // 启动动画序列
  useEffect(() => {
    let mounted = true;
    animationStateRef.current.isMounted = true;

    const startAnimation = async () => {
      try {
        // 等待页面完全加载
        if (document.readyState !== 'complete') {
          await new Promise(resolve => {
            const handleLoad = () => {
              window.removeEventListener('load', handleLoad);
              resolve(void 0);
            };
            window.addEventListener('load', handleLoad);
          });
        }

        if (!mounted) return;

        // 预加载资源
        console.log('Starting resource preload...');
        const resourcesReady = await preloadResources();
        
        if (!resourcesReady) {
          console.warn('Some resources failed to load, but continuing animation');
        }

        if (!mounted) return;

        // 等待DOM稳定
        await new Promise(resolve => safeSetTimeout(() => resolve(undefined), 100));

        if (mounted) {
          executeAnimationSequence();
        }
      } catch (error) {
        console.error('Animation startup failed:', error);
      }
    };

    startAnimation();

    return () => {
      mounted = false;
      animationStateRef.current.isMounted = false;
      removeAnimation('card-sequence-animation');
    };
  }, [addAnimation, removeAnimation, data]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      
      {/* 主要内容 */}
      <div 
        className='h-full w-full flex justify-center items-start gap-[15%] pt-[4%] relative z-10'
        style={{ 
          overflow: 'visible',
          perspective: '1000px',
          transformStyle: 'preserve-3d',
          position: 'relative'
        }}
      >
      {/* 三个头像卡片 - 水平排列 */}
      <div className="flex justify-center items-center gap-[50%]" style={{ overflow: 'visible' }}>
        {/* 银牌卡片 */}
        <div style={{ 
          opacity: showSilver ? 1 : 0,
          transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: showSilver ? (silverMoveUp ? 'translateY(-3vh) scale(1)' : 'translateY(0vh) scale(1)') : 'translateY(4vh) scale(0.85)',
          filter: showSilver ? 'blur(0px)' : 'blur(2px)',
          position: 'relative'
        }}>
          <TiltedSilverCard
            imageSrc={data.silver.avatar || '/avatars/外国女人头像3_未抠图.jpg'}
            altText={data.silver.name || '银牌得主'}
            containerHeight="20vh"
            containerWidth="20vh"
            imageHeight="20vh"
            imageWidth="20vh"
            showMobileWarning={false}
            displayOverlayContent={true}
          overlayContent={
            <p style={{
              textTransform: 'capitalize',
              color: '#fff',
              letterSpacing: '-0.5px',
              background: '#0006',
              borderRadius: '1.5vh',
              margin: '1vh',
              padding: '0.5vh 1vh',
              fontFamily: 'AlibabaPuHuiTi-3-55-Regular',
              fontWeight: 900,
              fontSize: '2vh',
              boxShadow: '0 0.5vh 3vh #06001059',
              position: 'absolute',
              top: 0,
              left: 0,
              whiteSpace: 'nowrap',
              width: 'max-content',
              minWidth: 'fit-content'
            }}>
              {data.silver.name || '银牌得主'}
            </p>
          }
          />
          {/* 银卡礼物值 */}
          {showSilverValue && (
            <div 
              className="grades-box"
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: '1vh',
                height: 'calc(var(--card-width, 20vh) * 0.2)',
                width: 'calc(var(--card-width, 20vh) * 0.8)',
                background: 'linear-gradient(135deg, rgb(192, 192, 192), rgb(169, 169, 169))',
                color: 'rgb(255, 255, 255)',
                padding: '0.5vh 1vh',
                borderRadius: '0.5vh',
                fontSize: '1.5vh',
                fontFamily: 'AlibabaPuHuiTi-3-55-Regular',
                fontWeight: 'bold',
                boxShadow: 'rgba(0, 0, 0, 0.3) 0px 0.2vh 1vh',
                opacity: showSilverValue ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
                whiteSpace: 'nowrap',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg
                className="icon grades-icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: 'calc(var(--card-width, 9vh) * 0.03)',
                  width: 'calc(var(--card-width, 20vh) * 0.2)',
                  height: 'calc(var(--card-width, 20vh) * 0.2)'
                }}
              >
                <path
                  d="M382.6 805H242.2c-6.7 0-12.2-5.5-12.2-12.2V434.3c0-6.7 5.5-12.2 12.2-12.2h140.4c6.7 0 12.2 5.5 12.2 12.2v358.6c0 6.6-5.4 12.1-12.1 12.1z"
                  fill="#ea9518"
                ></path>
                <path
                  d="M591.1 805H450.7c-6.7 0-12.2-5.5-12.2-12.2V254.9c0-6.7 5.5-12.2 12.2-12.2h140.4c6.7 0 12.2 5.5 12.2 12.2v537.9c0 6.7-5.5 12.2-12.2 12.2z"
                  fill="#f2be45"
                ></path>
                <path
                  d="M804.4 805H663.9c-6.7 0-12.2-5.5-12.2-12.2v-281c0-6.7 5.5-12.2 12.2-12.2h140.4c6.7 0 12.2 5.5 12.2 12.2v281c0.1 6.7-5.4 12.2-12.1 12.2z"
                  fill="#ea9518"
                ></path>
              </svg>
              <p 
                className="silver-grades-box-num"
                style={{
                  fontSize: 'calc(var(--card-width, 20vh) * 0.10)',
                  fontFamily: 'AlibabaPuHuiTi-3-55-Regular',
                  marginLeft: 'calc(var(--card-width, 20vh) * 0.17)',
                  marginTop: 'calc(var(--card-width, 20vh) * 0.0)',
                  textAlign: 'center',
                  width: 'calc(var(--card-width, 20vh) * 0.6)',
                  height: 'calc(var(--card-width, 20vh) * 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {data.silver.value}
              </p>
            </div>
          )}
        </div>

        {/* 金牌卡片 - 包含展开式卡片 */}
        <div style={{ 
          opacity: showGold ? 1 : 0,
          transition: 'opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          transform: showGold ? 'translateY(0vh) scale(1.05)' : 'translateY(5vh) scale(0.75)',
          filter: showGold ? 'blur(0px) brightness(1.1)' : 'blur(3px) brightness(0.8)',
          overflow: 'visible',
          position: 'relative',
          zIndex: 10
        }}>
          <TiltedGoldCard
          imageSrc={data.gold.avatar || '/avatars/外国女人头像1_未抠图.jpeg'}
          altText={data.gold.name || '金牌得主'}
          containerHeight="20vh"
          containerWidth="20vh"
          imageHeight="20vh"
          imageWidth="20vh"
          showMobileWarning={false}
          displayOverlayContent={true}
          showExpandedCard={true}
          goldCanExpand={goldCanExpand}
          expandedCardData={{
            name: data.gold.name || '金牌得主',
            score: parseInt(data.gold.value.replace(/,/g, '')) || 0,
            rank: 1,
            avatar: data.gold.avatar || '/avatars/外国女人头像1_未抠图.jpeg'
          }}
          overlayContent={
            <p style={{
              textTransform: 'capitalize',
              color: '#fff',
              letterSpacing: '-0.5px',
              background: '#0006',
              borderRadius: '1.5vh',
              margin: '1vh',
              padding: '0.5vh 1vh',
              fontFamily: 'AlibabaPuHuiTi-3-55-Regular',
              fontWeight: 900,
              fontSize: '2vh',
              boxShadow: '0 0.5vh 3vh #06001059',
              position: 'absolute',
              top: 0,
              left: 0,
              whiteSpace: 'nowrap',
              width: 'max-content',
              minWidth: 'fit-content'
            }}>
              {data.gold.name || '金牌得主'}
            </p>
          }
          />
        </div>

        {/* 铜牌卡片 */}
        <div style={{ 
          opacity: showBronze ? 1 : 0,
          transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: showBronze ? (bronzeMoveUp ? 'translateY(-3vh) scale(1)' : 'translateY(0vh) scale(1)') : 'translateY(4vh) scale(0.85)',
          filter: showBronze ? 'blur(0px)' : 'blur(2px)',
          position: 'relative'
        }}>
          <TiltedBronzeCard
          imageSrc={data.bronze.avatar || '/avatars/外国女人头像2_未抠图.jpg'}
          altText={data.bronze.name || '铜牌得主'}
          containerHeight="20vh"
          containerWidth="20vh"
          imageHeight="20vh"
          imageWidth="20vh"
          showMobileWarning={false}
          displayOverlayContent={true}
          overlayContent={
            <p style={{
              textTransform: 'capitalize',
              color: '#fff',
              letterSpacing: '-0.5px',
              background: '#0006',
              borderRadius: '1.5vh',
              margin: '1vh',
              padding: '0.5vh 1vh',
              fontFamily: 'AlibabaPuHuiTi-3-55-Regular',
              fontWeight: 900,
              fontSize: '2vh',
              boxShadow: '0 0.5vh 3vh #06001059',
              position: 'absolute',
              top: 0,
              left: 0,
              whiteSpace: 'nowrap',
              width: 'max-content',
              minWidth: 'fit-content'
            }}>
              {data.bronze.name || '铜牌得主'}
            </p>
          }
          />
          {/* 铜卡礼物值 */}
          {showBronzeValue && (
            <div 
              className="grades-box"
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: '1vh',
                height: 'calc(var(--card-width, 20vh) * 0.2)',
                width: 'calc(var(--card-width, 20vh) * 0.8)',
                background: 'linear-gradient(135deg, rgb(205, 127, 50), rgb(210, 105, 30))',
                color: 'rgb(255, 255, 255)',
                padding: '0.5vh 1vh',
                borderRadius: '0.5vh',
                fontSize: '1.5vh',
                fontFamily: 'AlibabaPuHuiTi-3-55-Regular',
                fontWeight: 'bold',
                boxShadow: 'rgba(0, 0, 0, 0.3) 0px 0.2vh 1vh',
                opacity: showBronzeValue ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
                whiteSpace: 'nowrap',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg
                className="icon grades-icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: 'calc(var(--card-width, 20vh) * 0.0)',
                  width: 'calc(var(--card-width, 20vh) * 0.2)',
                  height: 'calc(var(--card-width, 20vh) * 0.2)'
                }}
              >
                <path
                  d="M382.6 805H242.2c-6.7 0-12.2-5.5-12.2-12.2V434.3c0-6.7 5.5-12.2 12.2-12.2h140.4c6.7 0 12.2 5.5 12.2 12.2v358.6c0 6.6-5.4 12.1-12.1 12.1z"
                  fill="#ea9518"
                ></path>
                <path
                  d="M591.1 805H450.7c-6.7 0-12.2-5.5-12.2-12.2V254.9c0-6.7 5.5-12.2 12.2-12.2h140.4c6.7 0 12.2 5.5 12.2 12.2v537.9c0 6.7-5.5 12.2-12.2 12.2z"
                  fill="#f2be45"
                ></path>
                <path
                  d="M804.4 805H663.9c-6.7 0-12.2-5.5-12.2-12.2v-281c0-6.7 5.5-12.2 12.2-12.2h140.4c6.7 0 12.2 5.5 12.2 12.2v281c0.1 6.7-5.4 12.2-12.1 12.2z"
                  fill="#ea9518"
                ></path>
              </svg>
              <p 
                className="bronze-grades-box-num"
                style={{
                  fontSize: 'calc(var(--card-width, 20vh) * 0.10)',
                  fontFamily: 'AlibabaPuHuiTi-3-55-Regular',
                  marginLeft: 'calc(var(--card-width, 20vh) * 0.17)',
                  marginTop: 'calc(var(--card-width, 20vh) * 0.0)',
                  textAlign: 'center',
                  width: 'calc(var(--card-width, 20vh) * 0.6)',
                  height: 'calc(var(--card-width, 20vh) * 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {data.bronze.value}
              </p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}