import type { SpringOptions } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import ElectricBorder from './ElectricBorder';

interface TiltedSilverCardProps {
  imageSrc: React.ComponentProps<'img'>['src'];
  altText?: string;
  captionText?: string;
  containerHeight?: React.CSSProperties['height'];
  containerWidth?: React.CSSProperties['width'];
  imageHeight?: React.CSSProperties['height'];
  imageWidth?: React.CSSProperties['width'];
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2
};

export default function TiltedSilverCard({
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
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
}: TiltedSilverCardProps) {
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

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    // 禁用hover效果
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

  // 3D wiggle效果 - 自动轻微摆动，大幅增加摆动幅度便于视觉验证
  // 移除3D wiggle效果

  return (
    <figure
      ref={ref}
      style={{
        position: 'relative',
        height: containerHeight,
        width: containerWidth,
        perspective: '800px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
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
        <ElectricBorder
          color="#C0C0C0"
          speed={0.5}
          chaos={0.1}
          thickness={3}
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: imageWidth,
            height: imageHeight,
            borderRadius: 15,
            pointerEvents: 'none',
            zIndex: 10
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
        </ElectricBorder>

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
    </figure>
  );
}