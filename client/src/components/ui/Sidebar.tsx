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
import { Edge, addEdge } from "reactflow";
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
  deleteSelectedEdge,
  deleteSelectedNode,
  updateNodeName,
  updateNodeRelations,
} from "@/lib/utils";
import { Input } from "./input";
import { shallow } from "zustand/shallow";

const Sidebar = () => {
  const { sidebar, handleEdit, closeSidebar } = useSidebar();
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
      const currentEdge = edges.find(
        edge => edge.id === (sidebar.currentEdge?.id as string),
      );

      if (!currentEdge) {
        toast.error("Could not delete -> no edge selected");
        return;
      }

      deleteSelectedEdge(currentEdge.id, edges, setEdges);
      updateNodeRelations(currentEdge, nodes, setNodes);
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
        <SheetFooter>
          {(connectionType !== sidebar.currentEdge?.data?.type ||
            nodeName !== displayName) && (
            <button
              className={buttonVariants.verbose}
              onClick={() => {
                if (sidebar.currentEdge) {
                  return handleConnectionTypeChange();
                }
                handleNodeNameChange();
              }}
            >
              Update
            </button>
          )}
          <button className={buttonVariants.danger} onClick={handleDelete}>
            Delete
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
