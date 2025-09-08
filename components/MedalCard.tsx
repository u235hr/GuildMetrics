'use client';
import * as cfg from '@/constants/goldCardConfig';

interface MedalCardProps {
  item: { name: string; value: string; avatar: string };
  type: 'silver' | 'bronze';
}

export default function MedalCard({ item, type }: MedalCardProps) {
  const scale = type === 'silver' ? cfg.SCALE_SILVER : cfg.SCALE_BRONZE;
  
  return (
    <div className="relative h-full w-full">
      {/* 头像 */}
      <div 
        className="absolute rounded-full overflow-hidden"
        style={{ 
          top: `${cfg.AVATAR_TOP_GAP * scale}cqh`,
          left: '50%',
          transform: 'translateX(-50%)',
          width: cfg.getCQMin(cfg.AVATAR_SIZE * scale),
          height: cfg.getCQMin(cfg.AVATAR_SIZE * scale),
        }}
      >
        <img src={item.avatar} className="h-full w-full object-cover" />
      </div>
      
      {/* 名字 */}
      <div 
        className="absolute truncate text-white text-center font-semibold"
        style={{ 
          top: `${cfg.NAME_TOP_GAP * scale}cqh`,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: `${cfg.NAME_FONT * scale}cqw`, 
          lineHeight: 1.2 
        }}
      >
        {item.name}
      </div>
      
      {/* 数值 */}
      <div 
        className={`absolute font-bold text-center ${type === 'silver' ? 'text-gray-300' : 'text-amber-800'}`}
        style={{ 
          top: `${cfg.VALUE_TOP_GAP * scale}cqh`,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: `${cfg.VALUE_FONT * scale}cqw`, 
          lineHeight: 1 
        }}
      >
        {item.value}
      </div>
    </div>
  );
}