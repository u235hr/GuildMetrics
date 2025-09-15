import React from 'react';

// 定义排行榜项的接口
export interface LeaderboardItem {
  image: string;    // 头像 (对应avatar)
  name: string;     // 名字 (对应name)
  value: string;    // 礼物值 (对应value)
  rank: number;     // 排名
}

// 定义组件属性接口
export interface SilverCardProps {
  item: LeaderboardItem;
}

const SilverCard: React.FC<SilverCardProps> = ({ item }) => {
  return (
    <article className="w-full h-full rounded-[20px] overflow-hidden bg-gradient-to-br from-gray-200 via-gray-300 to-gray-500 relative">
      {/* 图片区域 - 绝对定位，强制占据固定区域 */}
      {/* 头像区占卡片高度的 50% */}
      <div className="absolute inset-x-0 top-0 bottom-[50%]">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain object-top"
        />
      </div>
      
      {/* 底栏占卡片高度的 50% */}
      <footer className="absolute left-0 right-0 top-[50%] bottom-0 px-3 text-white bg-gradient-to-t from-black/30 to-transparent">
        {/* 名字区：footer 顶部一半（50%），居中 */}
        <div className="absolute left-2 right-2 top-0 bottom-[35%] flex items-center justify-center">
          <h3 className="
            w-full text-center font-alibaba-reg
            text-[2.5em]
            text-shadow-[2px_2px_2px_rgb(0_0_0_/_0.2)]
          ">
            {item.name}
          </h3>
        </div>
        {/* 数字区：footer 底部一半（50%），居中 */}
        <div className="absolute left-2 right-2 top-[60%] bottom-0 flex items-center justify-center">
          <p className="text-center text-[2em] font-alibaba-reg
          leading-tight bg-white/20 rounded-xl px-2 py-0 [backdrop-filter:blur(10px)] border border-white/1 mx-4 inline-block 
          [box-shadow:2px_2px_2px_rgb(0_0_0_/_1)] bg-gradient-to-r from-[#b0b3b9]/5 to-[#7edae1]/10">
            {item.value}
          </p>
        </div>
      </footer>
    </article>
  );
};

export default SilverCard;