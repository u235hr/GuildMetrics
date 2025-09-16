import './globals.css';
import Header from '@/components/Header';
import { GlobalPerformanceMonitorOptimized } from '@/components/GlobalPerformanceMonitorOptimized';
import FPSLimiter from '@/components/FPSLimiter';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="h-screen w-screen grid grid-rows-[10fr_90fr] bg-[#0D0D0D] text-white overflow-hidden">
        <FPSLimiter targetFPS={60}>
          <GlobalPerformanceMonitorOptimized 
            enabled={process.env.NODE_ENV === 'development'}
            logInterval={5000}
            showConsoleLog={process.env.NODE_ENV === 'development'}
            showVisualIndicator={false}
            enableAutoThrottling={true}
            fpsThreshold={30}
            memoryThreshold={150}
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