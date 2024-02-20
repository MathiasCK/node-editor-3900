import type { CustomNodeProps, CustomEdgeProps } from '@/lib/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Sidebar = {
  open: boolean;
  edit: boolean;
  currentNode?: CustomNodeProps;
  currentEdge?: CustomEdgeProps;
};

type SidebarState = {
  sidebar: Sidebar;
  openSidebar: (data: CustomNodeProps | CustomEdgeProps) => void;
  closeSidebar: () => void;
  handleEdit: (edit: boolean) => void;
};

const isEdgeProps = (
  data: CustomNodeProps | CustomEdgeProps
): data is CustomEdgeProps =>
  'sourceHandleId' in data && 'targetHandleId' in data;

const useSidebar = create<SidebarState>()(
  persist(
    set => ({
      sidebar: {
        open: false,
        edit: false,
      },
      openSidebar: data => {
        if (isEdgeProps(data)) {
          set({
            sidebar: {
              edit: false,
              open: true,
              currentEdge: data,
            },
          });
        } else {
          set({
            sidebar: {
              edit: false,
              open: true,
              currentNode: data,
            },
          });
        }
      },
      handleEdit: (edit: boolean) => {
        set(state => ({
          sidebar: {
            ...state.sidebar,
            edit: edit,
          },
        }));
      },
      closeSidebar: () =>
        set({
          sidebar: {
            open: false,
            edit: false,
          },
        }),
    }),
    {
      name: 'sidebar-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useSidebar;
