import {
  AspectType,
  type CustomNodeProps,
  UpdateNode,
  RelationType,
} from '@/lib/types';
import {
  capitalizeFirstLetter,
  deleteSelectedNode,
  getReadableRelation,
  getNodeRelations,
  displayNewNode,
} from '@/lib/utils';
import { FC, useState } from 'react';
import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '../sheet';
import { Pencil } from 'lucide-react';
import { useSidebar, useStore } from '@/hooks';
import { Input } from '../input';
import { Button } from '../button';
import { buttonVariants } from '@/lib/config';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem,
} from '../select';
import { updateNode } from '@/lib/routes';

interface Props {
  currentNode: CustomNodeProps;
}

const CurrentNode: FC<Props> = ({ currentNode }) => {
  const { sidebar, handleEdit, closeSidebar, openSidebar } = useSidebar();
  const { edges, setEdges, nodes, setNodes } = useStore();

  const displayName = capitalizeFirstLetter(
    currentNode?.data?.customName
      ? currentNode?.data?.customName
      : `${currentNode.type} ${currentNode.id}`
  );

  const [nodeName, setNodeName] = useState<string>(displayName);
  const [aspectType, setAspectType] = useState<string>(currentNode.data.aspect);

  const nodeRelations = getNodeRelations(currentNode);

  const updateNodeData = () => {
    const newNodeData: UpdateNode = {};

    if (nodeName !== displayName) {
      newNodeData['customName'] = nodeName;
    }

    if (aspectType !== currentNode?.data?.aspect) {
      newNodeData['aspect'] = aspectType as AspectType;
    }

    updateNode(newNodeData, currentNode, nodes, setNodes);
    handleEdit(false);
  };

  const handleDelete = () => {
    deleteSelectedNode(
      currentNode.id as string,
      edges,
      setEdges,
      nodes,
      setNodes
    );

    closeSidebar();
    handleEdit(false);
  };
  const displayEdit =
    nodeName !== displayName || aspectType !== currentNode?.data?.aspect;

  return (
    <SheetContent className="bg:background flex flex-col justify-between">
      <SheetHeader>
        <SheetTitle className="flex items-center uppercase dark:text-white">
          {!sidebar.edit ? (
            <Pencil
              onClick={() => handleEdit(true)}
              size={15}
              className="text-md text-foreground font-semibold  hover:cursor-pointer"
            />
          ) : null}

          <Input
            disabled={!sidebar.edit}
            value={nodeName}
            onChange={e => setNodeName(e.target.value)}
            className="text-foreground border-none text-lg font-semibold"
          />
        </SheetTitle>
        <SheetDescription>
          Created:{' '}
          {new Date(currentNode.data?.createdAt as number).toLocaleString()}
        </SheetDescription>
        <SheetDescription>
          Updated:{' '}
          {new Date(currentNode.data?.updatedAt as number).toLocaleString()}
        </SheetDescription>
      </SheetHeader>
      <div>
        <p className="text-muted-foreground mb-2 text-sm">Aspect type</p>
        <Select value={aspectType} onValueChange={e => setAspectType(e)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={aspectType} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={AspectType.Function}>Function</SelectItem>
              <SelectItem value={AspectType.Product}>Product</SelectItem>
              <SelectItem value={AspectType.Location}>Location</SelectItem>
              <SelectItem value={AspectType.Empty}>Empty</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {nodeRelations.length > 0 &&
        nodeRelations.map(nodeRelation => (
          <div key={nodeRelation.key}>
            <p className="text-muted-foreground mb-2 text-sm">
              {getReadableRelation(nodeRelation.key as RelationType)}
            </p>
            {nodeRelation.children?.map(c => (
              <Button
                key={`${nodeRelation.key}_${c.id}_link_button`}
                variant="ghost"
                onClick={() =>
                  displayNewNode(
                    c.id as string,
                    nodes,
                    openSidebar,
                    closeSidebar
                  )
                }
              >
                {c.id}
              </Button>
            ))}
          </div>
        ))}
      <SheetFooter>
        {displayEdit && (
          <Button
            className={buttonVariants.verbose}
            variant="outline"
            onClick={updateNodeData}
          >
            Update
          </Button>
        )}
        <Button
          className={buttonVariants.danger}
          variant="outline"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </SheetFooter>
    </SheetContent>
  );
};

export default CurrentNode;
