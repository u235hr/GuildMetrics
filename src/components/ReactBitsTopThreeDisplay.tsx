'use client';

import { memo, useMemo, useLayoutEffect, useRef, useState } from 'react';
import ReactBitsProfileCard from './ReactBitsProfileCard';

type RankItem = {
  rank: number;
  name: string;
  amount: number;
  avatar: string;
};

type ReactBitsTopThreeDisplayProps = {
  data: RankItem[];
};

const ReactBitsTopThreeDisplay = memo(function ReactBitsTopThreeDisplay({ data }: ReactBitsTopThreeDisplayProps) {
  const sortedData = useMemo(() => [
    data.find(item => item.rank === 2),
    data.find(item => item.rank === 1),
    data.find(item => item.rank === 3)
  ].filter(Boolean) as RankItem[], [data]);

  // 父容器与金卡容器 refs
  const containerRef = useRef<HTMLDivElement | null>(null);
  const goldRef = useRef<HTMLDivElement | null>(null);
  const silverRef = useRef<HTMLDivElement | null>(null);
  const bronzeRef = useRef<HTMLDivElement | null>(null);

  // 以金卡底边为基准的bottom像素；以及铜卡需要的left像素（相对父容器）
  const [alignedBottomPx, setAlignedBottomPx] = useState<number | null>(null);
  const [bronzeLeftPx, setBronzeLeftPx] = useState<number | null>(null);

  useLayoutEffect(() => {
    const updateAlignment = () => {
      const container = containerRef.current;
      const gold = goldRef.current;
      const silver = silverRef.current;
      const bronze = bronzeRef.current;
      if (!container || !gold) return;

      const containerRect = container.getBoundingClientRect();
      const goldRect = gold.getBoundingClientRect();

      // 绝对基准：金卡底边相对父容器的bottom像素值
      const bottomPx = Math.max(0, Math.round(containerRect.bottom - goldRect.bottom));
      setAlignedBottomPx(bottomPx);

      // 保持银-金的当前水平间距，并把相同间距应用到金-铜之间（仅调整铜卡水平位置）
      if (silver && bronze) {
        const silverRect = silver.getBoundingClientRect();
        const bronzeRect = bronze.getBoundingClientRect();
        const gapPx = Math.max(0, Math.round(goldRect.left - silverRect.right));
        // 由于铜卡容器带有 -translate-x-1/2，left 表示其中心x。
        const bronzeCenterLeft = goldRect.right + gapPx + bronzeRect.width / 2;
        const bronzeLeftRelative = Math.round(bronzeCenterLeft - containerRect.left);
        setBronzeLeftPx(bronzeLeftRelative);
      }
    };

    updateAlignment();
    window.addEventListener('resize', updateAlignment);
    return () => window.removeEventListener('resize', updateAlignment);
  }, []);

  return (
    <div
      data-testid="react-bits-top-three"
      className="w-full h-full relative overflow-hidden"
      ref={containerRef}
    >
      <div className="w-full h-full relative">
        {/* 金卡 - 完全居中（不可移动） */}
        <div
          ref={goldRef}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <ReactBitsProfileCard
            item={sortedData[1]}
            index={1}
          />
        </div>

        {/* 银卡 - 左半空间水平居中，底边对齐金卡，保持当前与金卡的水平距离（不动） */}
        <div
          ref={silverRef}
          className="absolute left-1/4 transform -translate-x-1/2"
          style={alignedBottomPx != null ? { bottom: `${alignedBottomPx}px` } : undefined}
        >
          <ReactBitsProfileCard
            item={sortedData[0]}
            index={0}
          />
        </div>

        {/* 铜卡 - 右侧，底边对齐金卡，上下不动；水平位置=金卡右边+银金间距+自身半宽 */}
        <div
          ref={bronzeRef}
          className="absolute left-3/4 transform -translate-x-1/2"
          style={{ bottom: alignedBottomPx != null ? `${alignedBottomPx}px` : undefined, left: bronzeLeftPx != null ? `${bronzeLeftPx}px` : undefined }}
        >
          <ReactBitsProfileCard
            item={sortedData[2]}
            index={2}
          />
        </div>
      </div>

      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* 渐变背景圆圈 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-400/10 via-gray-400/10 to-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-pink-500/5 to-red-500/5 rounded-full blur-2xl" />
      </div>
    </div>
  );
});

export default ReactBitsTopThreeDisplay;
