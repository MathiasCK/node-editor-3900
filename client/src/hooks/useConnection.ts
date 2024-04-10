import { EdgeType } from '@/lib/types';
import { Connection, Edge } from 'reactflow';
import { create } from 'zustand';

type ConnectionState = {
  dialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  edgeType: EdgeType;
  setEdgeType: (edgeType: EdgeType) => void;
  params: Edge | Connection | null;
  setParams: (params: Edge | Connection | null) => void;
};

const useConnection = create<ConnectionState>()(set => ({
  dialogOpen: false,
  params: null,
  edgeType: EdgeType.Part,
  setEdgeType: edgeType => set({ edgeType }),
  setParams: params => set({ params }),
  openDialog: () =>
    set({
      dialogOpen: true,
    }),
  closeDialog: () => set({ dialogOpen: false }),
}));

export default useConnection;
