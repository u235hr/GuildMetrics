
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Card, Table, Tag, Avatar, Input, Badge, Tooltip } from 'antd';
import { CrownOutlined, TrophyOutlined, StarOutlined, FireOutlined, ThunderboltOutlined, RiseOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useCurrentMonthDataSelector, useSearchKeywordSelector, useSelectedRankRangeSelector, useShowOnlyQualifiedSelector, filterStreamers, useAppStore } from '../store';
import type { StreamerInfo } from '../types';
import { designSystem } from '../styles/design-system';
// import { RankingAnimation } from './Animations';
import useResponsive from '../hooks/useResponsive';

const { Search } = Input;

// 排名徽章组件
const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
  const getRankConfig = (rank: number) => {
    if (rank === 1) {
      return {
        icon: <CrownOutlined className="text-yellow-400" />,
        color: 'gold',
        className: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg shadow-yellow-400/30',
        text: '冠军'
      };
    } else if (rank === 2) {
      return {
        icon: <TrophyOutlined className="text-gray-300" />,
        color: 'silver',
        className: 'bg-gradient-to-r from-gray-300 to-slate-400 text-white shadow-lg shadow-gray-400/30',
        text: '亚军'
      };
    } else if (rank === 3) {
      return {
        icon: <StarOutlined className="text-orange-400" />,
        color: 'bronze',
        className: 'bg-gradient-to-r from-orange-400 to-amber-600 text-white shadow-lg shadow-orange-400/30',
        text: '季军'
      };
    } else if (rank <= 10) {
      return {
        icon: null,
        color: 'red',
        className: 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md shadow-red-400/20',
        text: `${rank}`
      };
    } else {
      return {
        icon: null,
        color: 'blue',
        className: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-400/20',
        text: `${rank}`
      };
    }
  };

  const config = getRankConfig(rank);
  
  return (
    <Tooltip title={config.text}>
      <div className={`inline-flex items-center gap-1 px-[0.75rem] py-[0.25rem] rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 ${config.className}`}>
        {config.icon && config.icon}
        <span>{rank}</span>
      </div>
    </Tooltip>
  );
};

// 等级标签组件
const LevelTag: React.FC<{ level: string }> = ({ level }) => {
  const getLevelConfig = (level: string) => {
    switch (level) {
      case 'TOP3':
        return { color: 'gold', text: 'TOP3', className: 'bg-gradient-to-r from-yellow-400 to-amber-500' };
      case 'HIGH':
        return { color: 'red', text: '高级', className: 'bg-gradient-to-r from-red-500 to-pink-500' };
      case 'MEDIUM':
        return { color: 'blue', text: '中级', className: 'bg-gradient-to-r from-blue-500 to-indigo-500' };
      case 'LOW':
        return { color: 'default', text: '初级', className: 'bg-gradient-to-r from-gray-400 to-slate-500' };
      default:
        return { color: 'default', text: level, className: 'bg-gradient-to-r from-gray-400 to-slate-500' };
    }
  };

  const config = getLevelConfig(level);
  
  return (
    <div className={`inline-flex items-center px-[0.5rem] py-[0.25rem] rounded-full text-xs font-medium text-white shadow-md transition-all duration-300 hover:scale-105 ${config.className}`}>
      {config.text}
    </div>
  );
};

// 简化的列定义，去掉多余的表头
const simpleColumns: ColumnsType<StreamerInfo> = [
  { 
    title: '排名', 
    dataIndex: 'rank', 
    key: 'rank', 
    width: 'clamp(4rem, 12vw, 6rem)', 
    render: (rank) => <RankBadge rank={rank} />
  },
  { 
    title: '主播', 
    dataIndex: 'name', 
    key: 'name', 
    render: (name, record) => (
      <div className="flex items-center gap-2">
        <Avatar 
          size={'small'}
          src={record.avatar || `https://api.dicebear.com/8.x/avataaars/svg?seed=${name}`} 
        />
        <span className="font-medium text-gray-800">{name}</span>
      </div>
    )
  },
  { 
    title: '礼物值', 
    dataIndex: 'giftValue', 
    key: 'giftValue', 
    render: (value) => (
      <span className="font-semibold text-gray-800">{value.toLocaleString()}</span>
    )
  }
];

const RankingTable: React.FC = () => {
  const currentMonthData = useCurrentMonthDataSelector();
  const { isMobile, isTablet } = useResponsive();

  // 获取除前三名外的其他主播数据
  const memoizedStreamers = useMemo(() => {
    const allStreamers = filterStreamers(currentMonthData, '', [1, 1000], false);
    // 显示第4名及以后的主播，确保有足够数据触发滚动
    const remainingStreamers = allStreamers.filter(streamer => streamer.rank > 3);
    
    // 如果数据不够多，复制一些数据来测试滚动功能
    if (remainingStreamers.length < 15) {
      const duplicatedData = [];
      for (let i = 0; i < Math.max(20, remainingStreamers.length); i++) {
        const originalIndex = i % remainingStreamers.length;
        if (remainingStreamers[originalIndex]) {
          duplicatedData.push({
            ...remainingStreamers[originalIndex],
            id: `${remainingStreamers[originalIndex].id}_dup_${i}`,
            rank: remainingStreamers[originalIndex].rank + i
          });
        }
      }
      return duplicatedData;
    }
    
    return remainingStreamers;
  }, [currentMonthData]);



  // 自定义表格行样式
  const getRowClassName = (record: StreamerInfo, index: number) => {
    const baseClass = 'table-row';
    
    if (record.rank === 1) {
      return `${baseClass} rank-1`;
    } else if (record.rank === 2) {
      return `${baseClass} rank-2`;
    } else if (record.rank === 3) {
      return `${baseClass} rank-3`;
    }
    
    return baseClass;
  };

  return (
    <div className="ranking-table-container">
      {/* 排行榜标题 */}
      <div className="ranking-header">
        <div className="ranking-header-content">
          <TrophyOutlined className="ranking-icon" />
          <h3 className="ranking-title">排行榜（第4名及以后）</h3>
          <div className="ranking-count">
            {memoizedStreamers.length} 人
          </div>
        </div>
      </div>

      {/* 排行榜内容 - 可滚动区域 */}
      <div className="ranking-content">
        {/* 表头 - 固定不滚动 */}
        <div className="ranking-table-header">
          <div className="ranking-table-header-cell rank-column">排名</div>
          <div className="ranking-table-header-cell name-column">主播</div>
          <div className="ranking-table-header-cell gift-column">礼物值</div>
        </div>
        
        {/* 表格体 - 可滚动 */}
        <div className="ranking-table-body">
          {memoizedStreamers.map((streamer, index) => (
            <div key={streamer.id} className={`ranking-table-row ${getRowClassName(streamer, index)}`}>
              <div className="ranking-table-cell rank-column">
                <RankBadge rank={streamer.rank} />
              </div>
              <div className="ranking-table-cell name-column">
                <div className="streamer-info">
                  <Avatar 
                    size={isMobile ? 'small' : 'default'}
                    src={streamer.avatar || `https://api.dicebear.com/8.x/avataaars/svg?seed=${streamer.name}`} 
                  />
                  <span className="streamer-name">{streamer.name}</span>
                </div>
              </div>
              <div className="ranking-table-cell gift-column">
                <span className="gift-value">{streamer.giftValue.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RankingTable;
