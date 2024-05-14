import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../tooltip';

const ThemeToggle = () => {
  const { toggleTheme } = useTheme();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center justify-center rounded-sm p-3 hover:bg-muted">
            <Moon
              onClick={() => toggleTheme('dark')}
              className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            />
            <Sun
              onClick={() => toggleTheme('light')}
              className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
            <span className="sr-only">Toggle theme</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Toggle theme
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ThemeToggle;
