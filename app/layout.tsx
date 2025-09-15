import './globals.css';
import Header from '@/components/Header';
import { GlobalPerformanceMonitor } from '@/components/GlobalPerformanceMonitor';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="h-screen w-screen grid grid-rows-[10fr_90fr] bg-[#0D0D0D] text-white overflow-visible">
        <GlobalPerformanceMonitor 
          enabled={true} 
          logInterval={2000} 
          showConsoleLog={true}
        />
        <Header />
        <main className="h-full w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
