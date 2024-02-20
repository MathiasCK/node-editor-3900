import { FC } from 'react';
import { useConnection } from '@/hooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';

import { EdgeType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/lib/config';
import { Button } from './button';

interface Props {
  displayDialog: boolean;
  createNewConnection: () => void;
}

const SelectConnection: FC<Props> = ({
  createNewConnection,
  displayDialog,
}) => {
  const { dialogOpen, edgeType, setEdgeType, closeDialog } = useConnection();
  if (!dialogOpen) return null;

  if (!displayDialog) {
    createNewConnection();
    closeDialog();
    return;
  }

  return (
    <Dialog open={dialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-muted-foreground text-center">
            Select connection type
          </DialogTitle>
        </DialogHeader>
        <div className="flex h-full w-full flex-col items-center justify-center">
          <button
            className={cn(
              `${buttonVariants.edge} border-green-400 text-green-400 hover:bg-green-400 `,
              {
                'border-transparent bg-green-400 text-white':
                  edgeType === EdgeType.Part,
              }
            )}
            onClick={() => setEdgeType(EdgeType.Part)}
          >
            Part of
          </button>
          <button
            className={cn(
              `${buttonVariants.edge} border-blue-200 text-blue-200 hover:bg-blue-200 `,
              {
                'border-transparent bg-blue-200 text-white':
                  edgeType === EdgeType.Connected,
              }
            )}
            onClick={() => setEdgeType(EdgeType.Connected)}
          >
            Connected to
          </button>
          <button
            className={cn(
              `${buttonVariants.edge} border-blue-400 text-blue-400 hover:bg-blue-400 `,
              {
                'border-transparent bg-blue-400 text-white':
                  edgeType === EdgeType.Transfer,
              }
            )}
            onClick={() => setEdgeType(EdgeType.Transfer)}
          >
            Transfer to
          </button>
          <button
            className={cn(
              `${buttonVariants.edge} border-amber-300 text-amber-300 hover:bg-amber-300 `,
              {
                'border-transparent bg-amber-300 text-white':
                  edgeType === EdgeType.Specialisation,
              }
            )}
            onClick={() => setEdgeType(EdgeType.Specialisation)}
          >
            Specialisation of
          </button>
          <button
            className={cn(
              `${buttonVariants.edge} border-dotted border-amber-300 text-amber-300 hover:bg-amber-300`,
              {
                'border-transparent bg-amber-300 text-white':
                  edgeType === EdgeType.Fulfilled,
              }
            )}
            onClick={() => setEdgeType(EdgeType.Fulfilled)}
          >
            Fulfilled by
          </button>
          <button
            className={cn(
              `${buttonVariants.edge} border-gray-200 text-gray-200 hover:bg-gray-200 `,
              {
                'border-transparent bg-gray-200 text-white':
                  edgeType === EdgeType.Proxy,
              }
            )}
            onClick={() => setEdgeType(EdgeType.Proxy)}
          >
            Proxy
          </button>
          <button
            className={cn(
              `${buttonVariants.edge} border-dotted border-gray-200 text-gray-200 hover:bg-gray-200`,
              {
                'border-transparent bg-gray-200 text-white':
                  edgeType === EdgeType.Projection,
              }
            )}
            onClick={() => setEdgeType(EdgeType.Projection)}
          >
            Projection
          </button>
          <Button
            onClick={() => {
              createNewConnection();
              closeDialog();
            }}
          >
            Create connection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectConnection;
