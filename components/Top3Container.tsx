﻿'use client';
import GoldProfileCard from './GoldProfileCard';
import MedalCard from './MedalCard';

interface Top3Data {
  gold: { name: string; value: string; avatar: string };
  silver: { name: string; value: string; avatar: string };
  bronze: { name: string; value: string; avatar: string };
}

interface Top3ContainerProps {
  data: Top3Data;
}

export default function Top3Container({ data }: Top3ContainerProps) {
  // 计算卡片宽高比
  // const cardAspectRatio = cfg.CARD_WIDTH / cfg.CARD_HEIGHT;
  
  return (
    <div className='relative h-full w-full flex justify-center items-end pb-[0%]'>
      {/* 金卡 - 居中 */}
      <div className='h-[100%] '>
        <GoldProfileCard 
          avatarUrl={data.gold.avatar}
          // iconUrl="/medal-front/clay.png"
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

      {/* 银卡 - 左侧 */}
      {/* <div
        className='absolute bg-gradient-to-br from-gray-300 to-gray-500 rounded-lg shadow-lg'
        style={{
          height: `${cfg.CARD_HEIGHT * cfg.SCALE_SILVER}cqh`,
          width: `${cfg.CARD_WIDTH * cfg.SCALE_SILVER}cqw`,
          bottom: `${cfg.CARD_BOTTOM_OFFSET}cqh`,
          left: `calc(50% - ${cfg.CARD_WIDTH * cfg.SCALE_SILVER * 0.5 + cfg.CARD_HORIZONTAL_GAP}cqw)`,
          transform: 'translateX(-100%)',
          aspectRatio: cardAspectRatio,
        }}
      >
        <MedalCard item={data.silver} type='silver' />
      </div> */}

      {/* 铜卡 - 右侧 */}
      {/* <div
        className='absolute bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg shadow-lg'
        style={{
          height: `${cfg.CARD_HEIGHT * cfg.SCALE_BRONZE}cqh`,
          width: `${cfg.CARD_WIDTH * cfg.SCALE_BRONZE}cqw`,
          bottom: `${cfg.CARD_BOTTOM_OFFSET}cqh`,
          left: `calc(50% + ${cfg.CARD_WIDTH * cfg.SCALE_SILVER * 0.5 + cfg.CARD_HORIZONTAL_GAP}cqw)`,
          aspectRatio: cardAspectRatio,
        }}
      >
        <MedalCard item={data.bronze} type='bronze' />
      </div> */}
    </div>
  );
}