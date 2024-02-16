import toast from "react-hot-toast";
import {
  getConnectedEdges,
  type Connection,
  type Edge,
  type Node,
} from "reactflow";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { NodeType } from "./types";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const canConnect = (params: Edge | Connection): boolean => {
  if (params.source === params.target) {
    toast.error("Cannot connect node to itself");
    return false;
  }
  if (
    isBlock(params.sourceHandle as string) &&
    isBlock(params.targetHandle as string)
  ) {
    toast.error("Cannot connect block to block");
    return false;
  }
  return true;
};

export const isBlock = (id: string): boolean => id.includes("block");

export const isConnector = (id: string): boolean => id.includes("connector");

export const isTerminal = (id: string): boolean => id.includes("terminal");

export const isTextBox = (id: string): boolean => id.includes("textbox");

export const getSymmetricDifference = (arr1: Edge[], arr2: Edge[]): Edge[] => {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  const difference = new Set(
    [...set1]
      .filter(x => !set2.has(x))
      .concat([...set2].filter(x => !set1.has(x))),
  );

  return Array.from(difference);
};

export const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const addNode = (
  type: NodeType,
  nodes: Node[],
  setNodes: (nodes: Node[]) => void,
) => {
  const id = nodes.length.toString();
  const currentDate = Date.now();
  const newNode = {
    id,
    type,
    position: {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    },
    data: {
      label: `${type}_${id}`,
      type,
      id,
      createdAt: currentDate,
      updatedAt: currentDate,
    },
  };

  setNodes([...nodes, newNode]);
};

export const updateNodeName = (
  nodeId: string,
  newName: string,
  nodes: Node[],
  setNodes: (nodes: Node[]) => void,
) => {
  const nodeToUpdate = nodes.find(node => node.id === nodeId);
  const index = nodes.findIndex(node => node.id === nodeId);

  if (!nodeToUpdate || index === -1) {
    toast.error("Could not update name -> no node selected");
    return;
  }

  nodeToUpdate.data.customName = newName;

  const newNodes = [...nodes];
  newNodes[index] = nodeToUpdate;

  setNodes(newNodes);
  toast.success("Name updated");
};

export const deleteSelectedNode = (
  selectedNodeId: string,
  edges: Edge[],
  setEdges: (edges: Edge[]) => void,
  nodes: Node[],
  setNodes: (nodes: Node[]) => void,
): void => {
  const currentNode = nodes.find(node => node.id === selectedNodeId);

  if (!currentNode) {
    toast.error("Could not delete -> no node selected");
    return;
  }

  const connectedEdges = getConnectedEdges([currentNode], edges);
  const updatedEdges = getSymmetricDifference(edges, connectedEdges);

  const updatedNodes = nodes.filter(node => node.id !== selectedNodeId);

  setNodes(updatedNodes);
  setEdges(updatedEdges);

  toast.success(`Node ${selectedNodeId} deleted`);
};

export const deleteSelectedEdge = (
  selectedEdgeId: string,
  edges: Edge[],
  setEdges: (edges: Edge[]) => void,
): void => {
  const currentEdge = edges.find(edge => edge.id === selectedEdgeId);

  if (!currentEdge) {
    toast.error("Could not delete -> no edge selected");
    return;
  }

  const updatedEdges = edges.filter(edge => edge.id !== selectedEdgeId);

  setEdges(updatedEdges);

  toast.success(`Edge ${selectedEdgeId} deleted`);
};
