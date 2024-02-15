import type { EdgeProps, NodeProps } from "reactflow";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Sheet = {
  open: boolean;
  currentNode?: NodeProps;
  currentEdge?: EdgeProps;
};

type SheetState = {
  sheet: Sheet;
  openSheet: (data: NodeProps | EdgeProps) => void;
  closeSheet: () => void;
};

const useSheet = create<SheetState>()(
  persist(
    set => ({
      sheet: {
        open: false,
      },
      openSheet: data => {
        if (data.data.type) {
          set({
            sheet: {
              open: true,

              currentNode: data as NodeProps,
            },
          });
        } else {
          set({
            sheet: {
              open: true,

              currentEdge: data as EdgeProps,
            },
          });
        }
      },
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
