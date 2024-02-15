import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { useSheet } from "@/hooks";

const Info = () => {
  const { sheet, closeSheet } = useSheet();

  console.log(sheet);

  const displayName = sheet.currentNode
    ? `${sheet.currentNode.type} ${sheet.currentNode.id}`
    : `Edge ${sheet.currentEdge?.source} -> ${sheet.currentEdge?.target}`;

  const createdAt = new Date().toLocaleString(
    sheet.currentNode
      ? sheet.currentNode?.data?.createdAt
      : sheet.currentEdge?.data?.createdAt,
  );

  return (
    <Sheet open={sheet?.open} onOpenChange={() => closeSheet()}>
      <SheetContent className="dark:bg-black">
        <SheetHeader>
          <SheetTitle className="uppercase dark:text-white">
            {displayName}
          </SheetTitle>
          <SheetDescription>Created: {createdAt}</SheetDescription>
        </SheetHeader>
        <button>Delete</button>
      </SheetContent>
    </Sheet>
  );
};

export default Info;
