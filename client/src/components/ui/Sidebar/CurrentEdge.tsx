import { EdgeType, type CustomEdgeProps } from '@/lib/types';
import { displayNewNode, updateNodeConnectionData } from '@/lib/utils';
import { FC } from 'react';
import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '../sheet';
import { Input } from '../input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';
import { Button } from '../button';
import { buttonVariants } from '@/lib/config';
import { useSidebar, useStore } from '@/hooks';
import { deleteEdge, updateEdge } from '@/api/edges';

interface Props {
  currentEdge: CustomEdgeProps;
}

const CurrentEdge: FC<Props> = ({ currentEdge }) => {
  const { openSidebar, closeSidebar } = useSidebar();
  const { edges, setEdges, nodes, setNodes } = useStore();

  const sourceNode = nodes.find(node => node.id === currentEdge.source);
  const targetNode = nodes.find(node => node.id === currentEdge.target);

  const displayName = `Edge ${sourceNode?.data.customName ? sourceNode.data.customName : sourceNode?.data.label} -> ${targetNode?.data.customName ? targetNode.data.customName : targetNode?.data.label}`;

  const handleConnectionTypeChange = async (newEdgeType: EdgeType) => {
    const edge = await updateEdge(
      currentEdge.id as string,
      edges,
      setEdges,
      newEdgeType
    );
    if (edge) {
      await updateNodeConnectionData(
        currentEdge.source,
        currentEdge.target,
        nodes,
        setNodes,
        currentEdge.type as EdgeType
      );

      currentEdge.type = newEdgeType;
      closeSidebar();
      setTimeout(() => {
        openSidebar(currentEdge);
      }, 300);
    }
  };

  const handleDelete = async () => {
    await deleteEdge(
      currentEdge.id as string,
      edges,
      setEdges,
      nodes,
      setNodes
    );

    closeSidebar();
  };

  const sourceNodeLabel =
    sourceNode?.data?.customName === ''
      ? sourceNode?.data?.label
      : sourceNode?.data?.customName;
  const targetNodeLabel =
    targetNode?.data?.customName === ''
      ? targetNode?.data?.label
      : targetNode?.data?.customName;

  return (
    <SheetContent className="bg:background z-40 flex flex-col justify-between">
      <SheetHeader>
        <SheetTitle className="flex items-center uppercase dark:text-white">
          <Input
            disabled={true}
            value={displayName}
            className="border-none text-lg font-semibold text-foreground"
          />
        </SheetTitle>
        <SheetDescription>
          Created:{' '}
          {new Date(currentEdge.data?.createdAt as number).toLocaleString()}
        </SheetDescription>
        <SheetDescription>
          Updated:{' '}
          {new Date(currentEdge.data?.updatedAt as number).toLocaleString()}
        </SheetDescription>
      </SheetHeader>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">Source node</p>
        <Button
          variant="ghost"
          onClick={() =>
            displayNewNode(currentEdge.source, nodes, openSidebar, closeSidebar)
          }
        >
          {sourceNodeLabel}
        </Button>
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">Connection type</p>
        <Select
          disabled={currentEdge.data.lockConnection}
          value={currentEdge.type}
          onValueChange={e => handleConnectionTypeChange(e as EdgeType)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={currentEdge.type} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={EdgeType.Part}>Part of</SelectItem>
              <SelectItem value={EdgeType.Connected} className="hidden">
                Connected to
              </SelectItem>
              <SelectItem value={EdgeType.Fulfilled}>Fulfilled by</SelectItem>
              <SelectItem className="hidden" value={EdgeType.Transfer}>
                Transfer
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">Target node</p>
        <Button
          variant="ghost"
          onClick={() =>
            displayNewNode(currentEdge.target, nodes, openSidebar, closeSidebar)
          }
        >
          {targetNodeLabel}
        </Button>
      </div>
      <SheetFooter>
        <Button
          className={buttonVariants.danger}
          variant="outline"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </SheetFooter>
    </SheetContent>
  );
};

export default CurrentEdge;
