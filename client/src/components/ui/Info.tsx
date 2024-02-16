import toast from "react-hot-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./sheet";
import { storeSelector, useSheet, useStore } from "@/hooks";
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
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { Input } from "./input";
import { shallow } from "zustand/shallow";

interface InfoProps {
  deleteSelectedNode: (selectedNodeId: string) => void;
  deleteSelectedEdge: (selectedEdgeId: string, displayToast?: boolean) => void;
  updateNodeName: (nodeId: string, newValue: string) => void;
}

const Info = ({
  deleteSelectedNode,
  deleteSelectedEdge,
  updateNodeName,
}: InfoProps) => {
  const { sheet, closeSheet } = useSheet();
  const { edges, setEdges } = useStore(storeSelector, shallow);

  const displayName = capitalizeFirstLetter(
    sheet.currentNode
      ? sheet.currentNode?.data?.customName
        ? sheet.currentNode?.data?.customName
        : `${sheet.currentNode.type} ${sheet.currentNode.id}`
      : `Edge ${sheet.currentEdge?.source} -> ${sheet.currentEdge?.target}`,
  );

  const createdAt = new Date(
    sheet.currentNode
      ? sheet.currentNode?.data?.createdAt
      : sheet.currentEdge?.data?.createdAt,
  ).toLocaleString();

  const updatedAt = new Date(
    sheet.currentNode
      ? sheet.currentNode?.data?.updatedAt
      : sheet.currentEdge?.data?.updatedAt,
  ).toLocaleString();

  const [edit, setEdit] = useState<boolean>(false);
  const [connectionType, setConnectionType] = useState<string>("");
  const [nodeName, setNodeName] = useState<string>("");

  useEffect(() => {
    setConnectionType(sheet.currentEdge?.data?.type);
  }, [sheet.currentEdge]);

  useEffect(() => {
    setNodeName(displayName);
  }, [displayName, sheet.currentNode]);

  const handleDelete = () => {
    if (sheet.currentNode) {
      deleteSelectedNode(sheet.currentNode.id as string);
    } else {
      deleteSelectedEdge(sheet.currentEdge?.id as string);
    }
    closeSheet();
    setEdit(false);
  };

  const handleConnectionTypeChange = () => {
    const clonedConnection = {
      data: {
        label: `Edge ${sheet.currentEdge?.source} -> ${sheet.currentEdge?.target}`,
        type: connectionType,
        createdAt: sheet.currentEdge?.data?.createdAt,
        updatedAt: Date.now(),
      },
      source: sheet.currentEdge?.source,
      sourceHandle: sheet.currentEdge?.sourceHandleId,
      target: sheet.currentEdge?.target,
      targetHandle: sheet.currentEdge?.targetHandleId,
      type: connectionType,
    };

    const filteredEdges = edges.filter(e => e.id !== sheet.currentEdge?.id);

    const newEdges = addEdge(clonedConnection as Edge, filteredEdges);
    setEdges(newEdges);
    closeSheet();
    toast.success(`${displayName} connection updated`);
  };

  const handleNodeNameChange = () => {
    updateNodeName(sheet.currentNode?.id as string, nodeName);
    setEdit(false);
  };

  return (
    <Sheet
      open={sheet?.open}
      onOpenChange={() => {
        closeSheet();
        setEdit(false);
      }}
    >
      <SheetContent className="bg:background flex flex-col justify-between">
        <SheetHeader>
          <SheetTitle className="uppercase flex items-center dark:text-white">
            {!edit ? (
              <Pencil
                onClick={() => setEdit(true)}
                size={15}
                className={cn(
                  "text-md font-semibold text-foreground  hover:cursor-pointer",
                  {
                    hidden: sheet.currentEdge,
                  },
                )}
              />
            ) : null}

            <Input
              disabled={!edit}
              value={nodeName}
              onChange={e => setNodeName(e.target.value)}
              className="border-none text-lg font-semibold text-foreground"
            />
          </SheetTitle>
          <SheetDescription>Created: {createdAt}</SheetDescription>
          <SheetDescription>Updated: {updatedAt}</SheetDescription>
        </SheetHeader>
        {sheet.currentEdge && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Connection type
            </p>
            <Select
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
          {(connectionType !== sheet.currentEdge?.data?.type ||
            nodeName !== displayName) && (
            <button
              className={buttonVariants.verbose}
              onClick={() => {
                if (sheet.currentEdge) {
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

export default Info;
