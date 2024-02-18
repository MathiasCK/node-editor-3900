import { EdgeType } from "@/lib/types";
import { create } from "zustand";

type ConnectionState = {
  dialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  edgeType: EdgeType;
  setEdgeType: (edgeType: EdgeType) => void;
};

const useConnection = create<ConnectionState>()(set => ({
  dialogOpen: false,
  edgeType: EdgeType.Part,
  setEdgeType: edgeType => set({ edgeType }),
  openDialog: () =>
    set({
      dialogOpen: true,
    }),
  closeDialog: () => set({ dialogOpen: false }),
}));

export default useConnection;
