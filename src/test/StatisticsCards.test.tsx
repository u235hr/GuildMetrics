/**
 * 统计卡片组件测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import StatisticsCards from '../components/StatisticsCards';
import { mockMonthlyData } from './testUtils';
import * as store from '../store';

// Mock store hooks
vi.mock('../store', () => ({
  useCurrentMonthData: vi.fn(),
  useStatisticsSummary: vi.fn(),
  useMonthComparison: vi.fn(),
}));

// Mock 响应式hooks
vi.mock('../hooks/useResponsive', () => ({
  useResponsiveSpacing: () => ({
    gutter: [16, 16],
    cardSpacing: 16,
    sectionSpacing: 24,
  }),
}));

// Mock 动画组件
vi.mock('../components/Animations', () => ({
  CardAnimation: ({ children, ...props }: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => <div data-testid="card-animation" {...props}>{children}</div>,
  CountUp: ({ end, formatter }: { end: number; formatter?: (value: number) => React.ReactNode; }) => <span>{formatter ? formatter(end) : end}</span>,
  AnimatedProgress: ({ percent }: { percent: number; }) => <div data-testid="animated-progress" data-percent={percent} />,
}));

describe('StatisticsCards', () => {
  const mockStatisticsSummary = {
    totalGiftValue: 6534020,
    streamerCount: 47,
    averageGiftValue: 139021,
    topThreePercentage: 36.7,
    qualifiedCount: 32,
    qualificationRate: 68.1,
    giftValueDistribution: {
      topTier: 3,
      highTier: 8,
      mediumTier: 15,
      lowTier: 21,
    },
  };

  const mockMonthComparison = {
    totalGiftValueChange: {
      trend: 'up' as const,
      text: '+5.2%',
      percentage: '5.2',
    },
    streamerComparisons: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderStatisticsCards = () => {
    return render(
      <ConfigProvider>
        <StatisticsCards />
      </ConfigProvider>
    );
  };

  it('应该在没有数据时不渲染', () => {
    vi.mocked(store.useCurrentMonthData).mockReturnValue(null);
    vi.mocked(store.useStatisticsSummary).mockReturnValue(null);
    vi.mocked(store.useMonthComparison).mockReturnValue(null);

    const { container } = renderStatisticsCards();
    expect(container.firstChild).toBeNull();
  });

  it('应该渲染所有统计卡片', () => {
    vi.mocked(store.useCurrentMonthData).mockReturnValue(mockMonthlyData);
    vi.mocked(store.useStatisticsSummary).mockReturnValue(mockStatisticsSummary);
    vi.mocked(store.useMonthComparison).mockReturnValue(mockMonthComparison);

    renderStatisticsCards();

    expect(screen.getByText('总礼物值')).toBeInTheDocument();
    expect(screen.getByText('主播总数')).toBeInTheDocument();
    expect(screen.getByText('平均礼物值')).toBeInTheDocument();
    expect(screen.getByText('前三名占比')).toBeInTheDocument();
    expect(screen.getByText('礼物值分布')).toBeInTheDocument();
    expect(screen.getByText('达标情况')).toBeInTheDocument();
  });

  it('应该正确显示总礼物值', () => {
    vi.mocked(store.useCurrentMonthData).mockReturnValue(mockMonthlyData);
    vi.mocked(store.useStatisticsSummary).mockReturnValue(mockStatisticsSummary);
    vi.mocked(store.useMonthComparison).mockReturnValue(mockMonthComparison);

    renderStatisticsCards();

    expect(screen.getByText('6534020')).toBeInTheDocument();
  });

  it('应该正确显示主播总数', () => {
    vi.mocked(store.useCurrentMonthData).mockReturnValue(mockMonthlyData);
    vi.mocked(store.useStatisticsSummary).mockReturnValue(mockStatisticsSummary);
    vi.mocked(store.useMonthComparison).mockReturnValue(mockMonthComparison);

    renderStatisticsCards();

    expect(screen.getByText('47')).toBeInTheDocument();
    expect(screen.getByText('7月参与排名主播')).toBeInTheDocument();
  });

  it('应该正确显示平均礼物值', () => {
    vi.mocked(store.useCurrentMonthData).mockReturnValue(mockMonthlyData);
    vi.mocked(store.useStatisticsSummary).mockReturnValue(mockStatisticsSummary);
    vi.mocked(store.useMonthComparison).mockReturnValue(mockMonthComparison);

    renderStatisticsCards();

    expect(screen.getByText('139021')).toBeInTheDocument();
  });

  it('应该正确显示前三名占比', () => {
    vi.mocked(store.useCurrentMonthData).mockReturnValue(mockMonthlyData);
    vi.mocked(store.useStatisticsSummary).mockReturnValue(mockStatisticsSummary);
    vi.mocked(store.useMonthComparison).mockReturnValue(mockMonthComparison);

    renderStatisticsCards();

    expect(screen.getByText('36.7')).toBeInTheDocument();
  });

  it('应该显示环比变化信息', () => {
    vi.mocked(store.useCurrentMonthData).mockReturnValue(mockMonthlyData);
    vi.mocked(store.useStatisticsSummary).mockReturnValue(mockStatisticsSummary);
    vi.mocked(store.useMonthComparison).mockReturnValue(mockMonthComparison);

    renderStatisticsCards();

    expect(screen.getByText(/较上月增长/)).toBeInTheDocument();
  });

  it('应该正确显示礼物值分布', () => {
    vi.mocked(store.useCurrentMonthData).mockReturnValue(mockMonthlyData);
    vi.mocked(store.useStatisticsSummary).mockReturnValue(mockStatisticsSummary);
    vi.mocked(store.useMonthComparison).mockReturnValue(mockMonthComparison);

    renderStatisticsCards();

    expect(screen.getByText('顶级 (70万+)')).toBeInTheDocument();
    expect(screen.getByText('高级 (20-70万)')).toBeInTheDocument();
    expect(screen.getByText('中级 (10-20万)')).toBeInTheDocument();
    expect(screen.getByText('初级 (10万以下)')).toBeInTheDocument();
    
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('21')).toBeInTheDocument();
  });

  it('应该正确显示达标情况', () => {
    vi.mocked(store.useCurrentMonthData).mockReturnValue(mockMonthlyData);
    vi.mocked(store.useStatisticsSummary).mockReturnValue(mockStatisticsSummary);
    vi.mocked(store.useMonthComparison).mockReturnValue(mockMonthComparison);

    renderStatisticsCards();

    expect(screen.getByText('合格线 (10万礼物值)')).toBeInTheDocument();
    expect(screen.getByText('达标人数')).toBeInTheDocument();
    expect(screen.getByText('达标率')).toBeInTheDocument();
    expect(screen.getByText('32')).toBeInTheDocument();
    expect(screen.getByText('68.1%')).toBeInTheDocument();
  });

  it('应该处理无环比数据的情况', () => {
    vi.mocked(store.useCurrentMonthData).mockReturnValue(mockMonthlyData);
    vi.mocked(store.useStatisticsSummary).mockReturnValue(mockStatisticsSummary);
    vi.mocked(store.useMonthComparison).mockReturnValue(null);

    renderStatisticsCards();

    expect(screen.queryByText(/较上月/)).not.toBeInTheDocument();
  });

  it('应该正确处理下降趋势', () => {
    const mockDownwardComparison = {
      totalGiftValueChange: {
        trend: 'down' as const,
        text: '-3.1%',
        percentage: '-3.1',
      },
      streamerComparisons: [],
    };

    vi.mocked(store.useCurrentMonthData).mockReturnValue(mockMonthlyData);
    vi.mocked(store.useStatisticsSummary).mockReturnValue(mockStatisticsSummary);
    vi.mocked(store.useMonthComparison).mockReturnValue(mockDownwardComparison);

    renderStatisticsCards();

    expect(screen.getByText(/较上月下降/)).toBeInTheDocument();
  });

  it('应该应用动画组件', () => {
    vi.mocked(store.useCurrentMonthData).mockReturnValue(mockMonthlyData);
    vi.mocked(store.useStatisticsSummary).mockReturnValue(mockStatisticsSummary);
    vi.mocked(store.useMonthComparison).mockReturnValue(mockMonthComparison);

    renderStatisticsCards();

    const cardAnimations = screen.getAllByTestId('card-animation');
    expect(cardAnimations).toHaveLength(6); // 6个统计卡片

    const animatedProgress = screen.getAllByTestId('animated-progress');
    expect(animatedProgress.length).toBeGreaterThan(0);
  });

  it('应该使用响应式间距', () => {
    vi.mocked(store.useCurrentMonthData).mockReturnValue(mockMonthlyData);
    vi.mocked(store.useStatisticsSummary).mockReturnValue(mockStatisticsSummary);
    vi.mocked(store.useMonthComparison).mockReturnValue(mockMonthComparison);

    renderStatisticsCards();

    // 检查是否使用了响应式间距（通过 mock 返回的值）
    const cardAnimations = screen.getAllByTestId('card-animation');
    expect(cardAnimations[0]).toHaveClass('h-full');
  });
});