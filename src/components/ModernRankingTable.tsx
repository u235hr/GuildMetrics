'use client';

import React, { useMemo, useCallback } from 'react';
import { Search, Trophy, Crown, Medal, Flame, Zap, TrendingUp } from 'lucide-react';

import { useCurrentMonthDataSelector, useSearchKeywordSelector, useSelectedRankRangeSelector, useShowOnlyQualifiedSelector, filterStreamers, useAppStore } from '../store';
import type { StreamerInfo } from '../types';
import { cn } from '@/lib/utils';
import useResponsive from '../hooks/useResponsive';

/**
 * 智能文本处理Hook - 专为排行榜优化
 * 解决表格内元素被外框遮挡的问题
 */
const useRankingTextProcessing = () => {
  // 稳定的数字千分位格式化（与运行环境无关，避免 SSR/CSR 不一致）
  const formatNumber = useCallback((n: number): string => {
    if (!Number.isFinite(n)) return '0';
    const sign = n < 0 ? '-' : '';
    const s = Math.floor(Math.abs(n)).toString();
    return sign + s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }, []);

  // 智能数值格式化 - 专为表格优化
  const formatGiftValue = useCallback((value: number, showCurrency = true): string => {
    if (!value) return showCurrency ? '￥0' : '0';
    const prefix = showCurrency ? '￥' : '';
    if (value >= 10000000) {
      return `${prefix}${(value / 10000000).toFixed(1)}千万`;
    } else if (value >= 1000000) {
      return `${prefix}${(value / 10000).toFixed(0)}万`;
    } else if (value >= 10000) {
      return `${prefix}${(value / 10000).toFixed(1)}万`;
    } else if (value >= 1000) {
      return `${prefix}${(value / 1000).toFixed(1)}K`;
    } else {
      return `${prefix}${formatNumber(value)}`;
    }
  }, [formatNumber]);

  const formatStreamerName = useCallback((name: string, maxLength = 12): string => {
    if (!name) return '';
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength - 1) + '…';
  }, []);

  const formatStreamerId = useCallback((id: string): string => {
    if (!id) return '';
    if (id.length > 8) return `ID: ${id.substring(0, 6)}…`;
    return `ID: ${id}`;
  }, []);

  return { formatNumber, formatGiftValue, formatStreamerName, formatStreamerId };
};

