'use client';

import { useState, ReactNode } from 'react';

interface ComponentDebuggerProps {
  children: ReactNode;
  componentName: string;
  defaultProps?: Record<string, any>;
  propControls?: Array<{
    key: string;
    label: string;
    type: 'range' | 'number' | 'text' | 'select' | 'checkbox';
    min?: number;
    max?: number;
    step?: number;
    options?: Array<{ value: any; label: string }>;
  }>;
}

export default function ComponentDebugger({ 
  children, 
  componentName, 
  defaultProps = {},
  propControls = []
}: ComponentDebuggerProps) {
  const [props, setProps] = useState(defaultProps);
  const [showControls, setShowControls] = useState(false);

  const updateProp = (key: string, value: any) => {
    setProps(prev => ({ ...prev, [key]: value }));
  };

  const renderControl = (control: any) => {
    const { key, label, type, min, max, step, options } = control;
    const value = props[key];

    switch (type) {
      case 'range':
        return (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium">{label}</label>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => updateProp(key, parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-xs text-gray-400">{value}</span>
          </div>
        );
      
      case 'number':
        return (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium">{label}</label>
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => updateProp(key, parseFloat(e.target.value))}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600"
            />
          </div>
        );
      
      case 'text':
        return (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium">{label}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => updateProp(key, e.target.value)}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600"
            />
          </div>
        );
      
      case 'select':
        return (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium">{label}</label>
            <select
              value={value}
              onChange={(e) => updateProp(key, e.target.value)}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600"
            >
              {options?.map((option: any) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      
      case 'checkbox':
        return (
          <div key={key} className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => updateProp(key, e.target.checked)}
                className="mr-2"
              />
              {label}
            </label>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {/* 调试按钮 */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
      >
        🐛 调试 {componentName}
      </button>

      {/* 控制面板 */}
      {showControls && (
        <div className="fixed top-16 right-4 z-40 bg-gray-800 p-4 rounded-lg shadow-xl max-w-sm max-h-96 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4 text-white">调试控制</h3>
          
          <div className="space-y-4">
            {propControls.map(renderControl)}
          </div>

          {/* 属性显示 */}
          <div className="mt-4 pt-4 border-t border-gray-600">
            <h4 className="text-sm font-medium text-gray-300 mb-2">当前属性:</h4>
            <pre className="text-xs text-gray-400 overflow-auto max-h-32">
              {JSON.stringify(props, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* 组件内容 */}
      <div className="component-wrapper">
        {children}
      </div>
    </div>
  );
}
