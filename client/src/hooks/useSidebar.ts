import type { CustomNodeProps, CustomEdgeProps } from '@/lib/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Sidebar = {
  open: boolean;
  currentNode?: CustomNodeProps;
  currentEdge?: CustomEdgeProps;
};

type SidebarState = {
  sidebar: Sidebar;
  openSidebar: (data: CustomNodeProps | CustomEdgeProps) => void;
  closeSidebar: () => void;
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
      },
      openSidebar: data => {
        if (isEdgeProps(data)) {
          set({
            sidebar: {
              open: true,
              currentEdge: data,
            },
          });
        } else {
          set({
            sidebar: {
              open: true,
              currentNode: data,
            },
          });
        }
      },
      closeSidebar: () =>
        set({
          sidebar: {
            open: false,
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
