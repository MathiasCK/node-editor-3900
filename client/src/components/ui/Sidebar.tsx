import toast from "react-hot-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./sheet";
import { storeSelector, useSidebar, useStore } from "@/hooks";
import { buttonVariants } from "@/lib/config";
import { Edge, Position, addEdge } from "reactflow";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { EdgeType } from "@/lib/types";
import { Pencil } from "lucide-react";
import {
  capitalizeFirstLetter,
  cn,
  deleteEdgeWithRelations,
  deleteSelectedNode,
  updateNodeName,
} from "@/lib/utils";
import { Input } from "./input";
import { shallow } from "zustand/shallow";
import { Button } from "./button";

const Sidebar = () => {
  const { sidebar, handleEdit, closeSidebar, openSidebar } = useSidebar();
  const { edges, setEdges, nodes, setNodes } = useStore(storeSelector, shallow);

  const displayName = capitalizeFirstLetter(
    sidebar.currentNode
      ? sidebar.currentNode?.data?.customName
        ? sidebar.currentNode?.data?.customName
        : `${sidebar.currentNode.type} ${sidebar.currentNode.id}`
      : `Edge ${sidebar.currentEdge?.source} -> ${sidebar.currentEdge?.target}`,
  );

  const createdAt = new Date(
    sidebar.currentNode
      ? (sidebar.currentNode?.data?.createdAt as number)
      : (sidebar.currentEdge?.data?.createdAt as number),
  ).toLocaleString();

  const updatedAt = new Date(
    sidebar.currentNode
      ? (sidebar.currentNode?.data?.updatedAt as number)
      : (sidebar.currentEdge?.data?.updatedAt as number),
  ).toLocaleString();

  const [connectionType, setConnectionType] = useState<string>("");
  const [nodeName, setNodeName] = useState<string>("");

  useEffect(() => {
    setConnectionType(sidebar.currentEdge?.data?.type as string);
  }, [sidebar.currentEdge]);

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
        setNodes,
      );
    } else {
      deleteEdgeWithRelations(
        sidebar.currentEdge?.id as string,
        edges,
        setEdges,
        nodes,
        setNodes,
      );
    }
    closeSidebar();
    handleEdit(false);
  };

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

  const handleNodeNameChange = () => {
    updateNodeName(
      sidebar.currentNode?.id as string,
      nodeName,
      nodes,
      setNodes,
    );
    handleEdit(false);
  };

  const displayNewNode = (newNodeId: string) => {
    const node = nodes.find(n => n.id === newNodeId);

    if (!node) {
      toast.error(
        `Could not display node ${newNodeId}. Refresh page & try again`,
      );
      return;
    }
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
          <SheetTitle className="uppercase flex items-center dark:text-white">
            {!sidebar.edit ? (
              <Pencil
                onClick={() => handleEdit(true)}
                size={15}
                className={cn(
                  "text-md font-semibold text-foreground  hover:cursor-pointer",
                  {
                    hidden: sidebar.currentEdge,
                  },
                )}
              />
            ) : null}

            <Input
              disabled={!sidebar.edit}
              value={nodeName}
              onChange={e => setNodeName(e.target.value)}
              className="border-none text-lg font-semibold text-foreground"
            />
          </SheetTitle>
          <SheetDescription>Created: {createdAt}</SheetDescription>
          <SheetDescription>Updated: {updatedAt}</SheetDescription>
        </SheetHeader>
        {sidebar.currentEdge && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">
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
        {sidebar.currentNode?.data?.hasTerminal && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Connected Terminals
            </p>
            {sidebar.currentNode?.data?.terminals!.map((t: string) => (
              <Button
                key={`terminal_${t}_${sidebar.currentNode!.id!}_link_button`}
                onClick={() => displayNewNode(t)}
                variant="ghost"
              >
                {t}
              </Button>
            ))}
          </div>
        )}
        {sidebar.currentNode?.data?.hasConnector && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Connected Connectors
            </p>
            {sidebar.currentNode?.data?.connectors!.map((c: string) => (
              <Button
                key={`connector_${c}_${sidebar.currentNode!.id!}_link_button`}
                onClick={() => displayNewNode(c)}
                variant="ghost"
              >
                {c}
              </Button>
            ))}
          </div>
        )}
        <SheetFooter>
          {(connectionType !== sidebar.currentEdge?.data?.type ||
            nodeName !== displayName) && (
            <Button
              className={buttonVariants.verbose}
              variant="outline"
              onClick={() => {
                if (sidebar.currentEdge) {
                  return handleConnectionTypeChange();
                }
                handleNodeNameChange();
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
