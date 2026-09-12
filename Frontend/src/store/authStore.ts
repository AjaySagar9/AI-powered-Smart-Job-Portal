import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role, User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  role: Role | null;
  loading: boolean;
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      role: null,
      loading: false,
      setAuth: (user, accessToken) =>
        set({ user, isAuthenticated: true, accessToken, role: user.role, loading: false }),
      clearAuth: () =>
        set({ user: null, isAuthenticated: false, accessToken: null, role: null, loading: false }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        role: state.role,
      }),
    }
  )
);
