import Header from '@/components/Header';
import TopThreeDisplay from '@/components/TopThreeDisplay';
import RankingTable from '@/components/RankingTable';
import { testData } from '@/data/testData';

export default function Home() {
  const monthData = testData.july2024;

  const topThreeData = monthData.streamers.slice(0, 3).map(s => ({
    rank: s.rank,
    name: s.name,
    amount: s.giftValue,
    avatar: '/globe.svg'
  }));

  const rankingData = monthData.streamers.slice(3).map(s => ({
    rank: s.rank,
    name: s.name,
    amount: s.giftValue,
    mom_growth: 0,
    yoy_growth: 0,
  }));

  return (
    <main className="h-screen w-screen container-type-size text-[min(1.5cqw,1.5cqh)] bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1B]">
      <div className="h-full flex flex-col">
        {/* Header - 10% 高度 */}
        <div className="h-[10cqh]">
          <Header />
        </div>
        
        {/* Top 3 卡片 - 30% 高度 */}
        <div className="h-[30cqh]">
          <TopThreeDisplay data={topThreeData} />
        </div>
        
        {/* 排名表格 - 50% 高度 */}
        <div className="h-[50cqh]">
          <RankingTable data={rankingData} />
        </div>
      </div>
    </main>
  );
}
