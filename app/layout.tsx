import './globals.css';
import Header from '@/components/Header';
import { GlobalPerformanceMonitorOptimized } from '@/components/GlobalPerformanceMonitorOptimized';
import FPSLimiter from '@/components/FPSLimiter';

// 轻量级性能监控替代方案
function LightweightMonitor() {
  if (typeof window === 'undefined') return null;
  
  let frameCount = 0;
  let lastTime = performance.now();
  
  const measure = (currentTime: number) => {
    frameCount++;
    
    if (currentTime - lastTime >= 10000) { // 10秒间隔
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      const memory = (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0;
      
      // 低频监控输出
      console.log(`🟢 性能状态: ${fps}fps | ${Math.round(memory)}MB`);
      
      frameCount = 0;
      lastTime = currentTime;
    }
    
    requestAnimationFrame(measure);
  };
  
  // 只在开发环境启动
  if (process.env.NODE_ENV === 'development') {
    requestAnimationFrame(measure);
  }
  
  return null;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="h-screen w-screen grid grid-rows-[10fr_90fr] bg-[#0D0D0D] text-white overflow-hidden">
        <FPSLimiter targetFPS={60}>
          <LightweightMonitor />
          <GlobalPerformanceMonitorOptimized 
            enabled={false}
            logInterval={10000}
            showConsoleLog={false}
            showVisualIndicator={false}
          />
          <Header />
          <main className="h-full w-full overflow-hidden">
            {children}
          </main>
        </FPSLimiter>
      </body>
    </html>
  );
}