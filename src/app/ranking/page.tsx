'use client';

import { usePageStore } from '@/store';
import Header from '@/components/Header';
import MetalCardDisplay from '@/components/MetalCardDisplay';
import RankingTable from '@/components/RankingTable';
import Link from 'next/link';

// 完整的前三名数据
const topThreeData = [
  {
    rank: 1,
    name: 'StreamerQ',
    amount: 2120425,
    avatar: '/avatars/champion.png',
  },
  {
    rank: 2,
    name: 'StreamerC',
    amount: 1590526,
    avatar: '/avatars/runner.png',
  },
  {
    rank: 3,
    name: 'StreamerA',
    amount: 681638,
    avatar: '/avatars/third.png',
  },
];

// 完整的排名数据（第4-60名）
const rankingData = [
  { rank: 4, name: 'StreamerR', amount: 661086, growth: 5.2 },
  { rank: 5, name: 'StreamerB', amount: 624312, growth: -2.1 },
  { rank: 6, name: 'StreamerH', amount: 446769, growth: 3.8 },
  { rank: 7, name: 'StreamerS', amount: 444035, growth: -1.5 },
  { rank: 8, name: 'StreamerI', amount: 322296, growth: 7.2 },
  { rank: 9, name: 'StreamerJ', amount: 244349, growth: 2.3 },
  { rank: 10, name: 'StreamerL', amount: 236496, growth: -0.8 },
  { rank: 11, name: 'StreamerD', amount: 231074, growth: 4.1 },
  { rank: 12, name: 'StreamerF', amount: 229957, growth: 1.7 },
  { rank: 13, name: 'StreamerE', amount: 221403, growth: -3.2 },
  { rank: 14, name: '可星', amount: 177117, growth: 6.5 },
  { rank: 15, name: '菲儿', amount: 176862, growth: 2.9 },
  { rank: 16, name: 'StreamerK', amount: 162809, growth: -1.8 },
  { rank: 17, name: 'StreamerM', amount: 153741, growth: 3.4 },
  { rank: 18, name: 'StreamerO', amount: 151435, growth: 0.7 },
  { rank: 19, name: '开心就好', amount: 149221, growth: 5.6 },
  { rank: 20, name: 'StreamerN', amount: 146483, growth: -2.4 },
  { rank: 21, name: '香香', amount: 145018, growth: 4.3 },
  { rank: 22, name: '汐汐', amount: 123523, growth: 1.2 },
  { rank: 23, name: '巧儿', amount: 122008, growth: -0.5 },
  { rank: 24, name: '小公主', amount: 120456, growth: 3.1 },
  { rank: 25, name: 'StreamerP', amount: 118923, growth: -1.2 },
  { rank: 26, name: 'StreamerT', amount: 115678, growth: 2.8 },
  { rank: 27, name: 'StreamerU', amount: 112345, growth: 0.9 },
  { rank: 28, name: 'StreamerV', amount: 109876, growth: -0.3 },
  { rank: 29, name: 'StreamerW', amount: 106543, growth: 4.7 },
  { rank: 30, name: 'StreamerX', amount: 103210, growth: 1.5 },
  { rank: 31, name: 'StreamerY', amount: 99877, growth: -2.1 },
  { rank: 32, name: 'StreamerZ', amount: 96544, growth: 3.6 },
  { rank: 33, name: 'StreamerAA', amount: 93211, growth: 0.8 },
  { rank: 34, name: 'StreamerBB', amount: 89878, growth: -1.7 },
  { rank: 35, name: 'StreamerCC', amount: 86545, growth: 2.4 },
  { rank: 36, name: 'StreamerDD', amount: 83212, growth: 1.1 },
  { rank: 37, name: 'StreamerEE', amount: 79879, growth: -0.9 },
  { rank: 38, name: 'StreamerFF', amount: 76546, growth: 3.3 },
  { rank: 39, name: 'StreamerGG', amount: 73213, growth: 0.6 },
  { rank: 40, name: 'StreamerHH', amount: 69880, growth: -1.4 },
  { rank: 41, name: 'StreamerII', amount: 66547, growth: 2.9 },
  { rank: 42, name: 'StreamerJJ', amount: 63214, growth: 1.3 },
  { rank: 43, name: 'StreamerKK', amount: 59881, growth: -0.7 },
  { rank: 44, name: 'StreamerLL', amount: 56548, growth: 3.8 },
  { rank: 45, name: 'StreamerMM', amount: 53215, growth: 0.5 },
  { rank: 46, name: 'StreamerNN', amount: 49882, growth: -2.3 },
  { rank: 47, name: 'StreamerOO', amount: 46549, growth: 2.7 },
  { rank: 48, name: 'StreamerPP', amount: 43216, growth: 1.0 },
  { rank: 49, name: 'StreamerQQ', amount: 39883, growth: -1.6 },
  { rank: 50, name: 'StreamerRR', amount: 36550, growth: 3.2 },
  { rank: 51, name: 'StreamerSS', amount: 33217, growth: 0.4 },
  { rank: 52, name: 'StreamerTT', amount: 29884, growth: -1.8 },
  { rank: 53, name: 'StreamerUU', amount: 26551, growth: 2.6 },
  { rank: 54, name: 'StreamerVV', amount: 23218, growth: 0.9 },
  { rank: 55, name: 'StreamerWW', amount: 19885, growth: -2.0 },
  { rank: 56, name: 'StreamerXX', amount: 16552, growth: 3.5 },
  { rank: 57, name: 'StreamerYY', amount: 13219, growth: 0.7 },
  { rank: 58, name: 'StreamerZZ', amount: 9886, growth: -1.9 },
  { rank: 59, name: 'StreamerAAA', amount: 6553, growth: 2.8 },
  { rank: 60, name: '小公主', amount: 29655, growth: 1.3 }
];

export default function RankingPage() {
  const { selectedMonth } = usePageStore();

  // 将 growth 字段映射为 momGrowth 和 yoyGrowth
  const rankingTableData = rankingData.map(item => ({
    ...item,
    mom_growth: item.growth,
    yoy_growth: item.growth
  }));

  return (
    <div className="h-screen w-screen @container text-[min(1.5cqw,1.5cqh)] bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1B]">
      <div className="h-full w-full flex flex-col">
        {/* Header - 10% 高度 */}
        <div className="h-[10cqh]">
          <Header />
        </div>

        {/* 面包屑导航 */}
        <div className="text-[0.8em] text-white/60 px-[1em] py-[0.5em]">
          <nav className="flex">
            <Link href="/" className="flex items-center hover:text-white transition-colors">主页</Link>
            <span className="mx-[0.5em]">/</span>
            <span className="flex items-center text-white">排行榜</span>
          </nav>
        </div>

        {/* Top 3 卡片 - 30% 高度 */}
        <div className="h-[30cqh]">
          <MetalCardDisplay data={topThreeData} />
        </div>
        
        {/* 排名表格 - 50% 高度 */}
        <div className="h-[50cqh]">
          <RankingTable data={rankingTableData} />
        </div>
      </div>
    </div>
  );
}
