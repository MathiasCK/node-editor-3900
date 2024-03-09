import toast from 'react-hot-toast';
import { getConnectedEdges, type Node, type Edge } from 'reactflow';
import { CustomNodeProps, NodeWithNodeId, type UpdateNode } from '@/lib/types';
import {
  convertNodePropsToNode,
  getSymmetricDifference,
  updateNodeData,
  updateNodeRelations,
} from '@/lib/utils';

export const fetchNodes = async (): Promise<Node[] | null> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/nodes`);

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
    toast.error(`Unexpected error: ${(error as Error).message}`);
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
    console.error('Error creating node', error);
    toast.error(`Unexpected error: ${(error as Error).message}`);
    return null;
  } finally {
    loadingToastId && toast.dismiss(loadingToastId);
  }
};

export const updateNode = async (
  node: CustomNodeProps | Node,
  nodes: Node[],
  setNodes: (nodes: Node[]) => void,
  newNodeData?: UpdateNode
): Promise<Node | null> => {
  let loadingToastId: string | undefined;
  if (newNodeData) {
    loadingToastId = toast.loading('Updating node...');
  }

  const nodeIndex = nodes.findIndex(n => n.id === node.id);

  if (newNodeData) {
    Object.keys(newNodeData).forEach(key => {
      // @ts-ignore
      node.data[key] = newNodeData[key];
    });
  }

  // Node is of type CustomNodeProps
  // @ts-ignore
  if (node.xPos || node.yPos) {
    node = convertNodePropsToNode(node as CustomNodeProps);
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/nodes`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(node),
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
      updateNodeData(
        nodeIndex,
        updatedNode as unknown as Node,
        nodes,
        setNodes
      );
    }

    return updatedNode as Node;
  } catch (error) {
    console.error('Error updating node', error);
    toast.error(`Unexpected error: ${(error as Error).message}`);
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
) => {
  const nodeToDelete = nodes.find(
    node => node.id === nodeToDeleteId
  ) as NodeWithNodeId;

  if (!nodeToDelete.nodeId) {
    toast.error(`Error deleting node - ${nodeToDeleteId} not found`);
    return;
  }

  const loadingToastId = toast.loading('Deleting node...');
  const connectedEdges = getConnectedEdges([nodeToDelete], edges);

  for (const edge of connectedEdges) {
    await updateNodeRelations(edge, nodes, setNodes, nodeToDelete.id);
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

    setNodes(nodes.filter(node => node.id !== nodeToDelete.id));

    const updatedEdges = getSymmetricDifference(edges, connectedEdges);
    setEdges(updatedEdges);
  } catch (error) {
    console.error('Error updating node', error);
    toast.error(`Unexpected error: ${(error as Error).message}`);
    return null;
  } finally {
    loadingToastId && toast.dismiss(loadingToastId);
  }
};
