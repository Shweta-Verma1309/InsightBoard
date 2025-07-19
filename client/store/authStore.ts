import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
  clearAuth: () => void;
}

function clearAuthStorage() {
  ['accessToken', 'refreshToken', 'name', 'email', 'role'].forEach((key) =>
    localStorage.removeItem(key)
  );
}

// Optional: reusable utility to get the current access token
export function getAccessToken(): string {
  return localStorage.getItem('accessToken') || '';
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      login: (user: User, tokens: { accessToken: string; refreshToken: string }) => {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        localStorage.setItem('name', user.name);
        localStorage.setItem('email', user.email);
        localStorage.setItem('role', user.role);

        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
         clearAuthStorage();

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      clearAuth: () => {
         clearAuthStorage();

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
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
