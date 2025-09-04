/**
 * 存储管理组件 - 管理本地存储的数据
 */

import React, { useState, useEffect } from 'react';
import { LocalStorageManager, type StoredFile } from '../utils/localStorageManager';

const StorageManager: React.FC = () => {
  const [storageStats, setStorageStats] = useState({
    monthlyDataCount: 0,
    uploadedFilesCount: 0,
    totalSize: 0,
    lastUpdate: null as string | null
  });
  const [uploadHistory, setUploadHistory] = useState<StoredFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 加载存储统计信息
  const loadStorageStats = async () => {
    try {
      const stats = await LocalStorageManager.getStorageStats();
      setStorageStats(stats);
      
      const history = await LocalStorageManager.getUploadHistory(20);
      setUploadHistory(history);
    } catch (error) {
      console.error('加载存储信息失败:', error);
      alert('加载存储信息失败');
    }
  };

  useEffect(() => {
    loadStorageStats();
  }, []);

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 清空所有数据
  const handleClearAllData = async () => {
    setLoading(true);
    try {
      await LocalStorageManager.clearAllData();
      alert('所有数据已清空');
      await loadStorageStats();
    } catch (error) {
      console.error('清空数据失败:', error);
      alert('清空数据失败');
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  // 清理旧文件
  const handleCleanupOldFiles = async () => {
    setLoading(true);
    try {
      await LocalStorageManager.cleanupOldFiles(20);
      alert('旧文件清理完成');
      await loadStorageStats();
    } catch (error) {
      console.error('清理文件失败:', error);
      alert('清理文件失败');
    } finally {
      setLoading(false);
    }
  };

  // 导出备份
  const handleExportBackup = async () => {
    setLoading(true);
    try {
      const backup = await LocalStorageManager.exportBackup();
      const dataStr = JSON.stringify(backup, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `streamer-dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('备份导出成功');
      setShowExportModal(false);
    } catch (error) {
      console.error('导出备份失败:', error);
      alert('导出备份失败');
    } finally {
      setLoading(false);
    }
  };

  // 导入备份
  const handleImportBackup = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      setLoading(true);
      try {
        const content = await file.text();
        const backup = JSON.parse(content);
        
        await LocalStorageManager.importBackup(backup);
        alert('备份导入成功');
        await loadStorageStats();
      } catch (error) {
        console.error('导入备份失败:', error);
        alert('导入备份失败：文件格式错误');
      } finally {
        setLoading(false);
      }
    };
    
    input.click();
  };

  return (
    <div className="space-y-6">
      {/* 存储统计概览 */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-2 mb-4">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
          </svg>
          <h2 className="text-xl font-bold text-white">存储统计</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <div>
                <p className="text-white/60 text-sm">月度数据</p>
                <p className="text-white text-xl font-bold">{storageStats.monthlyDataCount} <span className="text-sm font-normal">个月</span></p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <div>
                <p className="text-white/60 text-sm">上传文件</p>
                <p className="text-white text-xl font-bold">{storageStats.uploadedFilesCount} <span className="text-sm font-normal">个</span></p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
              </svg>
              <div>
                <p className="text-white/60 text-sm">存储大小</p>
                <p className="text-white text-xl font-bold">{formatFileSize(storageStats.totalSize)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p className="text-white/60 text-sm">最后更新</p>
                <p className="text-white text-xl font-bold">
                  {storageStats.lastUpdate ? 
                    new Date(storageStats.lastUpdate).toLocaleDateString() : 
                    '无'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-white/10 my-6" />

        {/* 存储使用情况 */}
        <div className="mb-6">
          <h3 className="text-white font-medium mb-3">存储使用情况：</h3>
          <div className="mt-2">
            <div className="w-full bg-white/10 rounded-full h-3 mb-2">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                style={{ width: `${Math.min((storageStats.totalSize / (50 * 1024 * 1024)) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">{formatFileSize(storageStats.totalSize)} / 50MB</span>
              <span className="text-white/50">建议定期清理旧数据以保持良好性能</span>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-wrap gap-3">
          <button 
            className="flex items-center px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            onClick={() => setShowExportModal(true)}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            导出备份
          </button>
          
          <button 
            className="flex items-center px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            onClick={handleImportBackup}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
            </svg>
            导入备份
          </button>
          
          <button 
            className="flex items-center px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            onClick={handleCleanupOldFiles}
            disabled={loading}
          >
            {loading && (
              <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            )}
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            清理旧文件
          </button>
          
          <button 
            className="flex items-center px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
            onClick={() => setShowConfirmModal(true)}
            disabled={loading}
          >
            {loading && (
              <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            )}
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            清空所有数据
          </button>
        </div>
      </div>

      {/* 上传历史 */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">上传历史</h2>
          <button 
            className="text-sm px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
            onClick={loadStorageStats}
          >
            刷新
          </button>
        </div>
        
        {uploadHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-3 px-4 text-left text-white/70 font-medium">文件名</th>
                  <th className="py-3 px-4 text-left text-white/70 font-medium">大小</th>
                  <th className="py-3 px-4 text-left text-white/70 font-medium">上传时间</th>
                </tr>
              </thead>
              <tbody>
                {uploadHistory.map((file, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span className="text-white">{file.fileName}</span>
                        <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                          {file.year}年{file.month}月
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white/80 text-sm">
                      {formatFileSize(file.fileSize)}
                    </td>
                    <td className="py-3 px-4 text-white/80 text-sm">
                      {new Date(file.uploadTime).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center">
            <svg className="w-12 h-12 text-white/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p className="text-white/60">暂无上传历史</p>
          </div>
        )}
      </div>

      {/* 数据安全提示 */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-2 mb-4">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 className="text-xl font-bold text-white">数据安全提示</h2>
        </div>
        
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h3 className="text-blue-400 font-medium mb-2">数据安全建议</h3>
          <ul className="mt-2 space-y-1 text-white/80">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
              定期导出数据备份，以防数据丢失
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
              浏览器清理缓存时可能会清除本地数据
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
              建议在重要操作前先导出备份
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
              上传的原始文件也会被保存，可以随时重新解析
            </li>
          </ul>
        </div>
      </div>

      {/* 导出备份模态框 */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">导出数据备份</h3>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => setShowExportModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="text-blue-400 font-medium mb-2">导出内容包括：</h4>
                <ul className="mt-2 space-y-1 text-white/80">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    所有月度数据 ({storageStats.monthlyDataCount} 个月)
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    用户设置和偏好
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    上传历史记录
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    导出时间戳
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-700 p-3 rounded-lg">
                <h4 className="text-white font-medium mb-2">导出信息：</h4>
                <div className="mt-1 text-sm space-y-1 text-white/80">
                  <div>文件格式：JSON</div>
                  <div>预估大小：{formatFileSize(storageStats.totalSize * 1.2)}</div>
                  <div>文件名：streamer-dashboard-backup-{new Date().toISOString().split('T')[0]}.json</div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                onClick={() => setShowExportModal(false)}
              >
                取消
              </button>
              <button 
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={handleExportBackup}
                disabled={loading}
              >
                {loading && (
                  <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                )}
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                开始导出
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 确认清空数据模态框 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <h3 className="text-xl font-bold text-white">确认清空所有数据？</h3>
            </div>
            
            <p className="text-white/80 mb-6">
              此操作将删除所有本地存储的数据，且无法恢复。
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                onClick={() => setShowConfirmModal(false)}
              >
                取消
              </button>
              <button 
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                onClick={handleClearAllData}
                disabled={loading}
              >
                {loading && (
                  <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                )}
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageManager;