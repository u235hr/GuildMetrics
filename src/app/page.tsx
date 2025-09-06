'use client';

import Header from '@/components/Header';
import ReactBitsTopThreeDisplay from '@/components/ReactBitsTopThreeDisplay';
import RankingTable from '@/components/RankingTable';

// ????????
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

// ?????????4-60??
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
  { rank: 14, name: '??', amount: 177117, growth: 6.5 },
  { rank: 15, name: '??', amount: 176862, growth: 2.9 },
  { rank: 16, name: 'StreamerK', amount: 162809, growth: -1.8 },
  { rank: 17, name: 'StreamerM', amount: 153741, growth: 3.4 },
  { rank: 18, name: 'StreamerO', amount: 151435, growth: 0.7 },
  { rank: 19, name: '????', amount: 149221, growth: 5.6 },
  { rank: 20, name: 'StreamerN', amount: 146483, growth: -2.4 },
  { rank: 21, name: '??', amount: 145018, growth: 4.3 },
  { rank: 22, name: '??', amount: 123523, growth: 1.2 },
  { rank: 23, name: '??', amount: 122008, growth: -0.5 },
  { rank: 24, name: '???', amount: 120493, growth: 3.7 },
  { rank: 25, name: '???', amount: 118978, growth: 1.8 },
  { rank: 26, name: '???', amount: 117463, growth: -1.2 },
  { rank: 27, name: '???', amount: 115948, growth: 2.9 },
  { rank: 28, name: '???', amount: 114433, growth: 0.4 },
  { rank: 29, name: '???', amount: 112918, growth: 4.1 },
  { rank: 30, name: '???', amount: 111403, growth: -0.8 },
  { rank: 31, name: '???', amount: 109888, growth: 2.3 },
  { rank: 32, name: '???', amount: 108373, growth: 1.6 },
  { rank: 33, name: '????', amount: 106858, growth: -2.1 },
  { rank: 34, name: '???', amount: 105343, growth: 3.5 },
  { rank: 35, name: '???', amount: 103828, growth: 0.9 },
  { rank: 36, name: '???', amount: 102313, growth: 2.7 },
  { rank: 37, name: '???', amount: 100798, growth: -1.4 },
  { rank: 38, name: '???', amount: 99283, growth: 1.9 },
  { rank: 39, name: '???', amount: 97768, growth: 3.2 },
  { rank: 40, name: '???', amount: 96253, growth: -0.6 },
  { rank: 41, name: '???', amount: 94738, growth: 2.8 },
  { rank: 42, name: '???', amount: 93223, growth: 1.3 },
  { rank: 43, name: '???', amount: 91708, growth: -1.7 },
  { rank: 44, name: '???', amount: 90193, growth: 4.0 },
  { rank: 45, name: '???', amount: 88678, growth: 0.5 },
  { rank: 46, name: '???', amount: 87163, growth: 2.4 },
  { rank: 47, name: '???', amount: 85648, growth: -2.3 },
  { rank: 48, name: '????', amount: 84133, growth: 1.7 },
  { rank: 49, name: '????', amount: 82618, growth: 3.6 },
  { rank: 50, name: '???', amount: 81103, growth: -0.9 },
  { rank: 51, name: '???', amount: 79588, growth: 2.1 },
  { rank: 52, name: '???', amount: 78073, growth: 1.4 },
  { rank: 53, name: '??', amount: 37432, growth: 2.2 },
  { rank: 54, name: '??', amount: 36321, growth: 0.9 },
  { rank: 55, name: '??', amount: 35210, growth: -1.4 },
  { rank: 56, name: '??', amount: 34099, growth: 1.6 },
  { rank: 57, name: '???', amount: 32988, growth: 0.5 },
  { rank: 58, name: '???', amount: 31877, growth: -0.9 },
  { rank: 59, name: '???', amount: 30766, growth: 2.1 },
  { rank: 60, name: '???', amount: 29655, growth: 1.3 },
];

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0">
        <Header />
      </header>

      {/* Main */}
      <main className="flex-1 grid grid-rows-[auto_1fr] gap-6 pt-6">
        {/* Top3 */}
        <section className="min-h-[40vh] flex items-end justify-center">
          <ReactBitsTopThreeDisplay data={topThreeData} />
        </section>

        {/* RankingTable */}
        <section className="overflow-hidden">
          <RankingTable data={rankingData} />
        </section>
      </main>
    </div>
  );
}
