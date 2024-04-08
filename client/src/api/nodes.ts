import toast from 'react-hot-toast';
import { getConnectedEdges, type Node, type Edge } from 'reactflow';
import { NodeWithNodeId, type UpdateNode } from '@/lib/types';
import { deleteEdge } from './edges';
import { getSessionDetails } from '@/lib/utils';
import { actions } from '@/pages/state';

export const fetchNodes = async (): Promise<Node[] | null> => {
  const session = getSessionDetails();
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/nodes/${session?.user.username}/all`,
    {
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
    }
  );

  if (response.status === 401) {
    actions.logout('UNAHTORIZED');
    return null;
  }

  if (!response.ok) {
    const status = response.status;
    toast.error(`Error fetching nodes - Status: ${status}`);
    return null;
  }

  const nodes = await response.json();

  return nodes;
};

export const createNode = async (
  node: Node,
  nodes: Node[],
  setNodes: (nodes: Node[]) => void
): Promise<Node | null> => {
  const session = getSessionDetails();
  const loadingToastId = toast.loading('Creating node...');

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/nodes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.token}`,
      },
      body: JSON.stringify(node),
    });

    if (response.status === 401) {
      actions.logout('UNAHTORIZED');
      return null;
    }

    if (!response.ok) {
      const status = response.status;
      toast.success(`Error creating node - Status: ${status}`);
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
    throw error;
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
  const session = getSessionDetails();

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/nodes`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.token}`,
      },
      body: JSON.stringify(nodeToUpdate),
    });

    if (response.status === 401) {
      actions.logout('UNAHTORIZED');
      return null;
    }

    if (!response.ok) {
      const status = response.status;
      toast.success(`Error updating node - Status: ${status}`);
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
    throw error;
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
  const session = getSessionDetails();

  const nodeToDelete = nodes.find(
    node => node.id === nodeToDeleteId
  ) as NodeWithNodeId;

  if (!nodeToDelete.nodeId) {
    toast.error(`Error deleting node - ${nodeToDeleteId} not found`);
    return null;
  }

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
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      }
    );

    if (response.status === 401) {
      actions.logout('UNAHTORIZED');
      return null;
    }

    if (!response.ok) {
      const status = response.status;
      toast.success(`Error deleting node - Status: ${status}`);
      return null;
    }

    toast.success('Node deleted successfully!');

    return nodeToDelete.id;
  } catch (error) {
    toast.error(`Error deleting node: ${(error as Error).message}`);
    throw error;
  } finally {
    loadingToastId && toast.dismiss(loadingToastId);
    const nodes = await fetchNodes();
    if (nodes) {
      setNodes(nodes);
    }
  }
};
