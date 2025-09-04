'use client';

import { usePageStore } from '@/store'; // Import the Zustand store

export default function Header() {
  // Use the store's state and actions
  const { activePage, setActivePage, selectedMonth, setSelectedMonth } = usePageStore();

  const pages = [
    { name: '排行榜', key: 'ranking' },
    { name: '数据分析', key: 'analysis' },
    { name: '数据维护', key: 'maintenance' },
  ];

  const navButtonBase = "h-[2.5em] px-[1.2em] py-[0.6em] flex items-center justify-center rounded-[0.4em] text-white text-[1em] font-semibold border border-white/20 transition-all duration-300";
  const navButtonInactive = "bg-white/10 hover:bg-white/20";
  const navButtonActive = "bg-blue-500/50 border-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.7)]";

  return (
    <header data-testid="header" className="h-full flex items-center container-type-size text-[min(1.8cqw,1.8cqh)] bg-black/20 backdrop-blur-sm border border-white/10 rounded-[0.6em] p-[1em] shadow-lg">
      {/* Left: Logo and Title */}
      <div className="w-1/4 flex items-center gap-[0.8em]">
        <img src="/globe.svg" alt="Logo" className="w-[2.5em] h-[2.5em] opacity-80" />
        <div>
          <h1 className="text-[1.2em] font-bold text-white/90">公会指标</h1>
          <p className="text-[0.9em] text-white/60">数据分析平台</p>
        </div>
      </div>
      {/* Center: Navigation */}
      <nav className="w-1/2 flex justify-center gap-[0.8em]">
        {pages.map(({ name, key }) => (
          <button
            key={key}
            onClick={() => setActivePage(key as 'ranking' | 'analysis' | 'maintenance')}
            className={`${navButtonBase} ${activePage === key ? navButtonActive : navButtonInactive}`}
          >
            {name}
          </button>
        ))}
      </nav>
      {/* Right: Month Selector */}
      <div className="w-1/4 flex justify-end">
        <select
          id="month-select"
          name="month"
          className="bg-black/30 border border-white/20 rounded-[0.4em] text-[1em] p-[0.5em] text-white/80 focus:outline-none focus:border-blue-500"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          autoComplete="off"
        >
          <option value="2025-07">2025年7月</option>
          <option value="2025-06">2025年6月</option>
        </select>
      </div>
    </header>
  );
}
