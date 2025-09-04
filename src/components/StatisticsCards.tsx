import React, { useMemo, useState, useEffect } from 'react';
import {
  TrendingUpIcon,
  StarIcon,
  FlameIcon
} from 'lucide-react';
import { useAppStore } from '../store';
import useResponsive from '../hooks/useResponsive';

// 动态数字展示组件
const AnimatedNumber: React.FC<{ 
  end: number; 
  duration?: number; 
  formatter?: (value: number) => string;
  suffix?: string;
}> = ({ end, duration = 1200, formatter, suffix }) => {
  const [current, setCurrent] = useState(0);
  
  useEffect(() => {
    if (end === 0) return;
    
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 使用缓动函数实现平滑动画
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const value = Math.round(end * easeOutQuart);
      
      setCurrent(value);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration]);
  
  const displayValue = formatter ? formatter(current) : current.toLocaleString();
  return (
    <span>
      {displayValue}
      {suffix && <span className="text-sm opacity-90 ml-1">{suffix}</span>}
    </span>
  );
};

// 数据大屏专用卡片组件
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  suffix?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  gradient: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  suffix, 
  trend, 
  trendValue, 
  gradient,
  delay = 0
}) => {
  const { isMobile } = useResponsive();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  const getTrendIcon = () => {
    if (trend === 'up') {
      return (
        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
        </svg>
      );
    }
    if (trend === 'down') {
      return (
        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14"></path>
      </svg>
    );
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-400';
    if (trend === 'down') return 'text-red-400';
    return 'text-gray-400';
  };
  
  const cardRef = React.useRef<HTMLDivElement>(null);
  
  // 数值格式化
  const numericValue = typeof value === 'number' ? value : parseInt(value.replace(/,/g, ''), 10) || 0;

  return (
    <div 
      ref={cardRef}
      className={`modern-stat-card group cursor-pointer transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        transitionDelay: `${delay}ms`
      }}
    >
      <div 
        className="glass-card-enhanced hover:scale-105 transition-all duration-300 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${gradient.replace(',', ' 0%, ')} 100%)`,
          borderRadius: 'clamp(12px, 2vw, 18px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            0 0 0 1px rgba(255, 255, 255, 0.1)
          `,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          height: isMobile ? 'clamp(100px, 12vh, 120px)' : 'clamp(120px, 15vh, 140px)',
          position: 'relative'
        }}
      >
        {/* 背景粒子效果 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-2 right-2 w-8 h-8 bg-white/10 rounded-full animate-pulse" />
          <div className="absolute bottom-3 left-3 w-6 h-6 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-white/8 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* 主内容区域 */}
        <div className="relative z-10 h-full flex flex-col justify-between p-4">
          {/* 标题和图标 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className="p-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                }}
              >
                <div className="text-white/90 group-hover:text-white transition-colors duration-300">
                  {icon}
                </div>
              </div>
              <div>
                <h3 
                  className="font-medium text-white/90 group-hover:text-white transition-all duration-300"
                  style={{ 
                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                    lineHeight: 1.2
                  }}
                >
                  {title}
                </h3>
              </div>
            </div>
            
            {/* 趋势指示器 */}
            {trend && (
              <div className="flex items-center space-x-1">
                {getTrendIcon()}
              </div>
            )}
          </div>
          
          {/* 数值展示区域 */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-white font-bold transition-all duration-300 group-hover:scale-105" style={{
              fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
              lineHeight: 1,
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
            }}>
              {isVisible && (
                <AnimatedNumber 
                  end={numericValue}
                  duration={1200}
                  suffix={suffix}
                />
              )}
            </div>
            
            {/* 趋势数据 */}
            {trendValue && isVisible && (
              <div className="mt-1 flex items-center space-x-1">
                <span 
                  className={`text-xs font-medium ${getTrendColor()}`}
                  style={{ 
                    fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)'
                  }}
                >
                  较上月 {trend === 'up' ? '+' : ''}
                  <AnimatedNumber 
                    end={Math.abs(trendValue)}
                    duration={800}
                    suffix="%"
                    formatter={(val) => val.toFixed(1)}
                  />
                </span>
              </div>
            )}
          </div>
          
          {/* 底部装饰线 */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>
        
        {/* 悬停时的发光效果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-inherit" />
      </div>
    </div>
  );
};

const StatisticsCards: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  const currentMonthData = useAppStore((state) => state.currentMonthData);
  const userSettings = useAppStore((state) => state.userSettings);

  const summary = useMemo(() => {
    if (!currentMonthData || currentMonthData.length === 0) {
      return null;
    }

    const totalGiftValue = currentMonthData.reduce((sum, streamer) => sum + (streamer.giftValue || 0), 0);
    const streamerCount = currentMonthData.length;
    const averageGiftValue = streamerCount > 0 ? Math.round(totalGiftValue / streamerCount) : 0;
    const qualifiedCount = currentMonthData.filter(streamer => 
      (streamer.giftValue || 0) >= userSettings.qualificationLine
    ).length;
    const qualificationRate = streamerCount > 0 ? Math.round((qualifiedCount / streamerCount) * 100 * 10) / 10 : 0;
    
    // 计算Top3占比
    const sortedStreamers = [...currentMonthData].sort((a, b) => (b.giftValue || 0) - (a.giftValue || 0));
    const top3Total = sortedStreamers.slice(0, 3).reduce((sum, streamer) => sum + (streamer.giftValue || 0), 0);
    const topThreePercentage = totalGiftValue > 0 ? Math.round((top3Total / totalGiftValue) * 100 * 10) / 10 : 0;

    return {
      totalGiftValue,
      streamerCount,
      averageGiftValue,
      qualifiedCount,
      qualificationRate,
      topThreePercentage
    };
  }, [currentMonthData, userSettings.qualificationLine]);

  if (!summary) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 h-20">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
              <div className="h-6 bg-white/20 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const statsConfig = [
    {
      title: '总礼物值',
      value: summary.totalGiftValue.toLocaleString(),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      gradient: 'rgba(59, 130, 246, 0.9), rgba(147, 197, 253, 0.8)',
      trend: 'up' as const,
      trendValue: 12.5,
      delay: 100
    },
    {
      title: '主播总数',
      value: summary.streamerCount,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      ),
      gradient: 'rgba(16, 185, 129, 0.9), rgba(110, 231, 183, 0.8)',
      trend: 'up' as const,
      trendValue: 8.3,
      delay: 200
    },
    {
      title: '平均礼物值',
      value: summary.averageGiftValue.toLocaleString(),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      ),
      gradient: 'rgba(245, 158, 11, 0.9), rgba(251, 191, 36, 0.8)',
      trend: 'stable' as const,
      delay: 300
    },
    {
      title: '达标人数',
      value: summary.qualifiedCount,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
        </svg>
      ),
      gradient: 'rgba(139, 92, 246, 0.9), rgba(196, 181, 253, 0.8)',
      trend: 'up' as const,
      trendValue: 15.2,
      delay: 400
    },
    {
      title: '达标率',
      value: summary.qualificationRate,
      suffix: '%',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      ),
      gradient: 'rgba(34, 197, 94, 0.9), rgba(134, 239, 172, 0.8)',
      trend: 'up' as const,
      trendValue: 5.7,
      delay: 500
    },
    {
      title: 'Top3占比',
      value: summary.topThreePercentage,
      suffix: '%',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
        </svg>
      ),
      gradient: 'rgba(239, 68, 68, 0.9), rgba(252, 165, 165, 0.8)',
      trend: 'down' as const,
      trendValue: -2.1,
      delay: 600
    }
  ];

  return (
    <div className="statistics-cards-container">
      <div className={`grid grid-cols-2 sm:grid-cols-3 ${isMobile ? 'gap-2' : 'gap-4'} h-full`}>
        {statsConfig.map((stat, index) => (
          <div key={index} className="h-full">
            <StatCard {...stat} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsCards;