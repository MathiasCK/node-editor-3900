import {
  downloadEdgesFile,
  downloadNodesFile,
  downloadTxtFile,
} from '@/lib/utils';
import { Button } from '../../button';
import { DownloadCloud } from 'lucide-react';
import { storeSelector, useStore } from '@/hooks';
import { shallow } from 'zustand/shallow';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../tooltip';

const DownloadNodes = () => {
  const { nodes, edges } = useStore(storeSelector, shallow);
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
              onClick={() => {
                downloadTxtFile(nodes);
                downloadNodesFile(nodes);
                downloadEdgesFile(edges);
              }}
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
