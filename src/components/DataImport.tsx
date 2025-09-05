import React, { useState, useRef } from 'react';
import { useAppStore } from '../store';

const DataImport: React.FC = () => {
  const { uploadStatus, setUploadStatus, loadMonthData } = useAppStore();
  const [fileList, setFileList] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const mdFiles = files.filter(file => file.name.endsWith('.md'));
      
      if (mdFiles.length !== files.length) {
        alert('只支持上传 .md 格式的文件');
      }
      
      setFileList(prev => [...prev, ...mdFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      const mdFiles = files.filter(file => file.name.endsWith('.md'));
      
      if (mdFiles.length !== files.length) {
        alert('只支持上传 .md 格式的文件');
      }
      
      setFileList(prev => [...prev, ...mdFiles]);
    }
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      alert('请先选择要上传的 MD 文件');
      return;
    }

    setUploadStatus({ status: 'uploading', progress: 0, message: '开始处理...' });

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const progress = Math.round(((i + 1) / fileList.length) * 100);
      setUploadStatus({ status: 'parsing', progress, message: `正在解析 ${file.name}...` });

      try {
        const content = await file.text();
        await loadMonthData(file.name, content);
      } catch (error) {
        console.error('文件解析失败:', error);
        setUploadStatus({ 
          status: 'error', 
          progress, 
          message: `解析 ${file.name} 失败: ${(error as Error).message}` 
        });
      }
    }
    
    // 清空文件列表
    setFileList([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearFileList = () => {
    setFileList([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">数据导入</h2>
      <div className="flex flex-col space-y-4">
        {/* 拖拽上传区域 */}
        <div 
          className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center cursor-pointer transition-colors "
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center">
            <svg className="w-12 h-12 text-white/60 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="text-white/80 mb-2">点击或拖拽 MD 文件到此区域</p>
            <p className="text-white/60 text-sm">支持单个或批量上传</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".md"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* 文件列表 */}
        {fileList.length > 0 && (
          <div className="border border-white/20 rounded-lg p-4 bg-white/5">
            <h3 className="text-white/80 font-medium mb-2">已选择文件:</h3>
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {fileList.map((file, index) => (
                <li key={index} className="flex items-center text-white/70 text-sm">
                  <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 上传状态 */}
        {uploadStatus.status !== 'idle' && (
          <div className="pt-2">
            <div className={`p-3 rounded-lg ${
              uploadStatus.status === 'success' ? 'bg-green-500/20 border border-green-500/30' :
              uploadStatus.status === 'error' ? 'bg-red-500/20 border border-red-500/30' :
              'bg-blue-500/20 border border-blue-500/30'
            }`}>
              <div className="flex items-center">
                {uploadStatus.status === 'uploading' || uploadStatus.status === 'parsing' ? (
                  <svg className="w-5 h-5 text-blue-400 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                ) : uploadStatus.status === 'success' ? (
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                )}
                <span className="text-white/90">{uploadStatus.message}</span>
              </div>
              
              {(uploadStatus.status === 'uploading' || uploadStatus.status === 'parsing') && (
                <div className="mt-2">
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadStatus.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-xs text-white/70 mt-1">{uploadStatus.progress}%</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={clearFileList}
            disabled={fileList.length === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              fileList.length === 0 
                ? 'bg-gray-500/30 text-white/50 cursor-not-allowed' 
                : 'bg-white/10 text-white '
            }`}
          >
            清空
          </button>
          <button
            onClick={handleUpload}
            disabled={fileList.length === 0 || uploadStatus.status === 'uploading' || uploadStatus.status === 'parsing'}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
              fileList.length === 0 || uploadStatus.status === 'uploading' || uploadStatus.status === 'parsing'
                ? 'bg-blue-500/30 text-white/50 cursor-not-allowed' 
                : 'bg-blue-500 text-white '
            }`}
          >
            {(uploadStatus.status === 'uploading' || uploadStatus.status === 'parsing') && (
              <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            )}
            开始导入
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataImport;