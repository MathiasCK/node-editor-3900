import toast from "react-hot-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { useSheet } from "@/hooks";
import { buttonVariants } from "@/lib/config";

interface InfoProps {
  deleteNode: () => void;
  deleteEdge: () => void;
}

const Info = ({ deleteNode, deleteEdge }: InfoProps) => {
  const { sheet, closeSheet } = useSheet();

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
      deleteNode();
    } else {
      deleteEdge();
    }
    closeSheet();
    toast.success(`${displayName} deleted`);
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
        <button className={buttonVariants.danger} onClick={handleDelete}>
          Delete
        </button>
      </SheetContent>
    </Sheet>
  );
};

export default Info;
