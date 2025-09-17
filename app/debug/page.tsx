'use client';

import { useState } from 'react';
import TiltedGoldCard from '@/components/pages/ranking/TiltedGoldCard';
import TiltedSilverCard from '@/components/pages/ranking/TiltedSilverCard';
import TiltedBronzeCard from '@/components/pages/ranking/TiltedBronzeCard';
import { WarpBackground } from '@/components/ui/warp-background';
import ElectricBorder from '@/components/ElectricBorder';

// 调试用的模拟数据
const debugData = {
  gold: { 
    name: '金牌得主', 
    value: '1,234,567', 
    avatar: '/avatars/外国女人头像1_未抠图.jpeg' 
  },
  silver: { 
    name: '银牌得主', 
    value: '987,654', 
    avatar: '/avatars/外国女人头像3_未抠图.jpg' 
  },
  bronze: { 
    name: '铜牌得主', 
    value: '456,789', 
    avatar: '/avatars/外国女人头像2_未抠图.jpg' 
  }
};

export default function DebugPage() {
  const [selectedComponent, setSelectedComponent] = useState('gold');
  const [showWarpBackground, setShowWarpBackground] = useState(false);
  const [cardProps, setCardProps] = useState({
    containerHeight: "20vh",
    containerWidth: "20vh",
    imageHeight: "20vh",
    imageWidth: "20vh",
    rotateAmplitude: 14,
    scaleOnHover: 1.25,
    showMobileWarning: false,
    showTooltip: false,
    displayOverlayContent: true,
    showExpandedCard: true,
    goldCanExpand: true
  });

  const renderSelectedComponent = () => {
    const commonProps = {
      ...cardProps,
      imageSrc: debugData[selectedComponent as keyof typeof debugData].avatar,
      altText: debugData[selectedComponent as keyof typeof debugData].name,
      captionText: debugData[selectedComponent as keyof typeof debugData].name,
      overlayContent: (
        <p style={{
          textTransform: 'capitalize',
          color: '#fff',
          letterSpacing: '-0.5px',
          background: '#0006',
          borderRadius: '1.5vh',
          margin: '1vh',
          padding: '0.5vh 1vh',
          fontFamily: 'AlibabaPuHuiTi-3-55-Regular',
          fontWeight: 900,
          fontSize: '2vh',
          boxShadow: '0 0.5vh 3vh #06001059',
          position: 'absolute',
          top: 0,
          left: 0,
          whiteSpace: 'nowrap',
          width: 'max-content',
          minWidth: 'fit-content'
        }}>
          {debugData[selectedComponent as keyof typeof debugData].name}
        </p>
      )
    };

    switch (selectedComponent) {
      case 'gold':
        return (
          <TiltedGoldCard
            {...commonProps}
            expandedCardData={{
              name: debugData.gold.name,
              score: parseInt(debugData.gold.value.replace(/,/g, '')) || 0,
              rank: 1,
              avatar: debugData.gold.avatar
            }}
          />
        );
      case 'silver':
        return <TiltedSilverCard {...commonProps} />;
      case 'bronze':
        return <TiltedBronzeCard {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">组件调试页面</h1>
        
        {/* 控制面板 */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">调试控制</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 组件选择 */}
            <div>
              <label className="block text-sm font-medium mb-2">选择组件:</label>
              <select 
                value={selectedComponent} 
                onChange={(e) => setSelectedComponent(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600"
              >
                <option value="gold">金牌卡片</option>
                <option value="silver">银牌卡片</option>
                <option value="bronze">铜牌卡片</option>
              </select>
            </div>

            {/* 背景控制 */}
            <div>
              <label className="block text-sm font-medium mb-2">背景效果:</label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showWarpBackground}
                  onChange={(e) => setShowWarpBackground(e.target.checked)}
                  className="mr-2"
                />
                WarpBackground
              </label>
            </div>

            {/* 卡片尺寸 */}
            <div>
              <label className="block text-sm font-medium mb-2">卡片尺寸:</label>
              <select 
                value={cardProps.containerHeight} 
                onChange={(e) => setCardProps({...cardProps, containerHeight: e.target.value, containerWidth: e.target.value, imageHeight: e.target.value, imageWidth: e.target.value})}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600"
              >
                <option value="15vh">小 (15vh)</option>
                <option value="20vh">中 (20vh)</option>
                <option value="25vh">大 (25vh)</option>
                <option value="30vh">超大 (30vh)</option>
              </select>
            </div>

            {/* 旋转幅度 */}
            <div>
              <label className="block text-sm font-medium mb-2">旋转幅度:</label>
              <input
                type="range"
                min="0"
                max="30"
                value={cardProps.rotateAmplitude}
                onChange={(e) => setCardProps({...cardProps, rotateAmplitude: parseInt(e.target.value)})}
                className="w-full"
              />
              <span className="text-sm text-gray-400">{cardProps.rotateAmplitude}°</span>
            </div>

            {/* 悬停缩放 */}
            <div>
              <label className="block text-sm font-medium mb-2">悬停缩放:</label>
              <input
                type="range"
                min="1"
                max="2"
                step="0.1"
                value={cardProps.scaleOnHover}
                onChange={(e) => setCardProps({...cardProps, scaleOnHover: parseFloat(e.target.value)})}
                className="w-full"
              />
              <span className="text-sm text-gray-400">{cardProps.scaleOnHover}x</span>
            </div>

            {/* 展开功能 */}
            <div>
              <label className="block text-sm font-medium mb-2">展开功能:</label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={cardProps.goldCanExpand}
                  onChange={(e) => setCardProps({...cardProps, goldCanExpand: e.target.checked})}
                  className="mr-2"
                />
                允许展开
              </label>
            </div>
          </div>
        </div>

        {/* 组件预览区域 */}
        <div className="bg-gray-900 p-8 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">组件预览</h2>
          
          <div className="flex justify-center items-center min-h-[400px]">
            {showWarpBackground ? (
              <WarpBackground 
                className="w-full h-full overflow-hidden p-0 rounded-none border-0"
                perspective={100}
                beamsPerSide={4}
                beamSize={8}
                beamDelayMax={2}
                beamDelayMin={0}
                beamDuration={4}
                gridColor="rgba(255, 215, 0, 0.3)"
                enabled={true}
              >
                <div className="flex justify-center items-center h-full">
                  {renderSelectedComponent()}
                </div>
              </WarpBackground>
            ) : (
              <div className="flex justify-center items-center h-full">
                {renderSelectedComponent()}
              </div>
            )}
          </div>
        </div>

        {/* 属性显示 */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">当前属性</h2>
          <pre className="text-sm text-gray-300 overflow-auto">
            {JSON.stringify(cardProps, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
