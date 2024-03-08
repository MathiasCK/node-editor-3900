import toast from 'react-hot-toast';
import { type Node } from 'reactflow';
import { CustomNodeProps, type UpdateNode } from '@/lib/types';
import { convertNodePropsToNode } from './utils';

export const createNode = async (
  node: Node,
  nodes: Node[],
  setNodes: (nodes: Node[]) => void
): Promise<Node | null> => {
  const loadingToastId = toast.loading('Creating node...');

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/node`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(node),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      const errorMessage =
        errorBody || 'Error creating node. Please try again.';

      toast.error(errorMessage);
      loadingToastId && toast.dismiss(loadingToastId);
      return null;
    }

    const createdNode = await response.json();

    toast.success('Node created successfully!');
    loadingToastId && toast.dismiss(loadingToastId);

    if (createdNode) {
      createdNode.id = createdNode.id.toString();
      setNodes([...nodes, createdNode]);
    }

    return createdNode as Node;
  } catch (error) {
    console.error('Error creating node', error);
    toast.error(`Unexpected error: ${(error as Error).message}`);
    return null;
  }
};

export const updateNode = async (
  newNodeData: UpdateNode,
  nodeToUpdate: CustomNodeProps,
  nodes: Node[],
  setNodes: (nodes: Node[]) => void
): Promise<Node | null> => {
  const loadingToastId = toast.loading('Updating node...');

  Object.keys(newNodeData).forEach(key => {
    // @ts-ignore
    nodeToUpdate.data[key] = newNodeData[key];
  });

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/node`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(convertNodePropsToNode(nodeToUpdate)),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      const errorMessage =
        errorBody || 'Error updating node. Please try again.';

      toast.error(errorMessage);
      loadingToastId && toast.dismiss(loadingToastId);
      return null;
    }

    const updatedNode = await response.json();

    toast.success('Node updated successfully!');
    loadingToastId && toast.dismiss(loadingToastId);

    if (updatedNode) {
      updatedNode.id = updatedNode.id.toString();
      const updatedNodes = nodes.map(n =>
        n.id === updatedNode.id ? updatedNode : n
      );
      setNodes(updatedNodes);
    }

    return updatedNode as Node;
  } catch (error) {
    console.error('Error updating node', error);
    toast.error(`Unexpected error: ${(error as Error).message}`);
    return null;
  }
};
