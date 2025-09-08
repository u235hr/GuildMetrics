'use client';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type Page = 'ranking' | 'analysis' | 'maintenance';

interface PageState {
  activePage: Page;
  selectedMonth: string;
  setActivePage: (p: Page) => void;
  setSelectedMonth: (m: string) => void;
}

export const usePageStore = create<PageState>()(
  devtools(
    persist(
      (set) => ({
        activePage: 'ranking',
        selectedMonth: '2025-07',
        setActivePage: (p) => set({ activePage: p }, false, 'setActivePage'),
        setSelectedMonth: (m) => set({ selectedMonth: m }, false, 'setSelectedMonth'),
      }),
      { name: 'page-store' }
    )
  )
);