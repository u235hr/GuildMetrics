import './globals.css';
import Header from '@/components/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="h-screen w-screen flex flex-col bg-[#0D0D0D] text-white">
        <div className="flex-shrink-0 h-[10cqh]">
          <Header />
        </div>
        <main className="flex-1 grid grid-rows-[35cqh_55cqh] gap-3 p-1">
          {children}
        </main>
      </body>
    </html>
  );
}
