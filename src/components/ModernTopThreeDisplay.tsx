"use client";

import React, { useMemo, useCallback } from 'react';
import { Crown, Trophy, Medal, TrendingUp } from 'lucide-react';
import type { StreamerInfo } from '../types';
import { cn } from '@/lib/utils';
import { useCurrentMonthDataSelector } from '../store';

// 稳定的数字格式化，避免 SSR/CSR 不一致
const useStableNumberFormat = () => {
  const formatNumber = useCallback((n: number): string => {
    if (!Number.isFinite(n)) return '0';
    const sign = n < 0 ? '-' : '';
    const s = Math.floor(Math.abs(n)).toString();
    return sign + s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }, []);

  // 按用户要求：礼物值显示原始数字（千分位），不加人民币符号与单位
  const formatGiftValue = useCallback((value: number): string => {
    if (!value) return '0';
    return formatNumber(value);
  }, [formatNumber]);

  return { formatNumber, formatGiftValue };
};

const rankConfig = {
  1: { label: '冠军', icon: Crown, className: 'rank-1' },
  2: { label: '亚军', icon: Trophy, className: 'rank-2' },
  3: { label: '季军', icon: Medal, className: 'rank-3' }
} as const;

const Card: React.FC<{ streamer: StreamerInfo; rank: 1 | 2 | 3 }> = ({ streamer, rank }) => {
  const { formatNumber, formatGiftValue } = useStableNumberFormat();
  const cfg = rankConfig[rank];
  const Icon = cfg.icon;

  return (
    <article className={cn('top-three-card rounded-xl border border-white/20 p-1 text-slate-900 h-auto', cfg.className)}>
      <header className="flex items-center justify-between mb-0.5">
        <h4 className="flex items-center gap-0.5 text-slate-900">
          <Icon className="w-3 h-3 text-slate-700" />
          <strong className="font-bold text-xs">{cfg.label}</strong>
        </h4>
        <TrendingUp className="w-2 h-2 text-green-500" />
      </header>

      <figure className="flex items-center gap-0.5">
        <strong className="shrink-0 rounded-full bg-slate-800/10 w-4 h-4 flex items-center justify-center text-xs font-bold text-slate-900">
          {streamer.name.charAt(0)}
        </strong>
        <figcaption className="min-w-0">
          <h3 className="font-bold truncate text-xs text-slate-900" title={streamer.name}>{streamer.name}</h3>
          <span className="text-xs text-slate-600 truncate" title={`ID: ${streamer.id}`}>ID: {streamer.id}</span>
        </figcaption>
      </figure>

      <section className="mt-0.5">
        <dl>
          <dt className="text-xs text-slate-700">礼物值</dt>
          <dd className="text-sm font-extrabold text-slate-900" title={formatNumber(streamer.giftValue)}>
            {formatGiftValue(streamer.giftValue)}
          </dd>
        </dl>
      </section>
    </article>
  );
};

// 兼容旧用法：streamers 可选，缺省时从 store 读取
const ModernTopThreeDisplay: React.FC<{ streamers?: StreamerInfo[] }> = ({ streamers }) => {
  const storeData = useCurrentMonthDataSelector();
  const source = (streamers && streamers.length > 0) ? streamers : storeData;
  const topThree = useMemo(() => source.slice(0, 3), [source]);

  return (
    <section className="modern-top-three top-three-grid grid grid-cols-1 sm:grid-cols-3 h-auto" style={{ maxHeight: '50%' }}>
      {topThree[1] && <Card streamer={topThree[1]} rank={2} />}
      {topThree[0] && <Card streamer={topThree[0]} rank={1} />}
      {topThree[2] && <Card streamer={topThree[2]} rank={3} />}
    </section>
  );
};

export default ModernTopThreeDisplay;