import React from 'react';

// 定义排行榜项的接口
export interface LeaderboardItem {
  image: string;    // 头像 (对应avatar)
  name: string;     // 名字 (对应name)
  value: string;    // 礼物值 (对应value)
  rank: number;     // 排名
}

// 定义组件属性接口
export interface BronzeCardProps {
  item: LeaderboardItem;
}

const BronzeCard: React.FC<BronzeCardProps> = ({ item }) => {
  return (
    <article className="relative w-full h-full rounded-[20px] overflow-hidden bg-gradient-to-br from-amber-400 via-orange-500 to-amber-700">
      {/* 图片层：占据除 footer 高度外的全部空间 */}
      <div className="absolute inset-x-0 top-0 bottom-16">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain object-top"
        />
      </div>

      {/* Footer：固定到底部，高度16（64px） */}
      <footer className="absolute left-0 right-0 bottom-0 h-16 px-3 pt-2 pb-2 text-white bg-gradient-to-t from-black/30 to-transparent">
        {/* 使用两个层划分：名字区(大) + 数字区(剩余) */}
        {/* 名字区占较大空间（顶部 ~ 60%） */}
        <div className="absolute left-2 right-2 top-1" style={{ height: '60%' }}>
          <h3 className="w-full text-center font-alibaba-thin truncate max-w-full 
                         text-[1.05rem] leading-snug @sm/card:text-[1.15rem] @md/card:text-[1.25rem]">
            {item.name}
          </h3>
        </div>
        {/* 数字区占剩余空间（底部 ~ 40%） */}
        <div className="absolute left-2 right-2 bottom-1" style={{ height: '36%' }}>
          <p className="w-full text-center text-[0.72rem] @sm/card:text-[0.78rem] @md/card:text-[0.82rem] opacity-90 leading-tight">
            礼物值: {item.value}
          </p>
        </div>
      </footer>
    </article>
  );
};

export default BronzeCard;