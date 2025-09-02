'use client';

import React from 'react';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import type Entity from '@ant-design/cssinjs/es/Cache';
import { useServerInsertedHTML } from 'next/navigation';
import { version } from 'antd';

// React 19 兼容性处理
if (typeof window !== 'undefined') {
  // 禁用 Ant Design 的 React 版本警告
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0]?.includes?.('antd v5 support React is 16 ~ 18')) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

const AntdRegistry = ({ children }: { children: React.ReactNode }) => {
  const cache = React.useMemo<Entity>(() => createCache(), []);
  useServerInsertedHTML(() => (
    <style id="antd" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />
  ));
  return <StyleProvider cache={cache}>{children}</StyleProvider>;
};

export default AntdRegistry;
