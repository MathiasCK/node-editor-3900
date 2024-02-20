import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './sheet';
import { useSettings, useTheme } from '@/hooks';
import { Switch } from './switch';
import { Label } from './label';

const SidebarSettings = () => {
  const { isOpen, closeSettings } = useSettings();
  const { theme, toggleTheme } = useTheme();
  return (
    <Sheet open={isOpen} onOpenChange={() => closeSettings()}>
      <SheetContent side="left" className="bg:background">
        <SheetHeader>
          <SheetTitle className="uppercase dark:text-white">
            Settings
          </SheetTitle>
          <SheetDescription>Application settings</SheetDescription>
        </SheetHeader>
        <div className="mt-5 flex items-center">
          <Switch
            className="mr-3"
            checked={theme === 'dark'}
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
