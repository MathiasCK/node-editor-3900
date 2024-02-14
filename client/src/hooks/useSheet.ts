import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SheetData = {
  type: "node" | "edge";
  title: string;
  subtitle: string;
};

type Sheet = {
  open: boolean;
  data?: SheetData;
};

type SheetState = {
  sheet: Sheet;
  openSheet: (data: SheetData) => void;
  closeSheet: () => void;
};

const useSheet = create<SheetState>()(
  persist(
    set => ({
      sheet: {
        open: false,
      },
      openSheet: data =>
        set({
          sheet: {
            open: true,
            data: {
              type: data.type,
              title: data.title,
              subtitle: data.subtitle,
            },
          },
        }),
      closeSheet: () =>
        set({
          sheet: {
            open: false,
          },
        }),
    }),
    {
      name: "sheet-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useSheet;
