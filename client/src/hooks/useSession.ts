import { AppPage, User } from '@/lib/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SessionState = {
  token?: string;
  user?: User;
  dashboard: boolean;
  currentPage: AppPage;
  setDashboard: (manage: boolean) => void;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setCurrentPage: (page: AppPage) => void;
};

const useSession = create<SessionState>()(
  persist(
    set => ({
      token: undefined,
      user: undefined,
      dashboard: false,
      currentPage: AppPage.Login,
      setDashboard: dashboard => set({ dashboard }),
      setToken: token =>
        set({
          token,
        }),
      setUser: user => set({ user }),
      logout: () =>
        set({
          dashboard: undefined,
          user: undefined,
          token: undefined,
        }),
      setCurrentPage: page => set({ currentPage: page }),
    }),
    {
      name: 'session-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useSession;
