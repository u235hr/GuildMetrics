'use client';

import { usePageStore } from '@/store';
import Header from '@/components/Header';
import DataImport from '@/components/DataImport';
import Link from 'next/link';

export default function DataImportPage() {
  const { selectedMonth } = usePageStore();

  return (
    <div className="h-screen w-screen @container text-[min(1.5cqw,1.5cqh)] bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1B]">
      <div className="h-full w-full flex flex-col">
        {/* Header - 固定高度 */}
        <div className="h-[10cqh]">
          <Header />
        </div>

        {/* 面包屑导航 */}
        <div className="text-[0.8em] text-white/60 px-[1em] py-[0.5em]">
          <nav className="flex">
            <Link href="/" className="flex items-center hover:text-white transition-colors">
              主页
            </Link>
            <span className="mx-[0.5em]">/</span>
            <span className="flex items-center text-white">
              数据导入
            </span>
          </nav>
          
          {/* 页面标题 */}
          <div className="mb-6">
            <h1 className="text-[min(1.8cqw,1.8cqh)] font-bold text-white">
              数据导入中心
            </h1>
            <p className="text-[min(1.2cqw,1.2cqh)] text-gray-400">
              上传和管理主播数据，支持多种格式导入
            </p>
          </div>

          {/* 数据导入组件 */}
          <div className="max-w-4xl mx-auto flex-1">
            <DataImport />
          </div>
        </div>
      </div>
    </div>
  );
}
