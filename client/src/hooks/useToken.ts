import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SettingsState = {
  token?: string;
  setToken: (token: string) => void;
  removeToken: () => void;
};

const useToken = create<SettingsState>()(
  persist(
    set => ({
      token: undefined,
      setToken: token =>
        set({
          token,
        }),
      removeToken: () =>
        set({
          token: undefined,
        }),
    }),
    {
      name: 'token-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useToken;
