import { User } from '@/lib/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SettingsState = {
  token?: string;
  user?: User;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
};

const useSession = create<SettingsState>()(
  persist(
    set => ({
      token: undefined,
      user: undefined,
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
    }),
    {
      name: 'session-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useSession;
