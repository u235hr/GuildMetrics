// app/components/GoldCard.tsx
'use client';
import * as cfg from '@/constants/goldCardConfig';
import GoldProfileCard from './GoldProfileCard';   // ← 新皮肤

export default function GoldCard({ item }: {
  item: { name: string; value: string; avatar: string };
}) {
  return (
    <div className="relative h-full w-full">
      <GoldProfileCard item={item} />
    </div>
  );
}