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

  return (
    <Sheet open={sheet?.open} onOpenChange={() => closeSheet()}>
      <SheetContent className="dark:bg-black">
        <SheetHeader>
          <SheetTitle className="uppercase dark:text-white">
            {sheet.data?.title}
          </SheetTitle>
          <SheetDescription>{sheet.data?.subtitle}</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default Info;
