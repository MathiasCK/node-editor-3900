import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { useSettings, useTheme } from "@/hooks";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

const SidebarSettings = () => {
  const { isOpen, closeSettings } = useSettings();
  const { theme, toggleTheme } = useTheme();
  return (
    <Sheet open={isOpen} onOpenChange={() => closeSettings()}>
      <SheetContent side="left" className="dark:bg-black">
        <SheetHeader>
          <SheetTitle className="uppercase dark:text-white">
            Settings
          </SheetTitle>
          <SheetDescription>Application settings</SheetDescription>
        </SheetHeader>
        <div className="flex mt-5 items-center">
          <Switch
            className="mr-3"
            checked={theme === "dark"}
            id="dark-mode"
            onClick={() => {
              toggleTheme();
            }}
          />
          <Label htmlFor="dark-mode" className="text-muted-foreground">
            Dark Mode
          </Label>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SidebarSettings;
