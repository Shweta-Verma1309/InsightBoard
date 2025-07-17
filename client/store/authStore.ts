import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member' | 'viewer';
  avatar?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User) => void;
  logout: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      setUser: (user: User) => set({ user, isAuthenticated: true }),
      
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      login: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      },
      
      logout: () => {
        // Clear cookies
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
      
      clearAuth: () => {
        // Clear cookies
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);