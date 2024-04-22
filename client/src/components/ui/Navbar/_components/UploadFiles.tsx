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
import { z } from 'zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { validateJsonFiles } from '@/lib/validators';
import { useStore } from '@/hooks';
import toast from 'react-hot-toast';
import { createNode } from '@/api/nodes';
import { createEdge } from '@/api/edges';

const filesSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(2, { message: 'Two JSON files are required' })
    .max(2, { message: 'Only two JSON files are allowed' }),
});

const UploadFileDialog = () => {
  const { nodes, edges, setNodes } = useStore();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<{ files: File[] }>({
    resolver: zodResolver(filesSchema),
  });

  const onSubmit: SubmitHandler<{ files: File[] }> = async (
    data: z.infer<typeof filesSchema>
  ) => {
    const errorMessage = await validateJsonFiles(data.files);
    if (errorMessage) {
      setError('files', { type: 'manual', message: errorMessage });
      return;
    }

    clearErrors('files');
    data.files.forEach(file => {
      const reader = new FileReader();

      reader.onload = async (e: ProgressEvent<FileReader>) => {
        if (file.name === 'nodes.json') {
          const nodeData = JSON.parse(e.target!.result as string);
          for (const node of nodeData) {
            await createNode(node, nodes, setNodes);
          }
        } else {
          const edgeData = JSON.parse(e.target!.result as string);
          for (const edge of edgeData) {
            await createEdge(edge);
          }
        }
      };
      reader.readAsText(file);
    });
  };

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={e => {
        if (!e) setDialogOpen(false);
      }}
    >
      <DialogTrigger
        onClick={() => {
          if (nodes.length > 0 || edges.length > 0) {
            toast.error(
              'Please clear the current editor before uploading new files'
            );
            return;
          }
          setDialogOpen(true);
        }}
      >
        <Button
          variant="outline"
          className="border-none bg-transparent"
          size="icon"
        >
          <UploadCloud className="size-4 hover:cursor-pointer" />
          <span className="sr-only">Upload nodes.json & edges.json</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Upload nodes.json & edges.json</DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="files"
            control={control}
            defaultValue={[]}
            render={({ field: { onChange, onBlur } }) => (
              <input
                type="file"
                onBlur={onBlur}
                onChange={e => onChange([...e.target.files!])}
                multiple
                required
              />
            )}
          />
          {errors.files && (
            <p className="my-2 text-red-500">{errors.files.message}</p>
          )}
          <Button type="submit">Submit</Button>
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
