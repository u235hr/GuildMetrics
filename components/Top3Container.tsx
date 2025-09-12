﻿'use client';
import GoldProfileCard from './GoldProfileCard';
import MedalCard from './MedalCard';
import LightRays from './LightRays';

interface Top3Data {
  gold: { name: string; value: string; avatar: string };
  silver: { name: string; value: string; avatar: string };
  bronze: { name: string; value: string; avatar: string };
}

interface Top3ContainerProps {
  data: Top3Data;
}

export default function Top3Container({ data }: Top3ContainerProps) {
  return (
    <div className='relative h-full w-full flex justify-center items-end pb-[0%]'>
      {/* 添加 LightRays 光效组件作为背景 - 确保在底层 */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          zIndex: 1, // 确保在底层
          pointerEvents: 'none' // 禁用鼠标事件，避免干扰金卡
        }}
      >
        <LightRays
          raysOrigin="top-center"
          raysColor="#f2fedc" // 金色主题
          raysSpeed={0.4} // 更慢更优雅
          lightSpread={3} // 更大的扩散范围
          rayLength={1.0} // 更长的光线
          followMouse={false} // 保持禁用
          mouseInfluence={0} // 保持禁用
          noiseAmount={0.02} // 更少的噪点
          distortion={0.01} // 更少的扭曲
          pulsating={true} // 保持脉动
          fadeDistance={1.0} // 更自然的淡出
          saturation={0.8} // 稍微降低饱和度
          className="custom-rays"
        />
      </div>
      
      {/* 金卡 - 居中，确保在光效之上 */}
      <div className='h-[100%] relative' style={{ zIndex: 10 }}>
        <GoldProfileCard 
          avatarUrl={data.gold.avatar}
          // iconUrl="/medal-front/color.png" 
          name={data.gold.name}
          title={`${data.gold.value}`}
          handle="user"
          status="Online"
          contactText="Contact"
          showUserInfo={false}
          enableTilt={true}
          enableMobileTilt={false}
          onContactClick={() => console.log('Contact clicked')}
        />
      </div>
    </div>
  );
}