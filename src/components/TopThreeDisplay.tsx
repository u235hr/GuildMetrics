import React, { useMemo, useEffect, useState } from 'react';
import { Card, Avatar, Typography, Empty, Skeleton, Badge, Tooltip, Upload, Button, message } from 'antd';
import { TrophyOutlined, CrownOutlined, StarOutlined, FireOutlined, ThunderboltOutlined, RiseOutlined, UploadOutlined, CameraOutlined } from '@ant-design/icons';
import { useCurrentMonthData } from '../store';
import { designSystem } from '../styles/design-system';
import useResponsive from '../hooks/useResponsive';
import type { UploadProps } from 'antd';
import type { StreamerInfo } from '../types';

const { Title, Text } = Typography;

const TopThreeDisplay: React.FC = () => {
  const currentMonthData = useCurrentMonthData();
  const { isMobile, isTablet } = useResponsive();
  const [isClient, setIsClient] = useState(false);
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [customAvatars, setCustomAvatars] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleUpload: UploadProps['customRequest'] = (options) => {
    const { file, onSuccess, onError } = options;
    const streamerId = (file as File & { streamerId?: string }).streamerId;
    
    if (streamerId) {
      setUploading(prev => ({ ...prev, [streamerId]: true }));
      
      // 模拟上传过程
      setTimeout(() => {
        try {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            setCustomAvatars(prev => ({ ...prev, [streamerId]: result }));
            setUploading(prev => ({ ...prev, [streamerId]: false }));
            message.success('照片上传成功！');
            onSuccess?.(result);
          };
          reader.readAsDataURL(file as File);
        } catch (error) {
          setUploading(prev => ({ ...prev, [streamerId]: false }));
          message.error('照片上传失败，请重试');
          onError?.(error as Error);
        }
      }, 1000);
    }
  };

  const topThree = useMemo(() => {
    if (!currentMonthData || !Array.isArray(currentMonthData)) return [];
    return currentMonthData
      .sort((a: StreamerInfo, b: StreamerInfo) => b.giftValue - a.giftValue)
      .slice(0, 3);
  }, [currentMonthData]);

  if (!currentMonthData) {
    return <Skeleton active />;
  }

  if (topThree.length === 0) {
    return (
      <Card title="月度之星">
        <div className="empty-state">
          <Empty description="暂无数据" />
        </div>
      </Card>
    );
  }

  const rankConfig = [
    { 
      bg: 'champion-bg', 
      icon: <CrownOutlined className="champion-icon-size" />,
      title: '月度冠军',
      glow: 'champion-glow',
      border: 'champion-border',
      pulse: 'champion-pulse',
      scale: 'champion-scale',
      textColor: 'champion-text',
      badgeColor: '#F59E0B',
      size: 'large',
      starCount: 5
    },
    { 
      bg: 'runner-bg', 
      icon: <StarOutlined className="runner-icon-size" />,
      title: '月度亚军',
      glow: 'runner-glow',
      border: 'runner-border',
      pulse: '',
      scale: 'runner-scale',
      textColor: 'runner-text',
      badgeColor: '#3B82F6',
      size: 'medium',
      starCount: 4
    },
    { 
      bg: 'third-bg', 
      icon: <StarOutlined className="third-icon-size" />,
      title: '月度季军',
      glow: 'third-glow',
      border: 'third-border',
      pulse: '',
      scale: 'third-scale',
      textColor: 'third-text',
      badgeColor: '#10B981',
      size: 'small',
      starCount: 3
    },
  ];

  return (
    <div className="top-three-container">
      {/* 标题区域 */}
      <div className="top-three-header">
        <div className="top-three-title-wrapper">
          <div className="top-three-crown-icon">
            <CrownOutlined />
          </div>
          <h2 className="top-three-title">
            月度之星
          </h2>
        </div>
      </div>

      {/* 前三名卡片网格 */}
      <div className="top-three-grid">
        {topThree.map((streamer: StreamerInfo, index: number) => {
          const config = rankConfig[index];
          const isFirst = index === 0;
          
          return (
            <div 
              key={streamer.id} 
              className={`top-three-card ${isFirst ? 'champion-card' : ''} ${index === 1 ? 'second-place' : index === 2 ? 'third-place' : ''}`}
            >
              <div className="card-inner group cursor-pointer">
                <div className={`card-content ${config.bg} ${config.glow} ${config.scale} ${config.border} card-backdrop`}>
                  
                  {/* 排名徽章 */}
                  <div className="rank-badge-container">
                    <div 
                      className={`rank-badge ${isFirst ? 'champion-badge' : 'runner-badge'}`}
                      style={{ backgroundColor: config.badgeColor }}
                    >
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* 图标 */}
                  <div className="rank-icon-container">
                    <div className={`rank-icon-wrapper ${isFirst ? 'champion-icon' : 'runner-icon'}`}>
                      <div className="rank-icon">
                        {React.cloneElement(config.icon, { 
                          className: `${config.textColor}` 
                        })}
                      </div>
                    </div>
                  </div>
                  
                  {/* 主播信息 */}
                  <div className="streamer-info">
                    {/* 头像区域 */}
                    <div className="avatar-container">
                      <Avatar 
                        className={`streamer-avatar ${isFirst ? 'champion-avatar' : 'runner-avatar'}`}
                        size={isMobile ? 'small' : isFirst ? 'large' : 'default'}
                        src={customAvatars[streamer.name.replace(/\s+/g, '_')] || streamer.avatar || `https://api.dicebear.com/8.x/avataaars/svg?seed=${streamer.name}`}
                      />
                      <Upload
                        customRequest={(options) => {
                          (options.file as File & { streamerId?: string }).streamerId = streamer.name.replace(/\s+/g, '_');
                          handleUpload(options);
                        }}
                        showUploadList={false}
                        accept="image/*"
                      >
                        <Button
                          icon={<CameraOutlined />}
                          size="small"
                          loading={uploading[streamer.name.replace(/\s+/g, '_')]}
                          className="upload-button"
                        />
                      </Upload>
                    </div>
                    
                    {/* 文字信息区域 */}
                    <div className="text-info">
                      <Title 
                        level={5} 
                        className={`streamer-name ${config.textColor} ${isFirst ? 'champion-name' : 'runner-name'}`}
                      >
                        {streamer.name}
                      </Title>
                      <Text 
                        className={`medal-text ${config.textColor} ${isFirst ? 'champion-medal' : 'runner-medal'}`}
                      >
                        {index === 0 ? '🥇 金牌' : index === 1 ? '🥈 银牌' : '🥉 铜牌'}
                      </Text>
                    </div>
                    
                    {/* 礼物值显示 */}
                    <div className={`gift-value ${config.textColor} ${isFirst ? 'champion-value' : 'runner-value'}`}>
                      {streamer.giftValue?.toLocaleString() || 0}
                    </div>
                  </div>
                  
                  {/* 装饰性光效 */}
                  <div className="card-overlay" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopThreeDisplay;