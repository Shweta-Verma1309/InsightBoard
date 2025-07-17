import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

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
        Cookies.set('theme', theme, { expires: 365 });
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },
      
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },
      
      setLastVisitedBoard: (boardId) => {
        set({ lastVisitedBoard: boardId });
        Cookies.set('lastVisitedBoard', boardId, { expires: 30 });
      },
      
      setFilterPreferences: (preferences) => {
        set((state) => ({
          filterPreferences: { ...state.filterPreferences, ...preferences }
        }));
        Cookies.set('filterPreferences', JSON.stringify(get().filterPreferences), { expires: 30 });
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);