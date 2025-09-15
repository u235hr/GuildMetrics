'use client';
import { useState, useEffect } from 'react';
import TiltedGoldCard from './TiltedGoldCard';
import TiltedSilverCard from './TiltedSilverCard';
import TiltedBronzeCard from './TiltedBronzeCard';
import ElectricBorder from './ElectricBorder';

interface Top3ContainerProps {
  data: {
    gold: { name: string; value: string; avatar: string };
    silver: { name: string; value: string; avatar: string };
    bronze: { name: string; value: string; avatar: string };
  };
}

export default function Top3Container({ data }: Top3ContainerProps) {
  const [showSilver, setShowSilver] = useState(false);
  const [showBronze, setShowBronze] = useState(false);
  const [showGold, setShowGold] = useState(false);
  const [goldCanExpand, setGoldCanExpand] = useState(false);
  
  // 新增状态：银卡和铜卡的向上移动和礼物值显示
  const [silverMoveUp, setSilverMoveUp] = useState(false);
  const [bronzeMoveUp, setBronzeMoveUp] = useState(false);
  const [showSilverValue, setShowSilverValue] = useState(false);
  const [showBronzeValue, setShowBronzeValue] = useState(false);

  // 移除wiggle同步逻辑

  // ========== 三个卡片之间的动画衔接逻辑 ==========
  // 卡片顺序出现动画 - 性能优化版本
  useEffect(() => {
    let isMounted = true;
    let animationFrameId: number;
    let timeoutIds: NodeJS.Timeout[] = [];
    
    const startSequentialAnimation = async () => {
      try {
        // ========== 动画衔接第0步：初始化所有状态 ==========
        // 确保所有状态都重置为初始状态
        setShowSilver(false);
        setShowBronze(false);
        setShowGold(false);
        setGoldCanExpand(false);
        setSilverMoveUp(false);
        setBronzeMoveUp(false);
        setShowSilverValue(false);
        setShowBronzeValue(false);

        // 使用 requestAnimationFrame 优化性能
        const waitForFrame = () => new Promise(resolve => {
          animationFrameId = requestAnimationFrame(resolve);
        });

        // ========== 动画衔接第1步：等待页面完全加载 ==========
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

        // ========== 动画衔接第2步：银卡出现 ==========
        // 银卡先出现 - 优化时序
        await new Promise(resolve => {
          const timeoutId = setTimeout(resolve, 300);
          timeoutIds.push(timeoutId);
        });
        
        if (!isMounted) return;
        setShowSilver(true);
        
        // ========== 动画衔接第3步：银卡稳定等待 ==========
        // 等待银卡完全显示和稳定
        await new Promise(resolve => {
          const timeoutId = setTimeout(resolve, 500);
          timeoutIds.push(timeoutId);
        });

        if (!isMounted) return;

        // ========== 动画衔接第4步：铜卡出现 ==========
        // 铜卡出现
        setShowBronze(true);
        // ========== 动画衔接第5步：铜卡稳定等待 ==========
        // 等待铜卡完全显示和稳定
        await new Promise(resolve => {
          const timeoutId = setTimeout(resolve, 500);
          timeoutIds.push(timeoutId);
        });

        if (!isMounted) return;

        // ========== 动画衔接第6步：金卡出现 ==========
        // 金卡出现
        setShowGold(true);
        // ========== 动画衔接第7步：金卡稳定等待 ==========
        // 等待金卡完全显示和稳定
        await new Promise(resolve => {
          const timeoutId = setTimeout(resolve, 500);
          timeoutIds.push(timeoutId);
        });

        if (!isMounted) return;

        // ========== 动画衔接第8步：银卡和铜卡向上移动 ==========
        // 银卡和铜卡同时向上移动并显示礼物值
        setSilverMoveUp(true);
        setShowSilverValue(true);
        setBronzeMoveUp(true);
        setShowBronzeValue(true);
        
        // ========== 动画衔接第9步：等待银卡铜卡移动完成 ==========
        // 等待银卡和铜卡的向上移动动画完成
        await new Promise(resolve => {
          const timeoutId = setTimeout(resolve, 200);
          timeoutIds.push(timeoutId);
        });

        if (!isMounted) return;

        // ========== 动画衔接第10步：触发金卡展开 ==========
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
      className='h-full w-full flex justify-center items-start gap-[15%] pt-[4%]'
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
                height: 'calc(var(--card-width, 20vh) * 0.2)',  // 分数框高度 = 卡片宽度的20%
                width: 'calc(var(--card-width, 20vh) * 0.8)',   // 分数框宽度 = 卡片宽度的80%
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
                  left: '10px', // 可以调左右位置
                  top: 'calc(var(--card-width, 9vh) * 0.03)',   // 上边距 = 卡片宽度的3.3%
                  width: 'calc(var(--card-width, 20vh) * 0.2)',  // 分数图标宽度 = 卡片宽度的20%
                  height: 'calc(var(--card-width, 20vh) * 0.2)' // 分数图标高度 = 卡片宽度的20%
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
                  fontSize: 'calc(var(--card-width, 20vh) * 0.10)', // 分数数字 = 卡片宽度的10% (比金卡小一号)
                  fontFamily: 'AlibabaPuHuiTi-3-55-Regular',
                  marginLeft: 'calc(var(--card-width, 20vh) * 0.17)', // 左边距 = 卡片宽度的17%
                  marginTop: 'calc(var(--card-width, 20vh) * 0.0)', // 上边距 = 卡片宽度的0% (和金卡一样)
                  textAlign: 'center',
                  width: 'calc(var(--card-width, 20vh) * 0.6)', // 宽度 = 卡片宽度的60%
                  height: 'calc(var(--card-width, 20vh) * 0.2)', // 高度 = 卡片宽度的20% (和金卡一样)
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
                height: 'calc(var(--card-width, 20vh) * 0.2)',  // 分数框高度 = 卡片宽度的20%
                width: 'calc(var(--card-width, 20vh) * 0.8)',   // 分数框宽度 = 卡片宽度的80%
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
                  left: '10px', // 可以调左右位置
                  top: 'calc(var(--card-width, 20vh) * 0.0)',   // 上边距 = 卡片宽度的0% (和金卡一样)
                  width: 'calc(var(--card-width, 20vh) * 0.2)',  // 分数图标宽度 = 卡片宽度的20%
                  height: 'calc(var(--card-width, 20vh) * 0.2)' // 分数图标高度 = 卡片宽度的20%
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
                  fontSize: 'calc(var(--card-width, 20vh) * 0.10)', // 分数数字 = 卡片宽度的10% (比金卡小一号)
                  fontFamily: 'AlibabaPuHuiTi-3-55-Regular',
                  marginLeft: 'calc(var(--card-width, 20vh) * 0.17)', // 左边距 = 卡片宽度的17%
                  marginTop: 'calc(var(--card-width, 20vh) * 0.0)', // 上边距 = 卡片宽度的0% (和金卡一样)
                  textAlign: 'center',
                  width: 'calc(var(--card-width, 20vh) * 0.6)', // 宽度 = 卡片宽度的60%
                  height: 'calc(var(--card-width, 20vh) * 0.2)', // 高度 = 卡片宽度的20% (和金卡一样)
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
  );
}