import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SettingsState = {
  isOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
};

const useSettings = create<SettingsState>()(
  persist(
    set => ({
      isOpen: false,
      openSettings: () =>
        set({
          isOpen: true,
        }),
      closeSettings: () =>
        set({
          isOpen: false,
        }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useSettings;
