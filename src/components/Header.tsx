
import React, { useState } from 'react';
import { Layout, Typography, Space, Badge, Drawer } from 'antd';
import { DashboardOutlined, TrophyOutlined, BarChartOutlined, CloudUploadOutlined, MenuOutlined } from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import DataExport from './DataExport';
import { designSystem } from '../styles/design-system';
import useResponsive from '../hooks/useResponsive';

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

const Header: React.FC = () => {
  const { isMobile } = useResponsive();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => pathname === path;
  
  const navigationItems = [
    { path: '/ranking', icon: TrophyOutlined, label: '排行榜' },
    { path: '/data-analysis', icon: BarChartOutlined, label: '数据分析' },
    { path: '/data-import', icon: CloudUploadOutlined, label: '数据导入' }
  ];
  
  const handleNavigation = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };
  
  return (
    <AntHeader 
      className="glass-card-enhanced animate-slide-up"
      style={{ 
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(248, 250, 252, 0.72) 50%, rgba(241, 245, 249, 0.72) 100%)',
        backdropFilter: 'blur(clamp(0.25rem, 1vw, 0.75rem))',
        WebkitBackdropFilter: 'blur(clamp(0.25rem, 1vw, 0.75rem))',
        // 加强底部分隔线
        borderBottom: 'clamp(0.0625rem, 0.2vw, 0.125rem) solid rgba(15, 23, 42, 0.25)',
        boxShadow: '0 0.5rem 1.25rem rgba(0, 0, 0, 0.08), inset 0 0.0625rem 0 rgba(255, 255, 255, 0.6)',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'space-between',
         // 再压 0.25–0.5rem 的上下高度/内边距
         padding: isMobile ? '0 clamp(0.6rem, 2.6vw, 0.85rem)' : '0 clamp(1.25rem, 3.4vw, 1.75rem)',
         height: isMobile ? 'clamp(3.25rem, 7.5vh, 3.75rem)' : 'clamp(3.75rem, 9vh, 4.75rem)',
         minHeight: isMobile ? '3.25rem' : '3.75rem',
         maxHeight: isMobile ? '4.25rem' : '5.25rem',
         position: 'sticky',
         top: 0,
         zIndex: 1000,
         margin: 0,
         borderRadius: 0,
         border: 'none'
      }}
    >
      {/* 左侧品牌区域 */}
      <div className="flex items-center space-x-4">
        {/* 品牌Logo */}
        <div className="flex items-center justify-center bg-blue-500/20 rounded-xl backdrop-blur-sm border border-blue-500/30 shadow-lg" style={{
          width: 'clamp(2.5rem, 6vw, 3rem)',
          height: 'clamp(2.5rem, 6vw, 3rem)'
        }}>
          <DashboardOutlined className="text-blue-600" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }} />
        </div>
        
        {/* 品牌信息 */}
        <div className="flex flex-col">
          <Title 
            level={3} 
            className="responsive-title"
            style={{ 
              color: '#1f2937', 
              marginBottom: 0,
              fontWeight: 700,
              fontSize: isMobile ? 'clamp(1.1rem, 4vw, 1.25rem)' : 'clamp(1.25rem, 4vw, 1.5rem)',
              textShadow: '0 clamp(0.125rem, 0.25vw, 0.125rem) clamp(0.25rem, 0.5vw, 0.25rem) rgba(255, 255, 255, 0.3)',
              background: 'linear-gradient(135deg, #1f2937 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'none'
            }}
          >
            星汇漫舞
          </Title>
          <Text 
            style={{ 
              color: 'rgba(31, 41, 55, 0.7)', 
              fontSize: 'clamp(0.7rem, 2vw, 0.75rem)',
              fontWeight: 500,
              letterSpacing: 'clamp(0.03125rem, 0.06vw, 0.03125rem)'
            }}
          >
            直播公会数据分析平台
          </Text>
        </div>
      </div>

      {/* 桌面端导航区域 */}
      <div className="hidden md:flex items-center space-x-6">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const active = isActive(item.path);
          
          return (
            <div 
              key={item.path}
              className={`nav-item flex items-center space-x-2 px-[1rem] py-[0.5rem] rounded-lg backdrop-blur-sm border transition-all duration-300 cursor-pointer relative ${
                active 
                  ? 'nav-item-active bg-gradient-to-r from-blue-500/30 to-blue-400/20 border-blue-500/40 shadow-lg shadow-blue-500/20' 
                  : 'border-gray-300/20 hover:bg-gray-100/10 hover:border-gray-400/30 hover:shadow-md'
              }`}
              onClick={() => handleNavigation(item.path)}
            >
              {/* 选中指示器 */}
              {active && (
                <div className="absolute left-1/2 transform -translate-x-1/2 bg-blue-500 rounded-full shadow-lg animate-pulse" style={{
                  top: 'clamp(-0.3rem, -0.5vw, -0.25rem)',
                  width: 'clamp(1.5rem, 4vw, 2rem)',
                  height: 'clamp(0.2rem, 0.4vw, 0.25rem)'
                }} />
              )}
              
              <IconComponent 
                className={`transition-all duration-300 ${
                  active ? 'text-blue-600 scale-110 drop-shadow-lg' : 'text-gray-600'
                }`} 
              />
              <Text 
                style={{ 
                  color: active ? '#2563eb' : 'rgba(75, 85, 99, 0.9)', 
                  fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)', 
                  fontWeight: active ? 600 : 500,
                  textShadow: active ? '0 clamp(0.0625rem, 0.125vw, 0.0625rem) clamp(0.125rem, 0.25vw, 0.125rem) rgba(255, 255, 255, 0.3)' : 'none'
                }}
              >
                {item.label}
              </Text>
              
              {/* 发光效果 */}
              {active && (
                <div className="absolute inset-0 rounded-lg bg-blue-500/10 animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
      
      {/* 移动端菜单按钮 */}
      {isMobile && (
        <div className="md:hidden">
          <div 
            className="flex items-center justify-center bg-white/20 rounded-lg backdrop-blur-sm border border-white/30 cursor-pointer transition-all duration-300 hover:bg-white/30"
            onClick={() => setMobileMenuOpen(true)}
            style={{
              width: 'clamp(2.25rem, 5vw, 2.5rem)',
              height: 'clamp(2.25rem, 5vw, 2.5rem)'
            }}
          >
            <MenuOutlined className="text-white" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)' }} />
          </div>
        </div>
      )}

      {/* 右侧操作区域 */}
      <div className="flex items-center space-x-4">
        {/* 状态指示器 */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" style={{
              width: 'clamp(0.4rem, 1vw, 0.5rem)',
              height: 'clamp(0.4rem, 1vw, 0.5rem)'
            }}></div>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 'clamp(0.7rem, 2vw, 0.75rem)' }}>实时同步</Text>
          </div>
        </div>
        
        {/* 导出功能 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-1">
          <DataExport />
        </div>
      </div>
      
      {/* 移动端导航抽屉 */}
      <Drawer
        title={null}
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width="80vw"
        className="mobile-nav-drawer"
        styles={{
          body: { 
            padding: 0,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
          },
          header: {
            display: 'none'
          }
        }}
      >
        <div className="flex flex-col h-full">
          {/* 移动端品牌区域 */}
          <div className="flex items-center space-x-3 border-b border-white/20" style={{ padding: 'clamp(1rem, 4vw, 1.5rem)' }}>
            <div className="flex items-center justify-center bg-white/20 rounded-xl backdrop-blur-sm border border-white/30" style={{
              width: 'clamp(2.5rem, 8vw, 3rem)',
              height: 'clamp(2.5rem, 8vw, 3rem)'
            }}>
              <DashboardOutlined className="text-white" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }} />
            </div>
            <div>
              <div className="text-white font-bold" style={{ fontSize: 'clamp(1rem, 4vw, 1.125rem)' }}>星汇漫舞</div>
              <div className="text-white/70" style={{ fontSize: 'clamp(0.8rem, 3vw, 0.875rem)' }}>数据分析平台</div>
            </div>
          </div>
          
          {/* 移动端导航菜单 */}
          <div className="flex-1 py-4">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.path);
              
              return (
                <div 
                  key={item.path}
                  className={`mobile-nav-item flex items-center space-x-4 px-[1.5rem] py-[1rem] transition-all duration-300 cursor-pointer relative ${
                    active 
                      ? 'bg-white/20 border-r-4 border-white shadow-lg' 
                      : 'hover:bg-white/10'
                  }`}
                  onClick={() => handleNavigation(item.path)}
                >
                  {/* 选中背景效果 */}
                  {active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                  )}
                  
                  <div className={`relative z-10 flex items-center justify-center rounded-lg transition-all duration-300 ${
                    active ? 'bg-white/20 scale-110' : 'bg-white/10'
                  }`} style={{
                    width: 'clamp(2.25rem, 6vw, 2.5rem)',
                    height: 'clamp(2.25rem, 6vw, 2.5rem)'
                  }}>
                    <IconComponent 
                      className={`transition-all duration-300 ${
                        active ? 'text-white drop-shadow-lg' : 'text-white/80'
                      }`}
                      style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)' }}
                    />
                  </div>
                  
                  <div className="relative z-10">
                    <div 
                      className={`transition-all duration-300 ${
                        active ? 'text-white font-semibold' : 'text-white/90 font-medium'
                      }`}
                      style={{ fontSize: 'clamp(0.9rem, 3.5vw, 1rem)' }}
                    >
                      {item.label}
                    </div>
                    {active && (
                      <div className="text-white/70 mt-1" style={{ fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)' }}>当前页面</div>
                    )}
                  </div>
                  
                  {/* 选中指示器 */}
                  {active && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-l-full animate-pulse" style={{
                      width: 'clamp(0.15rem, 0.5vw, 0.25rem)',
                      height: 'clamp(1.5rem, 6vw, 2rem)'
                    }} />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* 移动端底部状态 */}
          <div className="border-t border-white/20" style={{ padding: 'clamp(1rem, 4vw, 1.5rem)' }}>
            <div className="flex items-center justify-center space-x-2">
              <div className="bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" style={{
                width: 'clamp(0.4rem, 1.5vw, 0.5rem)',
                height: 'clamp(0.4rem, 1.5vw, 0.5rem)'
              }}></div>
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)' }}>实时同步中</Text>
            </div>
          </div>
        </div>
      </Drawer>
    </AntHeader>
  );
};

export default Header;
