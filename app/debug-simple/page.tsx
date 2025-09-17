'use client';

import TiltedGoldCard from '@/components/pages/ranking/TiltedGoldCard';
import ComponentDebugger from '@/components/debug/ComponentDebugger';

export default function SimpleDebugPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
      <ComponentDebugger
        componentName="TiltedGoldCard"
        defaultProps={{
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
        }}
        propControls={[
          {
            key: 'containerHeight',
            label: '容器高度',
            type: 'select',
            options: [
              { value: '15vh', label: '小 (15vh)' },
              { value: '20vh', label: '中 (20vh)' },
              { value: '25vh', label: '大 (25vh)' },
              { value: '30vh', label: '超大 (30vh)' }
            ]
          },
          {
            key: 'rotateAmplitude',
            label: '旋转幅度',
            type: 'range',
            min: 0,
            max: 30,
            step: 1
          },
          {
            key: 'scaleOnHover',
            label: '悬停缩放',
            type: 'range',
            min: 1,
            max: 2,
            step: 0.1
          },
          {
            key: 'goldCanExpand',
            label: '允许展开',
            type: 'checkbox'
          },
          {
            key: 'showTooltip',
            label: '显示提示',
            type: 'checkbox'
          }
        ]}
      >
        <TiltedGoldCard
          imageSrc="/avatars/外国女人头像1_未抠图.jpeg"
          altText="金牌得主"
          containerHeight="20vh"
          containerWidth="20vh"
          imageHeight="20vh"
          imageWidth="20vh"
          showMobileWarning={false}
          displayOverlayContent={true}
          showExpandedCard={true}
          goldCanExpand={true}
          expandedCardData={{
            name: '金牌得主',
            score: 1234567,
            rank: 1,
            avatar: '/avatars/外国女人头像1_未抠图.jpeg'
          }}
          overlayContent={
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
              金牌得主
            </p>
          }
        />
      </ComponentDebugger>
    </div>
  );
}
