import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { shallow } from 'zustand/shallow';

const QualificationSettings: React.FC = () => {
  const qualificationLine = useAppStore((state) => state.userSettings.qualificationLine);
  const { updateUserSettings } = useAppStore();
  const [inputValue, setInputValue] = useState(qualificationLine.toString());

  // 当 qualificationLine 变化时更新输入框的值
  useEffect(() => {
    setInputValue(qualificationLine.toString());
  }, [qualificationLine]);

  const handleQualificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // 移除所有非数字字符
    const numericValue = parseInt(value.replace(/\D/g, ''), 10);
    if (!isNaN(numericValue)) {
      updateUserSettings({ qualificationLine: numericValue });
    }
  };

  // 格式化显示值（添加千位分隔符）
  const formatDisplayValue = (value: string) => {
    // 移除所有非数字字符
    const numericValue = value.replace(/\D/g, '');
    // 添加千位分隔符
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">合格线设置</h2>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="text"
            value={formatDisplayValue(inputValue)}
            onChange={handleQualificationChange}
            className="w-40 px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-white/60">¥</span>
          </div>
        </div>
        <span className="text-white/60">礼物值</span>
        <div className="group relative">
          <svg className="w-5 h-5 text-white/60 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-black/80 text-white text-sm rounded-lg opacity-0 pointer-events-none">
            设置后将影响"达标人数"和"达标率"的统计
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualificationSettings;