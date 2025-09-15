'use client';
import { useState, useEffect } from 'react';
import TiltedGoldCard from './TiltedGoldCard';
import TiltedSilverCard from './TiltedSilverCard';
import TiltedBronzeCard from './TiltedBronzeCard';

interface Top3ContainerProps {
  data: {
    gold: { name: string; value: string; avatar: string };
    silver: { name: string; value: string; avatar: string };
    bronze: { name: string; value: string; avatar: string };
  };
}

export default function Top3Container({ data }: Top3ContainerProps) {
  const [startWiggle, setStartWiggle] = useState(false);
  const [showSilver, setShowSilver] = useState(false);
  const [showBronze, setShowBronze] = useState(false);
  const [showGold, setShowGold] = useState(false);
  const [goldCanExpand, setGoldCanExpand] = useState(false);

  // 监听金卡的展开状态变化
  useEffect(() => {
    const handleWiggleStart = () => {
      setStartWiggle(true);
    };

    const handleWiggleStop = () => {
      setStartWiggle(false);
    };

    // 监听金卡的展开状态
    window.addEventListener('goldCardExpanded', handleWiggleStart);
    window.addEventListener('goldCardCollapsed', handleWiggleStop);

    return () => {
      window.removeEventListener('goldCardExpanded', handleWiggleStart);
      window.removeEventListener('goldCardCollapsed', handleWiggleStop);
    };
  }, []);

  // 卡片顺序出现动画 - 性能优化版本
  useEffect(() => {
    let isMounted = true;
    let animationFrameId: number;
    let timeoutIds: NodeJS.Timeout[] = [];
    
    const startSequentialAnimation = async () => {
      try {
        // 确保所有状态都重置为初始状态
        setShowSilver(false);
        setShowBronze(false);
        setShowGold(false);
        setGoldCanExpand(false);

        // 使用 requestAnimationFrame 优化性能
        const waitForFrame = () => new Promise(resolve => {
          animationFrameId = requestAnimationFrame(resolve);
        });

        // 等待页面完全加载和DOM稳定
        if (document.readyState !== 'complete') {
          await new Promise(resolve => {
            const handleLoad = () => {
              window.removeEventListener('load', handleLoad);
              resolve(void 0);
            };
            window.addEventListener('load', handleLoad);
          });
        }

        // 等待DOM稳定
        await waitForFrame();
        await new Promise(resolve => {
          const timeoutId = setTimeout(resolve, 200);
          timeoutIds.push(timeoutId);
        });

        if (!isMounted) return;

        // 银卡先出现 - 优化时序
        await new Promise(resolve => {
          const timeoutId = setTimeout(resolve, 300);
          timeoutIds.push(timeoutId);
        });
        
        if (!isMounted) return;
        setShowSilver(true);
        
        await new Promise(resolve => {
          const timeoutId = setTimeout(resolve, 500); // 减少延迟提升流畅度
          timeoutIds.push(timeoutId);
        });

        if (!isMounted) return;

        // 铜卡出现
        setShowBronze(true);
        await new Promise(resolve => {
          const timeoutId = setTimeout(resolve, 500);
          timeoutIds.push(timeoutId);
        });

        if (!isMounted) return;

        // 金卡出现
        setShowGold(true);
        await new Promise(resolve => {
          const timeoutId = setTimeout(resolve, 700); // 给金卡更多时间展示
          timeoutIds.push(timeoutId);
        });

        if (!isMounted) return;

        // 允许金卡开始展开动画
        setGoldCanExpand(true);
      } catch (error) {
        console.error('卡片顺序出现动画失败:', error);
      }
    };

    startSequentialAnimation();

    return () => {
      isMounted = false;
      // 清理所有定时器和动画帧
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, []);

  return (
    <div 
      className='h-full w-full flex justify-center items-start gap-[15%] pt-[1%]'
      style={{ 
        overflow: 'visible',
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        minHeight: '100vh', // 确保容器有足够高度
        position: 'relative'
      }}
    >
      {/* 三个头像卡片 - 水平排列 */}
      <div className="flex justify-center items-center gap-[50%] mb-[3vh]" style={{ maxHeight: '85vh', overflow: 'visible' }}>
        {/* 银牌卡片 */}
        <div style={{ 
          opacity: showSilver ? 1 : 0,
          transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: showSilver ? 'translateY(1vh) scale(1)' : 'translateY(4vh) scale(0.85)',
          filter: showSilver ? 'blur(0px)' : 'blur(2px)'
        }}>
          <TiltedSilverCard
            imageSrc={data.silver.avatar || '/avatars/外国女人头像3_未抠图.jpg'}
            altText={data.silver.name || '银牌得主'}
            captionText={data.silver.name || '银牌得主'}
            containerHeight="20vh"
            containerWidth="20vh"
            imageHeight="20vh"
            imageWidth="20vh"
            rotateAmplitude={12}
            scaleOnHover={1.2}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
            startWiggle={startWiggle}
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
          captionText={data.gold.name || '金牌得主'}
          containerHeight="20vh"
          containerWidth="20vh"
          imageHeight="20vh"
          imageWidth="20vh"
          rotateAmplitude={14}
          scaleOnHover={1.25}
          showMobileWarning={false}
          showTooltip={false}
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
          transform: showBronze ? 'translateY(1vh) scale(1)' : 'translateY(4vh) scale(0.85)',
          filter: showBronze ? 'blur(0px)' : 'blur(2px)'
        }}>
          <TiltedBronzeCard
          imageSrc={data.bronze.avatar || '/avatars/外国女人头像2_未抠图.jpg'}
          altText={data.bronze.name || '铜牌得主'}
          captionText={data.bronze.name || '铜牌得主'}
          containerHeight="20vh"
          containerWidth="20vh"
          imageHeight="20vh"
          imageWidth="20vh"
          rotateAmplitude={12}
          scaleOnHover={1.2}
          showMobileWarning={false}
          showTooltip={false}
          displayOverlayContent={true}
          startWiggle={startWiggle}
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
        </div>
      </div>
    </div>
  );
}