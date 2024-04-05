/* eslint-disable no-console */
import toast from 'react-hot-toast';
import { getConnectedEdges, type Node, type Edge } from 'reactflow';
import { NodeWithNodeId, type UpdateNode } from '@/lib/types';
import { deleteEdge } from './edges';
import { fetchCurrentUser } from '@/lib/utils';

export const fetchNodes = async (username: string): Promise<Node[] | null> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/nodes/${username}/all`
    );

    if (!response.ok) {
      const errorBody = await response.text();
      const errorMessage =
        errorBody || 'Error fetching nodes. Please try again.';

      toast.error(errorMessage);
      return null;
    }

    const nodes = await response.json();

    return nodes;
  } catch (error) {
    console.error('Error fetching nodes', error);
    return null;
  }
};

export const createNode = async (
  node: Node,
  nodes: Node[],
  setNodes: (nodes: Node[]) => void
): Promise<Node | null> => {
  const loadingToastId = toast.loading('Creating node...');

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/nodes`, {
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
      return null;
    }

    const createdNode = await response.json();

    toast.success('Node created successfully!');
    loadingToastId && toast.dismiss(loadingToastId);

    if (createdNode) {
      setNodes([...nodes, createdNode]);
    }

    return createdNode as Node;
  } catch (error) {
    toast.error(`Error creating node: ${(error as Error).message}`);
    console.error(`Error creating node: ${error}`);
    return null;
  } finally {
    loadingToastId && toast.dismiss(loadingToastId);
  }
};

export const updateNode = async (
  nodeToUpdateId: string,
  nodes: Node[],
  setNodes: (nodes: Node[]) => void,
  newNodeData?: UpdateNode
): Promise<Node | null> => {
  let loadingToastId: string | undefined;
  if (newNodeData) {
    loadingToastId = toast.loading('Updating node...');
  }

  const nodeToUpdate = nodes.find(n => n.id === nodeToUpdateId);

  if (!nodeToUpdate) {
    toast.error(`Node with id ${nodeToUpdateId} not found. Please try again.`);
    return null;
  }

  if (newNodeData) {
    Object.keys(newNodeData).forEach(key => {
      // @ts-ignore
      nodeToUpdate.data[key] = newNodeData[key];
    });
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/nodes`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nodeToUpdate),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      const errorMessage =
        errorBody || 'Error updating node. Please try again.';
      toast.error(errorMessage);

      return null;
    }

    const updatedNode = await response.json();

    if (newNodeData) {
      toast.success('Node updated successfully!');
    }

    if (updatedNode) {
      const newNodes = nodes.map(node => {
        if (node.id === updatedNode.id) {
          return updatedNode;
        }
        return node;
      });

      setNodes(newNodes);
    }

    return updatedNode as Node;
  } catch (error) {
    toast.error(`Error updating node: ${(error as Error).message}`);
    console.error(`Error updating node: ${error}`);
    return null;
  } finally {
    loadingToastId && toast.dismiss(loadingToastId);
  }
};

export const deleteNode = async (
  nodeToDeleteId: string,
  nodes: Node[],
  setNodes: (nodes: Node[]) => void,
  edges: Edge[],
  setEdges: (edges: Edge[]) => void
): Promise<string | null> => {
  const nodeToDelete = nodes.find(
    node => node.id === nodeToDeleteId
  ) as NodeWithNodeId;

  if (!nodeToDelete.nodeId) {
    toast.error(`Error deleting node - ${nodeToDeleteId} not found`);
    return null;
  }

  const currentUser = fetchCurrentUser();

  const loadingToastId = toast.loading('Deleting node...');

  const connectedEdges = getConnectedEdges([nodeToDelete], edges);
  for (const edge of connectedEdges) {
    await deleteEdge(
      edge.id as string,
      edges,
      setEdges,
      nodes,
      setNodes,
      nodeToDeleteId
    );
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/nodes/${nodeToDelete.nodeId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      const errorMessage =
        errorBody || 'Error deleting node. Please try again.';

      toast.success(errorMessage);
      return null;
    }

    toast.success('Node deleted successfully!');

    return nodeToDelete.id;
  } catch (error) {
    toast.error(`Error deleting node: ${(error as Error).message}`);
    console.error(`Error deleting node: ${error}`);
    return null;
  } finally {
    loadingToastId && toast.dismiss(loadingToastId);
    const nodes = await fetchNodes(currentUser.username);
    if (nodes) {
      setNodes(nodes);
    }
  }
};
