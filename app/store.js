import { create } from 'zustand';

const useStore = create((set) => ({
  ticker: 'a',
}));
