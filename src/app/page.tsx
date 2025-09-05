'use client';

import Header from '@/components/Header';
import TopThreeDisplay from '@/components/TopThreeDisplay';
import ModernTopThreeDisplay from '@/components/ModernTopThreeDisplay';
import ReactBitsTopThreeDisplay from '@/components/ReactBitsTopThreeDisplay';
import ThreeJsPodium from '@/components/ThreeJsPodium';
import RankingTable from '@/components/RankingTable';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import { testData } from '@/data/testData';
import { usePageStore } from '@/store';
import { setupAutoRefresh, setupFrameRateLimit } from '@/utils/performanceConfig';
import { useEffect } from 'react';

export default function Home() {
  const { selectedMonth } = usePageStore();
  
  // 设置生产环境自动刷新和性能优化
  useEffect(() => {
    console.log('[App] Initializing performance optimizations...');
    setupAutoRefresh();
    setupFrameRateLimit();
    console.log('[App] Performance optimizations initialized');
  }, []);
  // 6月完整数据 (47人)
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
    { rank: 20, name: '糖小糖', giftValue: 125558 },
    { rank: 21, name: '允诺', giftValue: 112434 },
    { rank: 22, name: '香香', giftValue: 111208 },
    { rank: 23, name: '妙涵', giftValue: 105904 },
    { rank: 24, name: '娜娜', giftValue: 104135 },
    { rank: 25, name: '巧儿', giftValue: 88426 },
    { rank: 26, name: '少女', giftValue: 90305 },
    { rank: 27, name: '静静', giftValue: 70970 },
    { rank: 28, name: '汐汐', giftValue: 65224 },
    { rank: 29, name: '清香', giftValue: 64081 },
    { rank: 30, name: '卿卿', giftValue: 62914 },
    { rank: 31, name: '幸福', giftValue: 62006 },
    { rank: 32, name: '蓓儿', giftValue: 57285 },
    { rank: 33, name: '心彤', giftValue: 57260 },
    { rank: 34, name: '阿敏', giftValue: 56763 },
    { rank: 35, name: '陌离', giftValue: 53085 },
    { rank: 36, name: '可星', giftValue: 47934 },
    { rank: 37, name: '恋儿', giftValue: 47912 },
    { rank: 38, name: '依依', giftValue: 46462 },
    { rank: 39, name: '诗瑶', giftValue: 45423 },
    { rank: 40, name: '夏雨', giftValue: 44219 },
    { rank: 41, name: '天天', giftValue: 40829 },
    { rank: 42, name: '欣欣', giftValue: 39545 },
    { rank: 43, name: '丽丽', giftValue: 37097 },
    { rank: 44, name: '辣包子', giftValue: 38463 },
    { rank: 45, name: '拾柒', giftValue: 38137 },
    { rank: 46, name: '宛儿', giftValue: 38728 },
    { rank: 47, name: '豆奶', giftValue: 36139 }
  ];

  // 7月完整数据 (39人)
  const july2024Data = [
    { rank: 1, name: '小太阳', giftValue: 2120425 },
    { rank: 2, name: '安妮', giftValue: 1590526 },
    { rank: 3, name: '宝儿', giftValue: 681638 },
    { rank: 4, name: '小燕子', giftValue: 661086 },
    { rank: 5, name: '雪儿', giftValue: 624312 },
    { rank: 6, name: '小妮子', giftValue: 446769 },
    { rank: 7, name: '妙涵', giftValue: 444035 },
    { rank: 8, name: '紫琳', giftValue: 322296 },
    { rank: 9, name: '英英', giftValue: 244349 },
    { rank: 10, name: '小蛮', giftValue: 236496 },
    { rank: 11, name: '鱼儿', giftValue: 231074 },
    { rank: 12, name: '六六', giftValue: 229957 },
    { rank: 13, name: '丽娜', giftValue: 221403 },
    { rank: 14, name: '可星', giftValue: 177117 },
    { rank: 15, name: '菲儿', giftValue: 176862 },
    { rank: 16, name: '闻雨', giftValue: 162809 },
    { rank: 17, name: '梦妮', giftValue: 153741 },
    { rank: 18, name: '心缘', giftValue: 151435 },
    { rank: 19, name: '开心就好', giftValue: 149221 },
    { rank: 20, name: '可儿', giftValue: 146483 },
    { rank: 21, name: '香香', giftValue: 145018 },
    { rank: 22, name: '汐汐', giftValue: 123523 },
    { rank: 23, name: '巧儿', giftValue: 122008 },
    { rank: 24, name: '娜娜', giftValue: 110276 },
    { rank: 25, name: '幸福', giftValue: 111878 },
    { rank: 26, name: '瑶玥', giftValue: 103192 },
    { rank: 27, name: '糖小糖', giftValue: 100216 },
    { rank: 28, name: '雪菲', giftValue: 101885 },
    { rank: 29, name: '依依', giftValue: 98234 },
    { rank: 30, name: '卿卿', giftValue: 80748 },
    { rank: 31, name: '心彤', giftValue: 77399 },
    { rank: 32, name: '若兮', giftValue: 70725 },
    { rank: 33, name: '思思', giftValue: 70436 },
    { rank: 34, name: '诗瑶', giftValue: 65059 },
    { rank: 35, name: '月影', giftValue: 51848 },
    { rank: 36, name: '清香', giftValue: 54223 },
    { rank: 37, name: '夏雨', giftValue: 51603 },
    { rank: 38, name: '阿敏', giftValue: 50875 },
    { rank: 39, name: '静静', giftValue: 50167 }
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

  // 根据选择的月份获取数据
  const getCurrentData = () => {
    if (selectedMonth === '2025-07') {
      return july2024Data;
    }
    return june2024Data; // 默认6月数据
  };

  const currentData = getCurrentData();
  
  const topThreeData = currentData.slice(0, 3).map(s => ({
    rank: s.rank,
    name: s.name,
    amount: s.giftValue,
    avatar: getAvatar(s.name)
  }));

  const rankingData = currentData.slice(3).map(s => ({
    rank: s.rank,
    name: s.name,
    amount: s.giftValue,
    mom_growth: 0,
    yoy_growth: 0,
  }));

  return (
    <main className="h-screen w-screen text-[min(1.5cqw,1.5cqh)] bg-gradient-to-br from-[#0a0a0a] to-[#1a1a3a] overflow-hidden">
      <div className="h-full w-full flex flex-col container-type-size">
        {/* Header - 固定高度 */}
        <div className="h-[10cqh] flex-shrink-0">
          <Header />
        </div>
        
        {/* Top 3 现代卡片展示 - 增加空间 */}
        <div className="h-[40cqh] flex-shrink-0">
          <ReactBitsTopThreeDisplay data={topThreeData} />
        </div>
        
        {/* 排名表格 - 减少空间 */}
        <div className="flex-1 min-h-0">
          <RankingTable data={rankingData} />
        </div>
      </div>
      
      {/* 性能监控组件 */}
      <PerformanceMonitor />
    </main>
  );
}
