import toast from 'react-hot-toast';
import { type Edge } from 'reactflow';

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
    console.error('Error fetching edges', error);
    toast.error(`Unexpected error: ${(error as Error).message}`);
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
      loadingToastId && toast.dismiss(loadingToastId);
      return null;
    }

    const createdEdge = await response.json();

    toast.success('Edge created successfully!');
    loadingToastId && toast.dismiss(loadingToastId);

    if (createdEdge) {
      createdEdge.id = createdEdge.id.toString();
      const newEdges = edges.concat(createdEdge as Edge);
      setEdges(newEdges);
    }

    return createdEdge as Edge;
  } catch (error) {
    console.error('Error creating edge', error);
    toast.error(`Unexpected error: ${(error as Error).message}`);
    return null;
  }
};
