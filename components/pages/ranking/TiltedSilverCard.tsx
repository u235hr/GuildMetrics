import { useRef, useState, useEffect } from 'react';
import ElectricBorder from '../../ElectricBorder';

interface TiltedSilverCardProps {
  imageSrc: React.ComponentProps<'img'>['src'];
  altText?: string;
  containerHeight?: React.CSSProperties['height'];
  containerWidth?: React.CSSProperties['width'];
  imageHeight?: React.CSSProperties['height'];
  imageWidth?: React.CSSProperties['width'];
  showMobileWarning?: boolean;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
}



export default function TiltedSilverCard({
  imageSrc,
  altText = 'Tilted card image',
  containerHeight = '300px',
  containerWidth = '100%',
  imageHeight = '300px',
  imageWidth = '300px',
  showMobileWarning = true,
  overlayContent = null,
  displayOverlayContent = false,
}: TiltedSilverCardProps) {
  

  

  // 3D wiggle效果 - 自动轻微摆动，大幅增加摆动幅度便于视觉验证
  // 移除3D wiggle效果

  return (
    <figure
      style={{
        position: 'relative',
        height: containerHeight,
        width: containerWidth,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
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

      <div
        style={{
          position: 'relative',
          width: imageWidth,
          height: imageHeight,
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
          <img
            src={imageSrc}
            alt={altText}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              objectFit: 'cover',
              borderRadius: '15px',
              width: imageWidth,
              height: imageHeight
            }}
          />
        </ElectricBorder>

        {displayOverlayContent && overlayContent && (
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 2,
              transform: 'translateZ(30px)'
            }}
          >
            {overlayContent}
          </div>
        )}
      </div>

      
    </figure>
  );
}