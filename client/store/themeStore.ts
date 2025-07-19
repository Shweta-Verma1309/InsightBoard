import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark';
  lastVisitedBoard: string | null;
  filterPreferences: {
    status: string;
    sortBy: 'recent' | 'votes' | 'comments';
    tags: string[];
  };

  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setLastVisitedBoard: (boardId: string) => void;
  setFilterPreferences: (preferences: Partial<ThemeState['filterPreferences']>) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      lastVisitedBoard: null,
      filterPreferences: {
        status: 'all',
        sortBy: 'recent',
        tags: [],
      },

      setTheme: (theme) => {
        set({ theme });
        // ✅ DOM update only — no cookies
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },

      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },

      setLastVisitedBoard: (boardId) => {
        set({ lastVisitedBoard: boardId });
        // ✅ No cookie needed — stored via Zustand persist
      },

      setFilterPreferences: (preferences) => {
        set((state) => ({
          filterPreferences: { ...state.filterPreferences, ...preferences }
        }));
        // ✅ No cookie needed — stored via Zustand persist
      },
    }),
    {
      name: 'theme-storage', // saved in localStorage as "theme-storage"
    }
  )
);
