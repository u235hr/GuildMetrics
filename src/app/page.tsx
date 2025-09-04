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
    mom_growth: 0, // Placeholder
    yoy_growth: 0, // Placeholder for the new column
  }));

  return (
    <main className="flex flex-col h-screen w-screen p-4 gap-4">
      <div className="h-[10%]">
        <Header />
      </div>
      <div className="h-[30%]">
        <TopThreeDisplay data={topThreeData} />
      </div>
      <div className="h-[55%] pb-4">
        <RankingTable data={rankingData} />
      </div>
    </main>
  );
}
