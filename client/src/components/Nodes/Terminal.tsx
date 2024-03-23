import Handles from './Handles';
import { useSidebar } from '@/hooks';
import type { CustomNodeProps } from '@/lib/types';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '../ui/tooltip';

const Terminal = (props: CustomNodeProps) => {
  const { openSidebar } = useSidebar();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <figure id={props.data.label}>
            <div
              onClick={() => openSidebar(props)}
              className={`h-4 w-4 bg-${props.data.aspect}-light dark:bg-${props.data.aspect}-dark`}
            >
              <header className="flex h-full w-full items-center justify-center">
                <p
                  className={`text-center text-${props.data.aspect}-foreground-light dark:text-${props.data.aspect}-foreground-dark`}
                >
                  {props.id}
                </p>
              </header>
            </div>

            <Handles nodeId={props.data.label} />
          </figure>
        </TooltipTrigger>
        {props.data.customName !== '' && (
          <TooltipContent>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {props.data.customName}
            </p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default Terminal;
