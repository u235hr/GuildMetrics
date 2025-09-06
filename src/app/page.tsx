'use client';

import Header from '@/components/Header';
import ReactBitsTopThreeDisplay from '@/components/ReactBitsTopThreeDisplay';
import RankingTable from '@/components/RankingTable';

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
  { rank: 24, name: '娜娜', amount: 110276, growth: 3.7 },
  { rank: 25, name: 'StreamerT', amount: 111878, growth: 2.1 },
  { rank: 26, name: 'StreamerU', amount: 103192, growth: -1.3 },
  { rank: 27, name: 'StreamerV', amount: 100216, growth: 4.8 },
  { rank: 28, name: 'StreamerW', amount: 101885, growth: 0.9 },
  { rank: 29, name: 'StreamerX', amount: 98234, growth: -2.7 },
  { rank: 30, name: 'StreamerY', amount: 80748, growth: 1.4 },
  { rank: 31, name: 'StreamerZ', amount: 77399, growth: -0.9 },
  { rank: 32, name: 'StreamerP', amount: 70725, growth: 2.6 },
  { rank: 33, name: 'StreamerAA', amount: 70436, growth: 1.8 },
  { rank: 34, name: '诗瑶', amount: 65059, growth: -1.2 },
  { rank: 35, name: '月影', amount: 51848, growth: 3.1 },
  { rank: 36, name: '清香', amount: 54223, growth: 0.6 },
  { rank: 37, name: '夏雨', amount: 51603, growth: -2.3 },
  { rank: 38, name: '阿敏', amount: 50875, growth: 1.9 },
  { rank: 39, name: '静静', amount: 50167, growth: 0.3 },
  { rank: 40, name: '小雨', amount: 49876, growth: -0.7 },
  { rank: 41, name: '小小', amount: 49123, growth: 2.4 },
  { rank: 42, name: '小可爱', amount: 48765, growth: 1.1 },
  { rank: 43, name: '小甜甜', amount: 47654, growth: -1.6 },
  { rank: 44, name: '小美美', amount: 46543, growth: 0.8 },
  { rank: 45, name: 'StreamerCC', amount: 45321, growth: 2.7 },
  { rank: 46, name: '小花花', amount: 44210, growth: -0.4 },
  { rank: 47, name: '小萌萌', amount: 43097, growth: 1.5 },
  { rank: 48, name: 'StreamerFF', amount: 42987, growth: 0.2 },
  { rank: 49, name: '小仙女', amount: 41876, growth: -1.1 },
  { rank: 50, name: '晓晓', amount: 40765, growth: 3.3 },
  { rank: 51, name: 'StreamerEE', amount: 39654, growth: 1.7 },
  { rank: 52, name: '悠悠', amount: 38543, growth: -0.8 },
  { rank: 53, name: '柔柔', amount: 37432, growth: 2.2 },
  { rank: 54, name: '甜心', amount: 36321, growth: 0.9 },
  { rank: 55, name: '蜜糖', amount: 35210, growth: -1.4 },
  { rank: 56, name: '糖果', amount: 34099, growth: 1.6 },
  { rank: 57, name: '棉花糖', amount: 32988, growth: 0.5 },
  { rank: 58, name: '小天使', amount: 31877, growth: -0.9 },
  { rank: 59, name: '小精灵', amount: 30766, growth: 2.1 },
  { rank: 60, name: '小公主', amount: 29655, growth: 1.3 },
];

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      <div className="flex-shrink-0">
        <Header />
      </div>

      <main className="flex-1 w-full grid grid-rows-[auto_1fr] pt-6 gap-6 overflow-hidden relative z-10 min-h-0">
        <div className="w-full px-4 flex-shrink-0 min-h-[40vh]">
          <ReactBitsTopThreeDisplay data={topThreeData} />
        </div>

        <div className="w-full h-full min-h-0">
          <RankingTable data={rankingData} />
        </div>
      </main>
    </div>
  );
}
