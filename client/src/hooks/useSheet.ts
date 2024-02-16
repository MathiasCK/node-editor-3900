import type { CustomNodeProps, CustomEdgeProps } from "@/lib/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Sheet = {
  open: boolean;
  edit: boolean;
  currentNode?: CustomNodeProps;
  currentEdge?: CustomEdgeProps;
};

type SheetState = {
  sheet: Sheet;
  openSheet: (data: CustomNodeProps | CustomEdgeProps) => void;
  closeSheet: () => void;
  handleEdit: (edit: boolean) => void;
};

const isEdgeProps = (
  data: CustomNodeProps | CustomEdgeProps,
): data is CustomEdgeProps =>
  "sourceHandleId" in data && "targetHandleId" in data;

const useSidebar = create<SheetState>()(
  persist(
    set => ({
      sheet: {
        open: false,
        edit: false,
      },
      openSheet: data => {
        if (isEdgeProps(data)) {
          set({
            sheet: {
              edit: false,
              open: true,
              currentEdge: data,
            },
          });
        } else {
          set({
            sheet: {
              edit: false,
              open: true,
              currentNode: data,
            },
          });
        }
      },
      handleEdit: (edit: boolean) => {
        set(state => ({
          sheet: {
            ...state.sheet, // spread the existing sheet properties
            edit: edit, // set the new edit value
          },
        }));
      },
      closeSheet: () =>
        set({
          sheet: {
            open: false,
            edit: false,
          },
        }),
    }),
    {
      name: "sheet-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useSidebar;
