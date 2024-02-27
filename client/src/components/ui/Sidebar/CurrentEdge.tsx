import { EdgeType, type CustomEdgeProps } from '@/lib/types';
import { deleteEdgeWithRelations } from '@/lib/utils';
import { FC, useState } from 'react';
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
import { type Edge, addEdge } from 'reactflow';
import toast from 'react-hot-toast';

interface Props {
  currentEdge: CustomEdgeProps;
}

const CurrentEdge: FC<Props> = ({ currentEdge }) => {
  const { closeSidebar } = useSidebar();
  const { edges, setEdges, nodes, setNodes } = useStore();

  const [connectionType, setConnectionType] = useState<string>(
    currentEdge.data?.type as string
  );

  const displayName = `Edge ${currentEdge.source} -> ${currentEdge.target}`;

  const handleConnectionTypeChange = () => {
    const clonedConnection = {
      data: {
        label: `Edge ${currentEdge.source} -> ${currentEdge.target}`,
        type: connectionType,
        createdAt: currentEdge.data?.createdAt,
        updatedAt: Date.now(),
      },
      source: currentEdge.source,
      sourceHandle: currentEdge.sourceHandleId,
      target: currentEdge.target,
      targetHandle: currentEdge.targetHandleId,
      type: connectionType,
    };

    const filteredEdges = edges.filter(e => e.id !== currentEdge.id);

    const newEdges = addEdge(clonedConnection as Edge, filteredEdges);
    setEdges(newEdges);
    closeSidebar();
    toast.success(`${displayName} connection updated`);
  };

  const handleDelete = () => {
    deleteEdgeWithRelations(
      currentEdge.id as string,
      edges,
      setEdges,
      nodes,
      setNodes
    );

    closeSidebar();
  };
  return (
    <SheetContent className="bg:background flex flex-col justify-between">
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
        <p className="mb-2 text-sm text-muted-foreground">Connection type</p>
        <Select
          disabled={currentEdge.data.lockConnection}
          value={connectionType}
          onValueChange={e => setConnectionType(e)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={connectionType} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={EdgeType.Part}>Part of</SelectItem>
              <SelectItem value={EdgeType.Connected}>Connected to</SelectItem>
              <SelectItem value={EdgeType.Transfer}>Transfer to</SelectItem>
              <SelectItem value={EdgeType.Fulfilled}>Fulfilled by</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <SheetFooter>
        {connectionType !== currentEdge.data?.type && (
          <Button
            className={buttonVariants.verbose}
            variant="outline"
            onClick={handleConnectionTypeChange}
          >
            Update
          </Button>
        )}
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
