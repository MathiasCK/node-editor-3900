import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from '../../button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../tooltip';

const UploadFileDialog = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={e => {
        if (!e) setDialogOpen(false);
      }}
    >
      <DialogTrigger onClick={() => setDialogOpen(true)}>
        <Button
          variant="outline"
          className="border-none bg-transparent"
          size="icon"
        >
          <UploadCloud className="size-4 hover:cursor-pointer" />
          <span className="sr-only">Upload</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Upload Files</DialogHeader>
        <form>
          <input type="file" required />
          <input required type="file" />
          <button type="submit">Submit</button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const UploadFiles = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <UploadFileDialog />
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Upload files
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UploadFiles;
