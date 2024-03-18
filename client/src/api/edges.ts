/* eslint-disable no-console */
import { EdgeType, EdgeWithEdgeId } from '@/lib/types';
import { updateNodeRelations } from '@/lib/utils';
import toast from 'react-hot-toast';
import { type Edge, type Node } from 'reactflow';

export const fetchEdges = async (): Promise<Edge[] | null> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edges`);

    if (!response.ok) {
      const errorBody = await response.text();
      const errorMessage =
        errorBody || 'Error fetching edges. Please try again.';

      toast.error(errorMessage);
      return null;
    }

    const edges = await response.json();

    return edges;
  } catch (error) {
    console.error(`Error fetching edges: ${error}`);
    return null;
  }
};

export const createEdge = async (
  edge: Edge,
  edges: Edge[],
  setEdges: (edges: Edge[]) => void
): Promise<Edge | null> => {
  const loadingToastId = toast.loading('Creating edge...');

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edges`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(edge),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      const errorMessage =
        errorBody || 'Error creating edge. Please try again.';

      toast.error(errorMessage);
      return null;
    }

    const createdEdge = await response.json();

    toast.success('Edge created successfully!');

    if (createdEdge) {
      createdEdge.id = createdEdge.id.toString();
      const newEdges = edges.concat(createdEdge as Edge);
      setEdges(newEdges);
    }

    return createdEdge as Edge;
  } catch (error) {
    toast.error(`Error creating edge: ${(error as Error).message}`);
    console.error(`Error creating edge: ${error}`);
    return null;
  } finally {
    loadingToastId && toast.dismiss(loadingToastId);
  }
};

export const deleteEdge = async (
  edgeIdToDelete: string,
  edges: Edge[],
  setEdges: (edges: Edge[]) => void,
  nodes: Node[],
  setNodes: (nodes: Node[]) => void,
  nodeToDeleteId?: string
): Promise<string | null> => {
  const edgeToDelete = edges.find(
    edge => edge.id === edgeIdToDelete
  ) as EdgeWithEdgeId;

  if (!edgeToDelete.edgeId) {
    toast.error(`Error deleting edge - ${edgeIdToDelete} not found`);
    return null;
  }

  const loadingToastId = toast.loading('Deleting edge...');
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/edges/${edgeToDelete.edgeId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      const errorMessage =
        errorBody || 'Error deleting edge. Please try again.';

      toast.success(errorMessage);
      return null;
    }

    toast.success('Edge deleted successfully!');

    setEdges(edges.filter(edge => edge.id !== edgeToDelete.id));

    return edgeIdToDelete;
  } catch (error) {
    toast.error(`Error deleting edge: ${(error as Error).message}`);
    console.error(`Error deleting edge: ${error}`);
    return null;
  } finally {
    loadingToastId && toast.dismiss(loadingToastId);
    updateNodeRelations(edgeToDelete, nodes, setNodes, nodeToDeleteId);
  }
};

export const updateEdge = async (
  edgeToUpdateId: string,
  edges: Edge[],
  setEdges: (edges: Edge[]) => void,
  newConnection: EdgeType
): Promise<Edge | null> => {
  const edgeToUpdate = edges.find(edge => edge.id === edgeToUpdateId);

  if (!edgeToUpdate) {
    toast.error(`Error updating edge - ${edgeToUpdateId} not found`);
    return null;
  }

  const loadingToastId = toast.loading('Updating edge...');

  edgeToUpdate.type = newConnection;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edges`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(edgeToUpdate),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      const errorMessage =
        errorBody || 'Error updating edge. Please try again.';

      toast.error(errorMessage);
      loadingToastId && toast.dismiss(loadingToastId);
      return null;
    }

    toast.success('Edge updated successfully!');

    const updatedEdge = await response.json();

    if (updatedEdge) {
      const newEdges = edges.map(edge => {
        if (edge.id === updatedEdge.id) {
          return updatedEdge;
        }
        return edge;
      });

      setEdges(newEdges);
    }

    return updatedEdge as Edge;
  } catch (error) {
    toast.error(`Error updating edge: ${(error as Error).message}`);
    console.error(`Error updating edge: ${error}`);
    return null;
  } finally {
    loadingToastId && toast.dismiss(loadingToastId);
  }
};
