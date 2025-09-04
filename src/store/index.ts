import { create } from 'zustand';

// Define the state and actions
type PageState = {
  activePage: 'ranking' | 'analysis' | 'maintenance';
  selectedMonth: string;
  setActivePage: (page: PageState['activePage']) => void;
  setSelectedMonth: (month: string) => void;
};

// Create the store
export const usePageStore = create<PageState>((set) => ({
  activePage: 'ranking', // Default active page
  selectedMonth: '2025-07', // Default selected month
  setActivePage: (page) => set({ activePage: page }),
  setSelectedMonth: (month) => set({ selectedMonth: month }),
}));