// 排名徽章组件（不使用 div/span/p/第三方 Badge）
const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
  const getRankConfig = (rank: number) => {
    if (rank === 1) {
      return { icon: Crown, className: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0' };
    } else if (rank === 2) {
      return { icon: Trophy, className: 'bg-gradient-to-r from-gray-300 to-slate-400 text-white border-0' };
    } else if (rank === 3) {
      return { icon: Medal, className: 'bg-gradient-to-r from-orange-400 to-amber-600 text-white border-0' };
    } else if (rank <= 10) {
      return { icon: Flame, className: 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-0' };
    } else {
      return { icon: Zap, className: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0' };
    }
  };
  const config = getRankConfig(rank);
  const IconComponent = config.icon;
  return (
    <mark className={cn('inline-flex items-center gap-1 px-[0.75rem] py-[0.25rem] text-sm font-bold transition-all duration-300  rounded', config.className)}>
      <IconComponent className="w-4 h-4" />
      <strong>{rank}</strong>
    </mark>
  );
};

// 等级标签组件
// const LevelTag: React.FC<{ level: string }> = ({ level }) => {
//   const getLevelConfig = (level: string) => {
//     switch (level) {
//       case 'TOP3':
//         return { variant: 'default' as const, className: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0' };
//       case 'HIGH':
//         return { variant: 'destructive' as const, className: 'bg-gradient-to-r from-red-500 to-orange-500 text-white border-0' };
//       case 'MEDIUM':
//         return { variant: 'secondary' as const, className: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0' };
//       case 'LOW':
//         return { variant: 'outline' as const, className: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0' };
//       default:
//         return { variant: 'outline' as const, className: '' };
//     }
//   };
//   const config = getLevelConfig(level);
//   return <Badge variant={config.variant} className={config.className}>{level === 'TOP3' ? '顶级' : level === 'HIGH' ? '高级' : level === 'MEDIUM' ? '中级' : '初级'}</Badge>;
// };

const ModernRankingTable: React.FC = () => {
  const currentMonthData = useCurrentMonthDataSelector();
  const searchKeyword = useSearchKeywordSelector();
  const selectedRankRange = useSelectedRankRangeSelector();
  const showOnlyQualified = useShowOnlyQualifiedSelector();
  const { setSearchKeyword } = useAppStore();
  const { formatNumber, formatStreamerName, formatStreamerId } = useRankingTextProcessing();

  // 排行榜从第4名开始显示（前3名在月度之星中展示）
  const rankedData = currentMonthData.slice(3);

  const memoizedStreamers = useMemo(() => {
    return filterStreamers(rankedData, searchKeyword || '', selectedRankRange, showOnlyQualified);
  }, [rankedData, searchKeyword, selectedRankRange, showOnlyQualified]);

  // 直接渲染全部过滤后的数据，通过容器 overflow-y:auto 滚动
  const handleSearch = (value: string) => {
    setSearchKeyword(value);
  };

  // 获取行样式 - 简化设计
  const getRowClassName = (record: StreamerInfo) => {
    const baseClass = 'table-row';
    if (record.rank === 1) return `${baseClass} rank-1`;
    if (record.rank === 2) return `${baseClass} rank-2`;
    if (record.rank === 3) return `${baseClass} rank-3`;
    if (record.rank <= 10) return `${baseClass} top-ten-row`;
    return baseClass;
  };

  // 千分位数值（无货币、无单位）
  const formatGift = useCallback((value: number): string => {
    if (!value) return '0';
    return formatNumber(value);
  }, [formatNumber]);

  return (
    <section className="modern-ranking-container">
      {/* 头部区域 - 完全自适应 */}
      <header className="ranking-header-section">
        <section className="ranking-header-content">
          <hgroup className="ranking-title-group">
            <figure className="ranking-icon-wrapper">
              <Trophy className="text-white" style={{ width: 'clamp(1.25rem, 4vw, 1.5rem)', height: 'clamp(1.25rem, 4vw, 1.5rem)' }} />
            </figure>
            <header>
              <h2 className="ranking-main-title">主播排行榜</h2>
              <small className="ranking-subtitle">实时更新的主播礼物值排名</small>
            </header>
          </hgroup>

          {/* 搜索框 - 智能自适应 */}
          <form className="ranking-search-wrapper" role="search">
            <Search className="ranking-search-icon" />
            <input
              type="text"
              placeholder="搜索主播..."
              value={searchKeyword || ''}
              onChange={(e) => handleSearch(e.target.value)}
              className="ranking-search-input"
              aria-label="搜索主播"
            />
          </form>

          {/* 统计信息 - 自适应布局 */}
          <ul className="ranking-stats" role="list">
            <li className="ranking-stats-item">
              <i className="ranking-status-dot" aria-hidden="true"></i>
              实时同步
            </li>
            <li>共 {memoizedStreamers.length} 位主播</li>
            <li>从第 4 名开始，支持滚动查看</li>
          </ul>
        </section>
      </header>

      {/* 表格内容区域 - 可滚动，防溢出 */}
      <section className="ranking-table-section">
        <section className="ranking-table-container">
          <table className="ranking-table">
            <thead className="ranking-table-header">
              <tr className="ranking-header-grid">
                <th className="ranking-header-cell center">排名</th>
                <th className="ranking-header-cell">主播</th>
                <th className="ranking-header-cell right">礼物值</th>
                <th className="ranking-header-cell right">增长率</th>
              </tr>
            </thead>
            <tbody className="ranking-table-body">
              {memoizedStreamers.map((streamer) => (
                <tr key={streamer.id} className={getRowClassName(streamer)}>
                  <td className="ranking-table-cell center">
                    <RankBadge rank={streamer.rank} />
                  </td>
                  <td className="ranking-table-cell">
                    <figure className="streamer-info-row">
                      <strong className="streamer-avatar-small">{streamer.name.charAt(0)}</strong>
                      <figcaption className="streamer-details">
                        <h4 className="streamer-name-cell" title={streamer.name}>{formatStreamerName(streamer.name)}</h4>
                        <small className="streamer-id-cell">{formatStreamerId(streamer.id)}</small>
                      </figcaption>
                    </figure>
                  </td>
                  <td className="ranking-table-cell right">
                    <output className="gift-value-cell" title={`礼物值: ${formatNumber(streamer.giftValue)}`}>{formatGift(streamer.giftValue)}</output>
                  </td>
                  <td className="ranking-table-cell right">
                    <data className="growth-rate-cell" value="12.5">
                      <TrendingUp className="growth-icon text-green-400" />
                      +12.5%
                    </data>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>
    </section>
  );
};

export default ModernRankingTable;