import type { SpringOptions } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface TiltedGoldCardProps {
  imageSrc: React.ComponentProps<'img'>['src'];
  altText?: string;
  captionText?: string;
  containerHeight?: string | number;
  containerWidth?: string | number;
  imageHeight?: string | number;
  imageWidth?: string | number;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
  // 展开式卡片相关props
  showExpandedCard?: boolean;
  startWiggle?: boolean;
  goldCanExpand?: boolean;
  expandedCardData?: {
    name: string;
    score: number;
    rank: number;
    avatar: string;
  };
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2
};

export default function TiltedGoldCard({
  imageSrc,
  altText = 'Tilted card image',
  captionText = '',
  containerHeight = '300px',
  containerWidth = '100%',
  imageHeight = '300px',
  imageWidth = '300px',
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = false,
  overlayContent = null,
  displayOverlayContent = false,
  showExpandedCard = false,
  startWiggle: externalStartWiggle = false,
  goldCanExpand = false,
  expandedCardData
}: TiltedGoldCardProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(0, springValues);
  const rotateY = useSpring(0, springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1
  });

  const [lastY, setLastY] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDetailPage, setShowDetailPage] = useState(false);
  const [startWiggle, setStartWiggle] = useState(false);

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    // 禁用交互旋转与缩放，改为纯展示动画
    return;
  }

  function handleMouseEnter() {
    // 移除hover变大效果
    // scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    // scale.set(1);
    // 不重置旋转，让wiggle效果继续
    // rotateX.set(0);
    // rotateY.set(0);
    rotateFigcaption.set(0);
  }

  // 3D wiggle效果 - 自动轻微摆动
  useEffect(() => {
    // 使用内部状态或外部传入的startWiggle状态
    const shouldWiggle = startWiggle || externalStartWiggle;
    
    if (!shouldWiggle) {
      // 停止wiggle时重置旋转
      rotateX.set(0);
      rotateY.set(0);
      return;
    }
    
    let phase = 0;
    let animationId: number;
    
    const wiggleAnimation = () => {
      phase += 0.02;
      
      if (!ref.current) {
        animationId = requestAnimationFrame(wiggleAnimation);
        return;
      }
      
      const rect = ref.current.getBoundingClientRect();
      
      // 生成轻微的摆动偏移
      const wiggleX = Math.sin(phase) * 15; // 15px的摆动幅度
      const wiggleY = Math.cos(phase * 0.8) * 10; // 10px的摆动幅度
      
      const offsetX = wiggleX;
      const offsetY = wiggleY;
      
      const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude * 0.3; // 减小摆动强度
      const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude * 0.3;
      
      rotateX.set(rotationX);
      rotateY.set(rotationY);
      
      animationId = requestAnimationFrame(wiggleAnimation);
    };
    
    // 使用requestAnimationFrame替代setInterval，提高性能
    animationId = requestAnimationFrame(wiggleAnimation);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [startWiggle, externalStartWiggle, rotateAmplitude]);

  // 检测detail-page动画完成 + 轻量保底（基于显示状态）
  const handleDetailPageAnimationEnd = (e: React.AnimationEvent) => {
    console.log('动画事件触发:', e.animationName, 'showDetailPage:', showDetailPage);
    if (e.animationName === 'slide-in-bottom' && showDetailPage) {
      console.log('detail-page动画完成，开始wiggle');
      setTimeout(() => {
        if (!startWiggle) {
          setStartWiggle(true);
          window.dispatchEvent(new CustomEvent('goldCardExpanded', {
            detail: { timestamp: Date.now() }
          }));
          console.log('wiggle效果已启动，全局事件已发送');
        }
      }, 80);
    }
  };



  // 资源预加载检查
  const checkResourcesReady = async (): Promise<boolean> => {
    try {
      // 检查图片是否加载完成
      const imagePromise = new Promise<boolean>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = imageSrc as string;
      });

      // 检查字体是否加载完成
      const fontPromise = document.fonts.ready;

      // 等待所有资源就绪
      const [imageReady] = await Promise.all([imagePromise, fontPromise]);
      
      return imageReady;
    } catch (error) {
      console.warn('资源预加载检查失败:', error);
      return true; // 出错时继续执行，避免阻塞
    }
  };

  // 自动触发展开动画
  const startAutoExpansion = async () => {
    console.log('开始资源预加载检查...');
    
    // 等待资源就绪
    const resourcesReady = await checkResourcesReady();
    
    if (!resourcesReady) {
      console.warn('部分资源加载失败，但继续执行动画');
    }

    // 等待DOM稳定
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log('资源就绪，开始自动展开动画');
    setIsExpanded(true);
    
    // 延迟显示detail-page，等待outline-page动画完成
    setTimeout(() => {
      setShowDetailPage(true);
      // detail-page显示后，等待其动画完成再开始wiggle
      // 动画完成事件会在CSS动画结束时触发
    }, 300); // 300ms延迟，让outline-page动画进行到一半时开始detail-page动画
  };

  // 当goldCanExpand为true时触发展开动画
  useEffect(() => {
    if (goldCanExpand) {
      console.log('收到展开信号，开始金卡展开动画');
      startAutoExpansion();
    }
  }, [goldCanExpand]);

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <figure
        ref={ref}
        style={{
          position: 'relative',
          width: containerWidth,
          height: containerHeight,
          perspective: '800px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.5s ease-out',
          transform: isExpanded ? 'translateY(-2vh)' : 'translateY(0)'
        }}
        onMouseMove={handleMouse}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
      {showMobileWarning && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          textAlign: 'center',
          fontSize: '0.875rem',
          display: 'none'
        }} className="block sm:hidden">
          This effect is not optimized for mobile. Check on desktop.
        </div>
      )}

      <motion.div
        style={{
          position: 'relative',
          transformStyle: 'preserve-3d',
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale
        }}
      >
        <motion.img
          src={imageSrc}
          alt={altText}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            objectFit: 'cover',
            borderRadius: '15px',
            willChange: 'transform',
            transform: 'translateZ(0)',
            width: imageWidth,
            height: imageHeight
          }}
        />

        {displayOverlayContent && overlayContent && (
          <motion.div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 2,
              willChange: 'transform',
              transform: 'translateZ(30px)'
            }}
          >
            {overlayContent}
          </motion.div>
        )}
      </motion.div>

      {showTooltip && (
        <motion.figcaption
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            left: 0,
            top: 0,
            borderRadius: '4px',
            backgroundColor: '#fff',
            padding: '4px 10px',
            fontSize: '10px',
            color: '#2d2d2d',
            zIndex: 3,
            x,
            y,
            opacity,
            rotate: rotateFigcaption
          }}
          className="hidden sm:block"
        >
          {captionText}
        </motion.figcaption>
          )}

          {/* 展开式金卡 - 放在figure内部，相对于头像定位 */}
          {showExpandedCard && expandedCardData && isExpanded && (
        <div 
          className="expanded-card" 
          style={{ 
            position: 'absolute',
            top: 'calc(100% + 0px)', // 紧贴金卡下边缘，无间隙
            left: '50%',
            transform: 'translateX(-50%)', // 水平居中
            zIndex: 10,
            width: imageWidth, // 和头像一样宽
            margin: '0 auto',
            ['--card-width' as any]: imageWidth // CSS变量，供内部元素使用
          }}
        >
          <div 
            className={`outline-page ${isExpanded ? 'expanded' : 'collapsed'}`}
          >
            <svg
              className="icon trophy"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              style={{ 
                position: 'absolute',
                width: 'calc(var(--card-width, 20vh) * 0.3)', // 奖杯宽度 = 卡片宽度的30%
                height: 'calc(var(--card-width, 20vh) * 0.3)', // 奖杯高度 = 卡片宽度的30%
                right: 'calc(var(--card-width, 20vh) * 0.1)', // 右边距 = 卡片宽度的10% (可调整)
                bottom: 'calc(var(--card-width, 20vh) * 0.1)',  // 下边距 = 卡片宽度的10% (可调整)
              }}
            >
              <path
                d="M469.333333 682.666667h85.333334v128h-85.333334zM435.2 810.666667h153.6c4.693333 0 8.533333 3.84 8.533333 8.533333v34.133333h-170.666666v-34.133333c0-4.693333 3.84-8.533333 8.533333-8.533333z"
                fill="#ea9518"
              ></path>
              <path
                d="M384 853.333333h256a42.666667 42.666667 0 0 1 42.666667 42.666667v42.666667H341.333333v-42.666667a42.666667 42.666667 0 0 1 42.666667-42.666667z"
                fill="#6e4a32"
              ></path>
              <path
                d="M213.333333 256v85.333333a42.666667 42.666667 0 0 0 85.333334 0V256H213.333333zM170.666667 213.333333h170.666666v128a85.333333 85.333333 0 1 1-170.666666 0V213.333333zM725.333333 256v85.333333a42.666667 42.666667 0 0 0 85.333334 0V256h-85.333334z m-42.666666-42.666667h170.666666v128a85.333333 85.333333 0 1 1-170.666666 0V213.333333z"
                fill="#f4ea2a"
              ></path>
              <path
                d="M298.666667 85.333333h426.666666a42.666667 42.666667 0 0 1 42.666667 42.666667v341.333333a256 256 0 1 1-512 0V128a42.666667 42.666667 0 0 1 42.666667-42.666667z"
                fill="#f2be45"
              ></path>
              <path
                d="M512 469.333333l-100.309333 52.736 19.157333-111.701333-81.152-79.104 112.128-16.298667L512 213.333333l50.176 101.632 112.128 16.298667-81.152 79.104 19.157333 111.701333z"
                fill="#FFF2A0"
              ></path>
            </svg>
            <p 
              className="ranking-number"
              style={{
                position: 'absolute',
                width: 'calc(var(--card-width, 20vh) * 0.4)',     // 宽度 = 卡片宽度的40% (可调整)
                height: 'calc(var(--card-width, 20vh) * 0.4)',    // 高度 = 卡片宽度的40% (可调整)
                fontSize: 'calc(var(--card-width, 20vh) * 0.267)', // 排名数字 = 卡片宽度的26.7%
                left: 'calc(var(--card-width, 20vh) * 0.2)',    // 左边距 = 卡片宽度的10% (可调整)
                top: 'calc(var(--card-width, 20vh) * -0.05)',     // 上边距 = 卡片宽度的-10% (可调整)
                margin: 0,
                padding: 0,
                zIndex: 10,
              }}
            >
              {expandedCardData.rank}
              <span 
                className="ranking-word"
                style={{
                  fontSize: 'calc(var(--card-width, 20vh) * 0.133)' // 排名文字 = 卡片宽度的13.3%
                }}
              >
                st
              </span>
            </p>
          </div>
          <div 
            className={`detail-page ${showDetailPage ? 'show' : 'hide'}`}
            style={{ 
              display: showDetailPage ? 'flex' : 'none'
            }}
            onAnimationEnd={handleDetailPageAnimationEnd}
          >
            <svg
              className="icon medals slide-in-top"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                width: 'calc(var(--card-width, 20vh) * 0.267)', // 奖牌宽度 = 卡片宽度的26.7%
                height: 'calc(var(--card-width, 20vh) * 0.267)', // 奖牌高度 = 卡片宽度的26.7%
                top: 'calc(var(--card-width, 20vh) * 0.05)',    // 上边距 = 卡片宽度的5%
                right: 'calc(var(--card-width, 20vh) * 0.017)'  // 右边距 = 卡片宽度的1.7%
              }}
            >
              <path
                d="M896 42.666667h-128l-170.666667 213.333333h128z"
                fill="#FF4C4C"
              ></path>
              <path
                d="M768 42.666667h-128l-170.666667 213.333333h128z"
                fill="#3B8CFF"
              ></path>
              <path d="M640 42.666667h-128L341.333333 256h128z" fill="#F1F1F1"></path>
              <path
                d="M128 42.666667h128l170.666667 213.333333H298.666667z"
                fill="#FF4C4C"
              ></path>
              <path
                d="M256 42.666667h128l170.666667 213.333333h-128z"
                fill="#3B8CFF"
              ></path>
              <path
                d="M384 42.666667h128l170.666667 213.333333h-128z"
                fill="#FBFBFB"
              ></path>
              <path
                d="M298.666667 256h426.666666v213.333333H298.666667z"
                fill="#E3A815"
              ></path>
              <path
                d="M512 661.333333m-320 0a320 320 0 1 0 640 0 320 320 0 1 0-640 0Z"
                fill="#FDDC3A"
              ></path>
              <path
                d="M512 661.333333m-256 0a256 256 0 1 0 512 0 256 256 0 1 0-512 0Z"
                fill="#E3A815"
              ></path>
              <path
                d="M512 661.333333m-213.333333 0a213.333333 213.333333 0 1 0 426.666666 0 213.333333 213.333333 0 1 0-426.666666 0Z"
                fill="#F5CF41"
              ></path>
              <path
                d="M277.333333 256h469.333334a21.333333 21.333333 0 0 1 0 42.666667h-469.333334a21.333333 21.333333 0 0 1 0-42.666667z"
                fill="#D19A0E"
              ></path>
              <path
                d="M277.333333 264.533333a12.8 12.8 0 1 0 0 25.6h469.333334a12.8 12.8 0 1 0 0-25.6h-469.333334z m0-17.066666h469.333334a29.866667 29.866667 0 1 1 0 59.733333h-469.333334a29.866667 29.866667 0 1 1 0-59.733333z"
                fill="#F9D525"
              ></path>
              <path
                d="M512 746.666667l-100.309333 52.736 19.157333-111.701334-81.152-79.104 112.128-16.298666L512 490.666667l50.176 101.632 112.128 16.298666-81.152 79.104 19.157333 111.701334z"
                fill="#FFF2A0"
              ></path>
            </svg>
            <div 
              className="grades-box"
              style={{
                height: 'calc(var(--card-width, 20vh) * 0.25)',  // 分数框高度 = 卡片宽度的25%
                top: 'calc(var(--card-width, 20vh) * 0.033)',   // 上边距 = 卡片宽度的3.3%
                marginRight: 'calc(var(--card-width, 20vh) * 0.033)', // 右边距 = 卡片宽度的3.3%
                marginLeft: 'calc(var(--card-width, 20vh) * 0.05)'    // 左边距 = 卡片宽度的5%
              }}
            >
              <svg
                className="icon grades-icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  width: 'calc(var(--card-width, 20vh) * 0.2)',  // 分数图标宽度 = 卡片宽度的20%
                  height: 'calc(var(--card-width, 20vh) * 0.2)', // 分数图标高度 = 卡片宽度的20%
                  top: 'calc(var(--card-width, 20vh) * 0.033)'   // 上边距 = 卡片宽度的3.3%
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
                className="grades-box-label"
                style={{
                  fontSize: 'calc(var(--card-width, 20vh) * 0.043)', // 分数标签 = 卡片宽度的4.3%
                  marginLeft: 'calc(var(--card-width, 20vh) * 0.2)', // 左边距 = 卡片宽度的20%
                  marginTop: 'calc(var(--card-width, 20vh) * 0.067)', // 上边距 = 卡片宽度的6.7%
                  letterSpacing: 'calc(var(--card-width, 20vh) * 0.02)' // 字间距 = 卡片宽度的2%
                }}
              >
                SCORE
              </p>
              <p 
                className="grades-box-num"
                style={{
                  fontSize: 'calc(var(--card-width, 20vh) * 0.083)', // 分数数字 = 卡片宽度的8.3%
                  marginLeft: 'calc(var(--card-width, 20vh) * 0.2)', // 左边距 = 卡片宽度的20%
                  top: 'calc(var(--card-width, 20vh) * -0.017)'      // 上边距 = 卡片宽度的-1.7%
                }}
              >
                {expandedCardData.score}
              </p>
            </div>
          </div>
        </div>
          )}
      </figure>
    </div>
  );
}