import { useSidebar } from '@/hooks';
import { Sheet } from '../sheet';
import { CurrentEdge, CurrentNode } from '.';

const Sidebar = () => {
  const { sidebar, closeSidebar, handleEdit } = useSidebar();

  return (
    <Sheet
      open={sidebar?.open}
      onOpenChange={() => {
        closeSidebar();
        handleEdit(false);
      }}
    >
      {sidebar.currentNode ? (
        <CurrentNode currentNode={sidebar.currentNode} />
      ) : null}
      {sidebar.currentEdge ? (
        <CurrentEdge currentEdge={sidebar.currentEdge} />
      ) : null}
    </Sheet>
  );
};

export default Sidebar;
