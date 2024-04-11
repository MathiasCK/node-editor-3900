import { AppPage, User } from '@/lib/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SessionState = {
  token?: string;
  user?: User;
  register: boolean;
  currentPage: AppPage;
  setRegister: (register: boolean) => void;
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
      register: false,
      currentPage: AppPage.Login,
      setRegister: register => set({ register }),
      setToken: token =>
        set({
          token,
        }),
      setUser: user => set({ user }),
      logout: () =>
        set({
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
