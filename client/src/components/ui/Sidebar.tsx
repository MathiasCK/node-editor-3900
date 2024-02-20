import toast from 'react-hot-toast';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from './sheet';
import { storeSelector, useSidebar, useStore } from '@/hooks';
import { buttonVariants } from '@/lib/config';
import { Edge, Position, addEdge } from 'reactflow';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { AspectType, EdgeType, UpdateNode } from '@/lib/types';
import { Pencil } from 'lucide-react';
import {
  capitalizeFirstLetter,
  cn,
  deleteEdgeWithRelations,
  deleteSelectedNode,
  getReadableEdgeType,
  getRelatedNodesWithRelations,
  updateNode,
} from '@/lib/utils';
import { Input } from './input';
import { shallow } from 'zustand/shallow';
import { Button } from './button';

const Sidebar = () => {
  const { sidebar, handleEdit, closeSidebar, openSidebar } = useSidebar();
  const { edges, setEdges, nodes, setNodes } = useStore(storeSelector, shallow);

  const displayName = capitalizeFirstLetter(
    sidebar.currentNode
      ? sidebar.currentNode?.data?.customName
        ? sidebar.currentNode?.data?.customName
        : `${sidebar.currentNode.type} ${sidebar.currentNode.id}`
      : `Edge ${sidebar.currentEdge?.source} -> ${sidebar.currentEdge?.target}`
  );

  const createdAt = new Date(
    sidebar.currentNode
      ? (sidebar.currentNode?.data?.createdAt as number)
      : (sidebar.currentEdge?.data?.createdAt as number)
  ).toLocaleString();

  const updatedAt = new Date(
    sidebar.currentNode
      ? (sidebar.currentNode?.data?.updatedAt as number)
      : (sidebar.currentEdge?.data?.updatedAt as number)
  ).toLocaleString();

  const [connectionType, setConnectionType] = useState<string>('');
  const [aspectType, setAspectType] = useState<string>('');
  const [nodeName, setNodeName] = useState<string>('');

  useEffect(() => {
    setConnectionType(sidebar.currentEdge?.data?.type as string);
  }, [sidebar.currentEdge]);

  useEffect(() => {
    setAspectType(sidebar.currentNode?.data?.aspect as string);
  }, [sidebar.currentNode]);

  useEffect(() => {
    setNodeName(displayName);
  }, [displayName, sidebar.currentNode]);

  const handleDelete = () => {
    if (sidebar.currentNode) {
      deleteSelectedNode(
        sidebar.currentNode.id as string,
        edges,
        setEdges,
        nodes,
        setNodes
      );
    } else {
      deleteEdgeWithRelations(
        sidebar.currentEdge?.id as string,
        edges,
        setEdges,
        nodes,
        setNodes
      );
    }
    closeSidebar();
    handleEdit(false);
  };

  const nodesWithRelations = sidebar.currentNode
    ? getRelatedNodesWithRelations(sidebar, edges, nodes)
    : [];

  const handleConnectionTypeChange = () => {
    const clonedConnection = {
      data: {
        label: `Edge ${sidebar.currentEdge?.source} -> ${sidebar.currentEdge?.target}`,
        type: connectionType,
        createdAt: sidebar.currentEdge?.data?.createdAt,
        updatedAt: Date.now(),
      },
      source: sidebar.currentEdge?.source,
      sourceHandle: sidebar.currentEdge?.sourceHandleId,
      target: sidebar.currentEdge?.target,
      targetHandle: sidebar.currentEdge?.targetHandleId,
      type: connectionType,
    };

    const filteredEdges = edges.filter(e => e.id !== sidebar.currentEdge?.id);

    const newEdges = addEdge(clonedConnection as Edge, filteredEdges);
    setEdges(newEdges);
    closeSidebar();
    toast.success(`${displayName} connection updated`);
  };

  const updateNodeData = () => {
    const newNodeData: UpdateNode = {};

    if (nodeName !== displayName) {
      newNodeData['customName'] = nodeName;
    }

    if (aspectType !== sidebar.currentNode?.data?.aspect) {
      newNodeData['aspect'] = aspectType as AspectType;
    }

    updateNode(sidebar.currentNode?.id as string, newNodeData, nodes, setNodes);
    handleEdit(false);
  };

  const displayNewNode = (newNodeId: string) => {
    const node = nodes.find(n => n.id === newNodeId);

    if (!node) {
      toast.error(
        `Could not display node ${newNodeId}. Refresh page & try again`
      );
      return;
    }
    closeSidebar();
    setTimeout(() => {
      // @ts-ignore
      openSidebar({
        data: node.data,
        dragging: node.dragging as boolean,
        id: node.id,
        isConnectable: true,
        selected: true,
        type: node.type as string,
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
        xPos: node.position.x,
        yPos: node.position.y,
        zIndex: 0,
      });
    }, 100);
  };

  return (
    <Sheet
      open={sidebar?.open}
      onOpenChange={() => {
        closeSidebar();
        handleEdit(false);
      }}
    >
      <SheetContent className="bg:background flex flex-col justify-between">
        <SheetHeader>
          <SheetTitle className="flex items-center uppercase dark:text-white">
            {!sidebar.edit ? (
              <Pencil
                onClick={() => handleEdit(true)}
                size={15}
                className={cn(
                  'text-md text-foreground font-semibold  hover:cursor-pointer',
                  {
                    hidden: sidebar.currentEdge,
                  }
                )}
              />
            ) : null}

            <Input
              disabled={!sidebar.edit}
              value={nodeName}
              onChange={e => setNodeName(e.target.value)}
              className="text-foreground border-none text-lg font-semibold"
            />
          </SheetTitle>
          <SheetDescription>Created: {createdAt}</SheetDescription>
          <SheetDescription>Updated: {updatedAt}</SheetDescription>
        </SheetHeader>
        {sidebar.currentNode && (
          <div>
            <p className="text-muted-foreground mb-2 text-sm">Aspect type</p>
            <Select value={aspectType} onValueChange={e => setAspectType(e)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={aspectType} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={AspectType.Function}>Function</SelectItem>
                  <SelectItem value={AspectType.Product}>Product</SelectItem>
                  <SelectItem value={AspectType.Location}>Location</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
        {sidebar.currentNode && nodesWithRelations.length > 0 && (
          <>
            {nodesWithRelations.map(nodeRelation => (
              <div key={nodeRelation.type}>
                <p className="text-muted-foreground mb-2 text-sm">
                  {getReadableEdgeType(nodeRelation.type as EdgeType)}
                </p>
                {nodeRelation.children.map(c => (
                  <Button
                    key={`${nodeRelation}_${c.displayName}_link_button`}
                    variant="ghost"
                    onClick={() => displayNewNode(c.id as string)}
                  >
                    {c.displayName}
                  </Button>
                ))}
              </div>
            ))}
          </>
        )}

        {sidebar.currentEdge && (
          <div>
            <p className="text-muted-foreground mb-2 text-sm">
              Connection type
            </p>
            <Select
              disabled={sidebar.currentEdge.data.lockConnection}
              value={connectionType}
              onValueChange={e => setConnectionType(e)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={connectionType} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={EdgeType.Part}>Part of</SelectItem>
                  <SelectItem value={EdgeType.Connected}>
                    Connected to
                  </SelectItem>
                  <SelectItem value={EdgeType.Transfer}>Transfer to</SelectItem>
                  <SelectItem value={EdgeType.Specialisation}>
                    Specialisation of
                  </SelectItem>
                  <SelectItem value={EdgeType.Fulfilled}>
                    Fulfilled by
                  </SelectItem>
                  <SelectItem value={EdgeType.Projection}>
                    Projection
                  </SelectItem>
                  <SelectItem value={EdgeType.Proxy}>Proxy</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
        <SheetFooter>
          {(connectionType !== sidebar.currentEdge?.data?.type ||
            nodeName !== displayName ||
            aspectType !== sidebar.currentNode?.data?.aspect) && (
            <Button
              className={buttonVariants.verbose}
              variant="outline"
              onClick={() => {
                if (sidebar.currentEdge) {
                  return handleConnectionTypeChange();
                }
                updateNodeData();
              }}
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
    </Sheet>
  );
};

export default Sidebar;
