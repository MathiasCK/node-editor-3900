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
import { useSession, useStore } from '@/hooks';
import toast from 'react-hot-toast';
import { uploadNodes } from '@/api/nodes';
import { uploadEdges } from '@/api/edges';
import { EdgeWithEdgeId, NodeWithNodeId } from '@/lib/types';
import { generateNewNodeId } from '@/lib/utils';

const filesSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(2, { message: 'Two JSON files are required' })
    .max(2, { message: 'Only two JSON files are allowed' }),
});

const UploadFileDialog = () => {
  const { user } = useSession();
  const { nodes, edges } = useStore();
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

    const dataToUpload: { nodes: NodeWithNodeId[]; edges: EdgeWithEdgeId[] } = {
      nodes: [],
      edges: [],
    };

    const fileReadPromises = data.files.map(file => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
          try {
            if (file.name === 'nodes.json') {
              dataToUpload.nodes = JSON.parse(e.target!.result as string);
            } else {
              dataToUpload.edges = JSON.parse(e.target!.result as string);
            }
            resolve();
          } catch (error) {
            reject(error);
          }
        };

        reader.onerror = () => reject(reader.error);

        reader.readAsText(file);
      });
    });

    try {
      await Promise.all(fileReadPromises);

      for (const node of dataToUpload.nodes) {
        const currentDate = Date.now();
        // @ts-ignore
        delete node.nodeId;
        node.data.createdBy = user?.id;
        node.data.createdAt = currentDate;
        node.data.updatedAt = currentDate;

        const connectedEdges = dataToUpload.edges.filter(edge =>
          edge.id.includes(node.id)
        );

        const newNodeId = generateNewNodeId(node.id);

        for (const edge of connectedEdges) {
          // @ts-ignore
          delete edge.edgeId;
          edge.id = edge.id.replace(node.id, newNodeId);
          edge.data.createdBy = user?.id;
          edge.data.createdAt = currentDate;
          edge.data.updatedAt = currentDate;
          if (edge.source === node.id) {
            edge.source = newNodeId;
          } else {
            edge.target = newNodeId;
          }
        }
        node.id = newNodeId;
      }

      const uploadedNodes = await uploadNodes(dataToUpload.nodes);
      const uploadedEdges = await uploadEdges(dataToUpload.edges);
      if (uploadedNodes && uploadedEdges) {
        setDialogOpen(false);
      }
    } catch (error) {
      toast.error('There was an error processing the files');
    }
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
