// 文件路径 app/Header.tsx
// 告诉 Next.js 这是「客户端组件」，因为我们要用浏览器事件和 Zustand
'use client';

// 从刚才写的 zustand 仓库里引入钩子
import { usePageStore } from '@/store/usePageStore';
// 用来跳转路由（Next.js 15 新钩子）
import { useRouter } from 'next/navigation';
// React 的副作用钩子
import { useEffect } from 'react';

export default function Header() {
  // 取出全局状态和更新函数
  const router = useRouter();
  const { activePage, setActivePage, selectedMonth, setSelectedMonth } = usePageStore();

  // 每当 activePage 变化，就同步到浏览器地址栏（/ranking、/analysis...）
  useEffect(() => {
    router.replace(`/${activePage}`);
  }, [activePage, router]);

  // 导航按钮文字和对应 key
  const pages = [
    { name: '排行榜', key: 'ranking' },
    { name: '数据分析', key: 'analysis' },
    { name: '数据维护', key: 'maintenance' },
  ] as const;

  // 按钮基础样式（大小、圆角、过渡动画）
  const navBase =
    'h-[2.5em] min-w-[7em] px-[1.2em] py-[0.6em] flex items-center justify-center ' +
    'rounded-[0.4em] text-white text-[1em] font-semibold border-2 transition-all duration-300';
  // 未选中时的背景 + 边框颜色
  const navInactive = 'bg-white/10 border-white/20 hover:bg-white/20';
  // 选中后的高亮背景 + 发光阴影
  const navActive = 'bg-blue-500/50 border-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.7)]';
  
  // 禁用按钮的样式
  const navDisabled = 'bg-gray-500/20 border-gray-500/30 text-gray-400 cursor-not-allowed';

  // 处理页面切换
  const handlePageChange = (pageKey: string) => {
    // 如果是排行榜页面，正常切换
    if (pageKey === 'ranking') {
      setActivePage('ranking');
    }
    // 如果是数据分析或数据维护页面，暂时禁用导航功能
    // 不执行任何操作，也不报错
  };

  // 开始渲染
  return (
    <header className="h-[10cqh] min-h-[64px] w-full flex items-center bg-black/20 backdrop-blur-sm border border-white/10 rounded-[0.6em] p-[1em] shadow-lg">
      {/* 左侧：Logo + 标题 */}
      <div className="w-1/4 flex items-center gap-[0.8em]">
        {/* 图标 */}
        <img src="/星汇漫舞.jpg" alt="Logo" className="w-[5.5em] h-[5.5em] opacity-100 " />
        {/* 文字标题 */}
        <div>
          <h1 className="text-[1.2em] font-bold text-white/90">公会指标</h1>
          <p className="text-[0.9em] text-white/60">数据分析平台</p>
        </div>
      </div>

      {/* 中间：Tab 按钮区 */}
      <nav className="w-1/2 flex justify-center gap-[0.8em]" role="tablist">
        {pages.map(({ name, key }) => (
          <button
            key={key}
            role="tab"
            aria-selected={activePage === key} // 无障碍：告诉屏幕阅读器当前选中项
            onClick={() => handlePageChange(key)} // 使用新的处理函数
            className={`${navBase} ${
              key === 'ranking' 
                ? (activePage === key ? navActive : navInactive) 
                : navDisabled // 数据分析和数据维护按钮使用禁用样式
            }`}
            // 如果不是排行榜页面，禁用按钮
            disabled={key !== 'ranking'}
          >
            {name}
          </button>
        ))}
      </nav>

      {/* 右侧：月份下拉框 */}
      <div className="w-1/4 flex justify-end">
        <select
          id="month-select"
          name="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)} // 选中新月份 → 写进全局
          aria-label="选择月份" // 无障碍描述
          className="bg-black/30 border border-white/20 rounded-[0.4em] text-[1em] p-[0.5em] text-white/80 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
        >
          <option value="2025-06">2025年6月</option>
          <option value="2025-07">2025年7月</option>
        </select>
      </div>
    </header>
  );
}