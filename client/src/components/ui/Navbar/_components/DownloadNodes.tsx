import { downloadZipFile } from '@/lib/utils/download';
import { Button } from '../../button';
import { DownloadCloud } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../tooltip';

const DownloadNodes = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button
            variant="outline"
            className="border-none bg-transparent"
            size="icon"
          >
            <DownloadCloud
              onClick={downloadZipFile}
              className="size-4 hover:cursor-pointer"
            />
            <span className="sr-only">Download</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Download nodes
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DownloadNodes;
