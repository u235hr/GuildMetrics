/**
 * 测试环境设置文件
 */

import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// 扩展Vitest的expect API
expect.extend(matchers);

// 每个测试后清理
afterEach(() => {
  cleanup();
});

// Mock framer-motion for tests
vi.mock('framer-motion', () => ({
  motion: {
    div: () => 'div',
    span: () => 'span',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock Recharts for tests
vi.mock('recharts', () => ({
  ResponsiveContainer: () => 'ResponsiveContainer',
  LineChart: () => 'LineChart',
  BarChart: () => 'BarChart',
  PieChart: () => 'PieChart',
  AreaChart: () => 'AreaChart',
  Line: () => 'Line',
  Bar: () => 'Bar',
  Pie: () => 'Pie',
  Area: () => 'Area',
  XAxis: () => 'XAxis',
  YAxis: () => 'YAxis',
  CartesianGrid: () => 'CartesianGrid',
  Tooltip: () => 'Tooltip',
  Legend: () => 'Legend',
  Cell: () => 'Cell',
}));

// Mock IndexedDB
const indexedDBMock = {
  open: vi.fn(),
  deleteDatabase: vi.fn(),
  cmp: vi.fn(),
};

Object.defineProperty(window, 'indexedDB', {
  value: indexedDBMock,
  writable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 0));
global.cancelAnimationFrame = vi.fn();

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mocked-url');
global.URL.revokeObjectURL = vi.fn();