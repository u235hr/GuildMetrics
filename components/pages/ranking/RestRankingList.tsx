import React, { useRef, useState, useEffect, ReactNode, MouseEventHandler, UIEvent } from 'react';
import { motion, useInView } from 'motion/react';

interface RankingItem {
  rank: number;
  name: string;
  coinAmount: number;
  monthOverMonth?: number; // 环比 (相对于上个月的变化百分比)
  yearOverYear?: number;   // 同比 (相对于去年同期的变化百分比)
  liveDuration?: number;   // 直播时长（小时）
}

interface AnimatedItemProps {
  children: ReactNode;
  delay?: number;
  index: number;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
  isAboveThreshold?: boolean;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({ 
  children, 
  delay = 0, 
  index, 
  onMouseEnter, 
  onClick,
  isAboveThreshold = false 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });
  
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      className="mb-2 cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

interface RestRankingListProps {
  items: RankingItem[];
  thresholdValue: number; // 币量门槛值
  liveDurationThreshold: number; // 直播时长门槛值（小时）
  onItemSelect?: (item: RankingItem, index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  className?: string;
  itemClassName?: string;
  displayScrollbar?: boolean;
  initialSelectedIndex?: number;
}

const RestRankingList: React.FC<RestRankingListProps> = ({
  items = [],
  thresholdValue,
  liveDurationThreshold,
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = '',
  itemClassName = '',
  displayScrollbar = true,
  initialSelectedIndex = -1
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState<boolean>(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState<number>(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState<number>(1);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLDivElement;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));
  };

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
      } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          if (onItemSelect) {
            onItemSelect(items[selectedIndex], selectedIndex);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement | null;
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
      } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: 'smooth'
        });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  // 找到门槛值的位置
  const thresholdIndex = items.findIndex(item => item.coinAmount < thresholdValue);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <style jsx>{`
        .force-scrollbar::-webkit-scrollbar {
          width: 8px !important;
          display: block !important;
        }
        .force-scrollbar::-webkit-scrollbar-track {
          background: #060010 !important;
        }
        .force-scrollbar::-webkit-scrollbar-thumb {
          background: #333 !important;
          border-radius: 4px !important;
        }
        .force-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555 !important;
        }
      `}</style>
      <div
        ref={listRef}
        className={`h-full ${
          displayScrollbar
            ? 'overflow-y-scroll force-scrollbar'
            : 'overflow-y-scroll [&::-webkit-scrollbar]:hidden'
        }`}
        onScroll={handleScroll}
        style={{
          scrollbarWidth: 'thin', // 始终显示滚动条
          scrollbarColor: displayScrollbar ? '#333 #060010' : 'transparent transparent',
          overflowY: 'scroll' // 始终显示滚动条
        }}
      >
        {/* 表头 - sticky定位，完全贴到RestRankingList顶部 */}
        <div className="sticky top-0 z-30 bg-[#060010] border-b-2 border-gray-600 shadow-lg h-16 flex items-center">
          <div className="grid grid-cols-7 gap-2 text-center font-bold text-white w-full text-sm p-4">
            <div className="flex items-center justify-center">名次</div>
            <div className="flex items-center justify-center">姓名</div>
            <div className="flex items-center justify-center">币量</div>
            <div className="flex items-center justify-center">环比</div>
            <div className="flex items-center justify-center">同比</div>
            <div className="flex items-center justify-center">直播时长</div>
            <div className="flex items-center justify-center">时长达标</div>
          </div>
        </div>

        {items.map((item, index) => {
          const isAboveThreshold = item.coinAmount >= thresholdValue;
          const isThresholdItem = thresholdIndex !== -1 && index === thresholdIndex;
          
          return (
            <div key={index}>
              {/* 门槛线 */}
              {isThresholdItem && (
                <div className="my-4 border-t-2 border-red-500 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    门槛值: {thresholdValue}
                  </div>
                </div>
              )}
              
              <AnimatedItem
                delay={0.1}
                index={index}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => {
                  setSelectedIndex(index);
                  if (onItemSelect) {
                    onItemSelect(item, index);
                  }
                }}
                isAboveThreshold={isAboveThreshold}
              >
                <div className={`
                  rounded-lg transition-all duration-200 min-h-16
                  ${selectedIndex === index 
                    ? 'bg-[#333] border-2 border-blue-500' 
                    : isAboveThreshold 
                      ? 'bg-[#1a1a1a] border border-green-500/30' 
                      : 'bg-[#111] border border-gray-600/30'
                  }
                  ${itemClassName}
                `}>
                  <div className="grid grid-cols-7 gap-2 text-center items-center p-4">
                    {/* 名次 */}
                    <div className="font-bold text-sm flex items-center justify-center text-white">
                      {item.rank}
                    </div>
                    
                    {/* 姓名 */}
                    <div className={`
                      font-medium text-sm flex items-center justify-center
                      ${isAboveThreshold ? 'text-white' : 'text-gray-300'}
                    `}>
                      {item.name}
                    </div>
                    
                    {/* 币量 */}
                    <div className={`
                      font-bold text-sm flex items-center justify-center
                      ${isAboveThreshold ? 'text-yellow-400' : 'text-gray-400'}
                    `}>
                      {item.coinAmount.toLocaleString()}
                    </div>
                    
                    {/* 环比 */}
                    <div className="font-medium text-sm flex items-center justify-center">
                      {item.monthOverMonth !== undefined ? (
                        item.monthOverMonth > 0 ? (
                          <img 
                            src="/medal-front/up.png" 
                            alt="增长" 
                            className="w-6 h-6"
                          />
                        ) : item.monthOverMonth < 0 ? (
                          <img 
                            src="/medal-front/down.png" 
                            alt="降低" 
                            className="w-6 h-6"
                          />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </div>
                    
                    {/* 同比 */}
                    <div className="font-medium text-sm flex items-center justify-center">
                      {item.yearOverYear !== undefined ? (
                        item.yearOverYear > 0 ? (
                          <img 
                            src="/medal-front/up.png" 
                            alt="增长" 
                            className="w-6 h-6"
                          />
                        ) : item.yearOverYear < 0 ? (
                          <img 
                            src="/medal-front/down.png" 
                            alt="降低" 
                            className="w-6 h-6"
                          />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </div>
                    
                    {/* 直播时长 */}
                    <div className="font-medium text-sm flex items-center justify-center">
                      {item.liveDuration !== undefined ? (
                        <span className="text-white">
                          {item.liveDuration.toFixed(1)}h
                        </span>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </div>
                    
                    {/* 时长达标 */}
                    <div className="flex items-center justify-center">
                      {item.liveDuration !== undefined && item.liveDuration >= liveDurationThreshold ? (
                        <img 
                          src="/medal-front/color.png" 
                          alt="合格" 
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedItem>
            </div>
          );
        })}
      </div>
      
      {showGradients && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-[50px] bg-gradient-to-b from-[#060010] to-transparent pointer-events-none transition-opacity duration-300 ease"
            style={{ opacity: topGradientOpacity }}
          ></div>
          <div
            className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-[#060010] to-transparent pointer-events-none transition-opacity duration-300 ease"
            style={{ opacity: bottomGradientOpacity }}
          ></div>
        </>
      )}
    </div>
  );
};

export default RestRankingList;
