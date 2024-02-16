import type { CustomNodeProps, CustomEdgeProps } from "@/lib/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Sheet = {
  open: boolean;
  currentNode?: CustomNodeProps;
  currentEdge?: CustomEdgeProps;
};

type SheetState = {
  sheet: Sheet;
  openSheet: (data: CustomNodeProps | CustomEdgeProps) => void;
  closeSheet: () => void;
};

const isEdgeProps = (
  data: CustomNodeProps | CustomEdgeProps,
): data is CustomEdgeProps =>
  "sourceHandleId" in data && "targetHandleId" in data;

const useSheet = create<SheetState>()(
  persist(
    set => ({
      sheet: {
        open: false,
      },
      openSheet: data => {
        if (isEdgeProps(data)) {
          set({
            sheet: {
              open: true,
              currentEdge: data,
            },
          });
        } else {
          set({
            sheet: {
              open: true,
              currentNode: data,
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
