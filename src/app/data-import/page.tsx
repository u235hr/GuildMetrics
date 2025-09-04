'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import DataImport from '../../components/DataImport';

const DataImportPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1B]">
      <div className="h-[10%]">
        <Header />
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-7xl mx-auto">
          {/* 面包屑导航 */}
          <nav className="flex text-sm text-gray-400 mb-4">
            <Link href="/" className="flex items-center hover:text-white transition-colors">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              主页
            </Link>
            <span className="mx-2">/</span>
            <span className="flex items-center text-white">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
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
};

export default DataImportPage;