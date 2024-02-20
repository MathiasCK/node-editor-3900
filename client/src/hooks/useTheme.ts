import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeData = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

const useTheme = create<ThemeData>()(
  persist(
    set => ({
      theme: 'light',
      toggleTheme: () =>
        set(state => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
    }),
    {
      name: 'theme-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useTheme;
