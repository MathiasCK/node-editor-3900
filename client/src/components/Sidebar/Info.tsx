import toast from "react-hot-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { useSheet } from "@/hooks";
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
} from "../ui/select";

interface InfoProps {
  deleteSelectedNode: (selectedNodeId: string) => void;
  deleteSelectedEdge: (selectedEdgeId: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setEdges: (value: React.SetStateAction<Edge<any>[]>) => void;
}

const Info = ({
  deleteSelectedNode,
  deleteSelectedEdge,
  setEdges,
}: InfoProps) => {
  const { sheet, closeSheet } = useSheet();

  const [connectionType, setConnectionType] = useState<string>("");

  useEffect(() => {
    setConnectionType(sheet.currentEdge?.data?.type);
  }, [sheet.currentEdge]);

  const displayName = sheet.currentNode
    ? `${sheet.currentNode.type} ${sheet.currentNode.id}`
    : `Edge ${sheet.currentEdge?.source} -> ${sheet.currentEdge?.target}`;

  const createdAt = new Date().toLocaleString(
    sheet.currentNode
      ? sheet.currentNode?.data?.createdAt
      : sheet.currentEdge?.data?.createdAt,
  );

  const handleDelete = () => {
    if (sheet.currentNode) {
      deleteSelectedNode(sheet.currentNode.id as string);
    } else {
      deleteSelectedEdge(sheet.currentEdge?.id as string);
    }
    closeSheet();
    toast.success(`${displayName} deleted`);
  };

  const handleConnectionTypeChange = () => {
    const clonedConnection = {
      data: {
        label: `Edge ${sheet.currentEdge?.source} -> ${sheet.currentEdge?.target}`,
        type: connectionType,
        createdAt: sheet.currentEdge?.data?.createdAt,
      },
      source: sheet.currentEdge?.source,
      sourceHandle: sheet.currentEdge?.sourceHandleId,
      target: sheet.currentEdge?.target,
      targetHandle: sheet.currentEdge?.targetHandleId,
      type: connectionType,
    };
    deleteSelectedEdge(sheet.currentEdge?.id as string);
    setEdges(eds => addEdge(clonedConnection as Edge, eds));
    closeSheet();
    toast.success(`${displayName} updated`);
  };

  return (
    <Sheet open={sheet?.open} onOpenChange={() => closeSheet()}>
      <SheetContent className="dark:bg-black flex flex-col justify-between">
        <SheetHeader>
          <SheetTitle className="uppercase dark:text-white">
            {displayName}
          </SheetTitle>
          <SheetDescription>Created: {createdAt}</SheetDescription>
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
                  <SelectItem value="part">Part of</SelectItem>
                  <SelectItem value="connected">Connected to</SelectItem>
                  <SelectItem value="transfer">Transfer to</SelectItem>
                  <SelectItem value="specialisation">
                    Specialisation of
                  </SelectItem>
                  <SelectItem value="fulfilled">Fulfilled by</SelectItem>
                  <SelectItem value="projection">Projection</SelectItem>
                  <SelectItem value="proxy">Proxy</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
        <SheetFooter>
          {sheet.currentEdge &&
            connectionType !== sheet.currentEdge?.data?.type && (
              <button
                className={buttonVariants.verbose}
                onClick={handleConnectionTypeChange}
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
