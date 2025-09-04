import Header from '@/components/Header';
import TopThreeDisplay from '@/components/TopThreeDisplay';
import RankingTable from '@/components/RankingTable';
import { testData } from '@/data/testData';

export default function Home() {
  // 使用6月真实数据
  const june2024Data = [
    { rank: 1, name: '宝儿', giftValue: 836669 },
    { rank: 2, name: '雪儿', giftValue: 797145 },
    { rank: 3, name: '安妮', giftValue: 764030 },
    { rank: 4, name: '鱼儿', giftValue: 297901 },
    { rank: 5, name: '丽娜', giftValue: 288709 },
    { rank: 6, name: '六六', giftValue: 276929 },
    { rank: 7, name: '菟菟', giftValue: 270791 },
    { rank: 8, name: '小妮子', giftValue: 227546 },
    { rank: 9, name: '紫琳', giftValue: 227003 },
    { rank: 10, name: '英英', giftValue: 224118 },
    { rank: 11, name: '闻雨', giftValue: 222840 },
    { rank: 12, name: '小蛮', giftValue: 208173 },
    { rank: 13, name: '梦妮', giftValue: 204274 },
    { rank: 14, name: '可儿', giftValue: 171932 },
    { rank: 15, name: '心缘', giftValue: 171465 },
    { rank: 16, name: '若兮', giftValue: 165299 },
    { rank: 17, name: '开心就好', giftValue: 144556 },
    { rank: 18, name: '菲儿', giftValue: 141567 },
    { rank: 19, name: '瑶玥', giftValue: 138418 },
    { rank: 20, name: '糖小糖', giftValue: 125558 }
  ];

  // 头像映射函数 - 根据名字分配不同的头像
  const getAvatar = (name: string) => {
    // 临时使用本地头像，后续可以替换为真实的卡通头像
    // 创建一个简单的头像库，使用不同颜色的圆形作为占位符
    const avatarColors = [
      '#FF6B6B', // 红色
      '#4ECDC4', // 青色
      '#45B7D1', // 蓝色
      '#96CEB4', // 绿色
      '#FECA57', // 黄色
      '#FF9FF3', // 粉色
      '#54A0FF', // 天蓝色
      '#5F27CD'  // 紫色
    ];
    
    // 根据名字的字符码分配颜色
    const nameCode = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = nameCode % avatarColors.length;
    const color = avatarColors[colorIndex];
    
    // 生成一个简单的SVG头像，显示名字的第一个字符
    const firstChar = name.charAt(0);
    
    // 直接使用SVG URL编码，避免btoa在服务端的问题
    const svgContent = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="100" fill="${color}"/><text x="100" y="120" text-anchor="middle" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="white">${firstChar}</text></svg>`;
    const encodedSvg = encodeURIComponent(svgContent);
    
    return `data:image/svg+xml,${encodedSvg}`;
  };

  const topThreeData = june2024Data.slice(0, 3).map(s => ({
    rank: s.rank,
    name: s.name,
    amount: s.giftValue,
    avatar: getAvatar(s.name)
  }));

  const rankingData = june2024Data.slice(3).map(s => ({
    rank: s.rank,
    name: s.name,
    amount: s.giftValue,
    mom_growth: 0,
    yoy_growth: 0,
  }));

  return (
    <main className="h-screen w-screen text-[min(1.5cqw,1.5cqh)] bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1B]">
      <div className="h-full w-full flex flex-col container-type-size">
        {/* Header - 10% ¸ß¶È */}
        <div className="h-[10cqh]">
          <Header />
        </div>
        
        {/* Top 3 ¿¨Æ¬ - 30% ¸ß¶È */}
        <div className="h-[30cqh]">
          <TopThreeDisplay data={topThreeData} />
        </div>
        
        {/* ÅÅÃû±í¸ñ - 50% ¸ß¶È */}
        <div className="h-[50cqh]">
          <RankingTable data={rankingData} />
        </div>
      </div>
    </main>
  );
}
