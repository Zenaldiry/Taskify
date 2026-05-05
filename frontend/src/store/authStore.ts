import { create } from 'zustand';
import { api } from '../api/axios';
interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  authUser: User | null;
  isCheckingAuth: boolean;
  isAuthenticated: boolean;
  setAuthUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isAuthenticated:
    typeof localStorage !== 'undefined' && localStorage.getItem
      ? localStorage.getItem('hasSession') === 'true'
      : false,
  isCheckingAuth: true,
  checkAuth: async () => {
    if (localStorage.getItem('hasSession') === 'true') {
      try {
        const response = await api.get('/api/users/profile');
        set({ authUser: response.data, isAuthenticated: true });
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
        localStorage.removeItem('hasSession');
        set({ authUser: null, isAuthenticated: false });
      }
    }
  },
  setAuthUser: (user) => {
    if (typeof localStorage !== 'undefined' && localStorage.setItem) {
      if (user) {
        localStorage.setItem('hasSession', 'true');
      } else {
        localStorage.removeItem('hasSession');
      }
    }
    set({ authUser: user, isAuthenticated: !!user });
  },
}));
