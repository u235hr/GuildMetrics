'use client';
import { useState, useEffect } from 'react';
import TiltedGoldCard from './TiltedGoldCard';
import TiltedSilverCard from './TiltedSilverCard';
import TiltedBronzeCard from './TiltedBronzeCard';
import { WarpBackground } from '../../ui/warp-background';

interface Top3ContainerProps {
  data: {
    gold: { name: string; value: string; avatar: string };
    silver: { name: string; value: string; avatar: string };
    bronze: { name: string; value: string; avatar: string };
  };
}

export default function Top3Container({ data }: Top3ContainerProps) {
  // 使用老代码的简单状态管理
  const [showSilver, setShowSilver] = useState(false);
  const [showBronze, setShowBronze] = useState(false);
  const [showGold, setShowGold] = useState(false);
  const [goldCanExpand, setGoldCanExpand] = useState(false);
  const [showWarpAnimation, setShowWarpAnimation] = useState(false);
  const [startWiggle, setStartWiggle] = useState(false);

  // 监听金卡的展开状态变化（保持老代码的逻辑）
  useEffect(() => {
    console.log('🎯 Setting up wiggle event listeners');
    
    const handleWiggleStart = () => {
      console.log('🌟 Gold card expanded, starting wiggle');
      setStartWiggle(true);
    };

    const handleWiggleStop = () => {
      console.log('🌟 Gold card collapsed, stopping wiggle');
      setStartWiggle(false);
    };

    // 监听金卡的展开状态
    window.addEventListener('goldCardExpanded', handleWiggleStart);
    window.addEventListener('goldCardCollapsed', handleWiggleStop);

    return () => {
      console.log('🧹 Cleaning up wiggle event listeners');
      window.removeEventListener('goldCardExpanded', handleWiggleStart);
      window.removeEventListener('goldCardCollapsed', handleWiggleStop);
    };
  }, []);

  // 卡片顺序出现动画 - 使用老代码的逻辑
  useEffect(() => {
    console.log('🚀 Starting card animation sequence');
    let isMounted = true;
    let timeoutIds: NodeJS.Timeout[] = [];
    
    const startSequentialAnimation = async () => {
      try {
        console.log('📋 Resetting all card states to hidden');
        // 确保所有状态都重置为初始状态
        setShowSilver(false);
        setShowBronze(false);
        setShowGold(false);
        setGoldCanExpand(false);
        setShowWarpAnimation(false);

        // 等待页面完全加载和DOM稳定
        if (document.readyState !== 'complete') {
          console.log('⏳ Waiting for page to load completely');
          await new Promise(resolve => {
            const handleLoad = () => {
              window.removeEventListener('load', handleLoad);
              resolve(void 0);
            };
            window.addEventListener('load', handleLoad);
          });
        }

        // 等待DOM稳定
        await new Promise(resolve => {
          const timeoutId = setTimeout(resolve, 200);
          timeoutIds.push(timeoutId);
        });

        if (!isMounted) {
          console.log('❌ Component unmounted, stopping animation');
          return;
        }

        console.log('🥈 Showing silver card');
        // 银卡先出现
        await new Promise(resolve => {
          const timeoutId = setTimeout(resolve, 300);
          timeoutIds.push(timeoutId);
        });
        
        if (!isMounted) return;
        setShowSilver(true);
        console.log('✅ Silver card visible');
        
        await new Promise(resolve => {
          const timeoutId = setTimeout(resolve, 500);
          timeoutIds.push(timeoutId);
        });

        if (!isMounted) return;

        console.log('🥉 Showing bronze card');
        // 铜卡出现
        setShowBronze(true);
        console.log('✅ Bronze card visible');
        
        await new Promise(resolve => {
          const timeoutId = setTimeout(resolve, 500);
          timeoutIds.push(timeoutId);
        });

        if (!isMounted) return;

        console.log('🥇 Showing gold card');
        // 金卡出现
        setShowGold(true);
        console.log('✅ Gold card visible');
        
        await new Promise(resolve => {
          const timeoutId = setTimeout(resolve, 700);
          timeoutIds.push(timeoutId);
        });

        if (!isMounted) return;

        console.log('🌟 Enabling gold card expansion');
        // 允许金卡开始展开动画
        setGoldCanExpand(true);
        
        // 启动warp背景动画
        setTimeout(() => {
          console.log('🎆 Starting warp background animation');
          setShowWarpAnimation(true);
        }, 1000);
        
      } catch (error) {
        console.error('❌ Card animation sequence failed:', error);
      }
    };

    startSequentialAnimation();

    return () => {
      console.log('🧹 Cleaning up animation timeouts');
      isMounted = false;
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, []);

  return (
    <WarpBackground 
      className="w-full h-full overflow-hidden p-0 rounded-none border-0"
      perspective={100}
      beamsPerSide={4}
      beamSize={8}
      beamDelayMax={2}
      beamDelayMin={0}
      beamDuration={4}
      gridColor="rgba(255, 215, 0, 0.3)"
      enabled={showWarpAnimation} // Controlled by the final animation stage
    >
      <div 
        className='h-full w-full flex justify-center items-center gap-[15%]'
        style={{ 
          overflow: 'visible',
          perspective: '1000px',
          transformStyle: 'preserve-3d',
          position: 'relative',
          paddingTop: '4.5vh'
        }}
      >
        {/* 三个头像卡片 - 水平排列 */}
        <div className="flex justify-center items-center gap-[50%]" style={{ maxHeight: '80vh', overflow: 'visible' }}>
          {/* 银牌卡片 */}
          <div style={{ 
            opacity: showSilver ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: showSilver ? 'translateY(1vh) scale(1)' : 'translateY(4vh) scale(0.85)',
            filter: showSilver ? 'blur(0px)' : 'blur(2px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1vh'
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
              startWiggle={startWiggle}
              overlayContent={<CardOverlay name={data.silver.name || '银牌得主'} />}
            />
            {/* 银牌数字框 */}
            <ValueBox value={data.silver.value} type="silver" />
          </div>

          {/* 金牌卡片 - 包含展开式卡片 */}
          <div style={{ 
            opacity: showGold ? 1 : 0,
            transition: 'opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transform: showGold ? 'translateY(0vh) scale(1.05)' : 'translateY(5vh) scale(0.75)',
            filter: showGold ? 'blur(0px) brightness(1.1)' : 'blur(3px) brightness(0.8)'
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
              startWiggle={startWiggle}
              goldCanExpand={goldCanExpand}
              expandedCardData={{
                name: data.gold.name || '金牌得主',
                score: parseInt(data.gold.value.replace(/,/g, '')) || 0,
                rank: 1,
                avatar: data.gold.avatar || '/avatars/外国女人头像1_未抠图.jpeg'
              }}
              overlayContent={<CardOverlay name={data.gold.name || '金牌得主'} />}
            />
          </div>

          {/* 铜牌卡片 */}
          <div style={{ 
            opacity: showBronze ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: showBronze ? 'translateY(1vh) scale(1)' : 'translateY(4vh) scale(0.85)',
            filter: showBronze ? 'blur(0px)' : 'blur(2px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1vh'
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
              startWiggle={startWiggle}
              overlayContent={<CardOverlay name={data.bronze.name || '铜牌得主'} />}
            />
            {/* 铜牌数字框 */}
            <ValueBox value={data.bronze.value} type="bronze" />
          </div>
        </div>
      </div>
    </WarpBackground>
  );
}

// Helper components
const CardOverlay = ({ name }: { name: string }) => (
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
    {name}
  </p>
);

const ValueBox = ({ value, type }: { value: string, type: 'silver' | 'bronze' }) => {
  const background = type === 'silver' 
    ? 'linear-gradient(135deg, rgb(192, 192, 192), rgb(169, 169, 169))' 
    : 'linear-gradient(135deg, rgb(205, 127, 50), rgb(210, 105, 30))';

  return (
    <div 
      className="grades-box"
      style={{
        height: 'calc(var(--card-width, 20vh) * 0.2)',
        width: 'calc(var(--card-width, 20vh) * 0.8)',
        background,
        color: 'rgb(255, 255, 255)',
        padding: '0.5vh 1vh',
        borderRadius: '0.5vh',
        fontSize: '1.5vh',
        fontFamily: 'AlibabaPuHuiTi-3-55-Regular',
        fontWeight: 'bold',
        boxShadow: 'rgba(0, 0, 0, 0.3) 0px 0.2vh 1vh',
        whiteSpace: 'nowrap',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
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
          top: '50%',
          transform: 'translateY(-50%)',
          width: 'calc(var(--card-width, 20vh) * 0.15)',
          height: 'calc(var(--card-width, 20vh) * 0.15)'
        }}
      >
        <path d="M382.6 805H242.2c-6.7 0-12.2-5.5-12.2-12.2V434.3c0-6.7 5.5-12.2 12.2-12.2h140.4c6.7 0 12.2 5.5 12.2 12.2v358.6c0 6.6-5.4 12.1-12.1 12.1z" fill="#ea9518" />
        <path d="M591.1 805H450.7c-6.7 0-12.2-5.5-12.2-12.2V254.9c0-6.7 5.5-12.2 12.2-12.2h140.4c6.7 0 12.2 5.5 12.2 12.2v537.9c0 6.7-5.5 12.2-12.2 12.2z" fill="#f2be45" />
        <path d="M804.4 805H663.9c-6.7 0-12.2-5.5-12.2-12.2v-281c0-6.7 5.5-12.2 12.2-12.2h140.4c6.7 0 12.2 5.5 12.2 12.2v281c0.1 6.7-5.4 12.2-12.1 12.2z" fill="#ea9518" />
      </svg>
      <p style={{
        fontSize: 'calc(var(--card-width, 20vh) * 0.10)',
        fontFamily: 'AlibabaPuHuiTi-3-55-Regular',
        marginLeft: 'calc(var(--card-width, 20vh) * 0.17)',
        textAlign: 'center',
        width: 'calc(var(--card-width, 20vh) * 0.6)',
      }}>
        {value}
      </p>
    </div>
  );
};