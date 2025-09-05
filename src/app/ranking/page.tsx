'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import MetalCardDisplay from '../../components/MetalCardDisplay';
import RankingTable from '../../components/RankingTable';
import { testData } from '@/data/testData';

// Í³Ò»µÄÊý¾ÝÀàÐÍ
type Streamer = { rank: number; name: string; giftValue: number };

type Monthly = {
  month: number;
  year: number;
  streamers: Streamer[];
  streamerCount: number;
  totalGiftValue: number;
};

type MonthlyMap = Record<string, Monthly>;

const RankingPage: React.FC = () => {
  const [monthly, setMonthly] = useState<Monthly | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/data/monthly.json', { cache: 'no-store' });
        if (res.ok) {
          const json: MonthlyMap = await res.json();
          const preferred = json['2024-07'] || json['2024-06'];
          if (preferred) { setMonthly(preferred); return; }
        }
      } catch {}
      setMonthly({
        month: 7,
        year: 2024,
        streamers: testData.july2024.streamers.map(s => ({ rank: s.rank, name: s.name, giftValue: s.giftValue })),
        streamerCount: testData.july2024.streamerCount,
        totalGiftValue: testData.july2024.totalGiftValue,
      });
    };
    load();
  }, []);

  const julyData = monthly?.streamers ?? testData.july2024.streamers;

  const topThreeData = julyData.slice(0, 3).map(streamer => ({
    rank: streamer.rank,
    name: streamer.name,
    amount: streamer.giftValue,
    avatar: '/globe.svg'
  }));

  const rankingTableData = julyData.slice(3).map(streamer => ({
    rank: streamer.rank,
    name: streamer.name,
    amount: streamer.giftValue,
    mom_growth: 0,
    yoy_growth: 0
  }));

  return (
    <div className="h-screen w-screen text-[min(1.5cqw,1.5cqh)] bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1B]">
      <div className="h-full w-full flex flex-col container-type-size">
        {/* Header - 10% ¸ß¶È */}
        <div className="h-[10cqh]">
          <Header />
        </div>

        {/* Ãæ°üÐ¼µ¼º½ */}
        <div className="text-[0.8em] text-white/60 px-[1em] py-[0.5em]">
          <nav className="flex">
            <Link href="/" className="flex items-center hover:text-white transition-colors">Ö÷Ò³</Link>
            <span className="mx-[0.5em]">/</span>
            <span className="flex items-center text-white">ÅÅÐÐ°ñ</span>
          </nav>
        </div>

        {/* Top 3 ¿¨Æ¬ - 30% ¸ß¶È */}
        <div className="h-[30cqh]">
          <MetalCardDisplay data={topThreeData} />
        </div>
        
        {/* ÅÅÃû±í¸ñ - 50% ¸ß¶È */}
        <div className="h-[50cqh]">
          <RankingTable data={rankingTableData} />
        </div>
      </div>
    </div>
  );
};

export default RankingPage;
