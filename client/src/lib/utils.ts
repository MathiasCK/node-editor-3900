import toast from 'react-hot-toast';
import {
  getConnectedEdges,
  type Connection,
  type Edge,
  type Node,
} from 'reactflow';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  AspectType,
  ConnectionWithChildren,
  ConnectionWithTarget,
  EdgeType,
  NodeRelation,
  NodeType,
  UpdateNode,
} from './types';
import { Sidebar } from '@/hooks/useSidebar';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const checkConnection = (
  params: Edge | Connection,
  edgeType: EdgeType,
  nodes: Node[]
): {
  canConnect: boolean;
  connectionType: EdgeType;
  lockConnection: boolean;
  newNodeRelations: NodeRelation[];
} => {
  const newNodeRelations: NodeRelation[] = [];
  let canConnect = true;
  let connectionType = edgeType;
  let lockConnection = false;

  if (params.source === params.target) {
    toast.error('Cannot connect node to itself');
    canConnect = false;
  }

  // Set terminalOf property for terminal
  if (
    isTerminal(params.sourceHandle as string) &&
    isBlock(params.targetHandle as string)
  ) {
    newNodeRelations.push({
      nodeId: params.source as string,
      array: {
        terminalOf: {
          id: params.target as string,
        },
      },
    });
  }

  // Set transfersTo property for terminal
  if (
    isTerminal(params.sourceHandle as string) &&
    isTerminal(params.targetHandle as string)
  ) {
    // Check if terminal is already connected to other terminals
    const targetTerminal = nodes.find(node => node.id === params.target);
    const sourceTerminal = nodes.find(node => node.id === params.source);

    if (targetTerminal?.data?.transfersTo) {
      toast.error(
        `Terminal ${params.target} is already transfered to another terminal`
      );
      canConnect = false;
    } else if (sourceTerminal?.data?.transfersTo) {
      toast.error(
        `Terminal ${params.source} is already transfered to another terminal`
      );
      canConnect = false;
    } else {
      lockConnection = true;
      connectionType = EdgeType.Transfer;

      newNodeRelations.push({
        nodeId: params.source as string,
        value: {
          transfersTo: params.target as string,
        },
      });

      newNodeRelations.push({
        nodeId: params.target as string,
        value: {
          transfersTo: params.source as string,
        },
      });
    }
  }

  return { canConnect, connectionType, lockConnection, newNodeRelations };
};

export const handleNewNodeRelations = (
  newNodeRelations: NodeRelation[],
  nodes: Node[],
  setNodes: (nodes: Node[]) => void
) => {
  for (const relation of newNodeRelations) {
    const nodeToUpdate = nodes.find(node => node.id === relation.nodeId);
    const index = nodes.findIndex(node => node.id === relation.nodeId);

    if (!nodeToUpdate || index === -1) return;

    if (relation.value) {
      const keyToUpdate = Object.keys(relation.value)[0];
      nodeToUpdate.data[keyToUpdate] = relation.value[keyToUpdate];
    }

    if (relation.array) {
      const arrayToUpdate = Object.keys(relation.array)[0];

      nodeToUpdate.data[arrayToUpdate] = [
        ...(nodeToUpdate.data[arrayToUpdate] ?? []),
        relation.array[arrayToUpdate],
      ];
    }

    updateNodeData(index, nodeToUpdate, nodes, setNodes);
  }
};

export const isBlock = (id: string): boolean => id.includes('block');

export const isConnector = (id: string): boolean => id.includes('connector');

export const isTerminal = (id: string): boolean => id.includes('terminal');

export const isTextBox = (id: string): boolean => id.includes('textbox');

export const getSymmetricDifference = (arr1: Edge[], arr2: Edge[]): Edge[] => {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  const difference = new Set(
    [...set1]
      .filter(x => !set2.has(x))
      .concat([...set2].filter(x => !set1.has(x)))
  );

  return Array.from(difference);
};

export const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const addNode = (
  aspect: AspectType,
  type: NodeType,
  nodes: Node[],
  setNodes: (nodes: Node[]) => void
) => {
  const id = nodes.length.toString();
  const currentDate = Date.now();
  const newNode: Node = {
    id,
    type,
    position: {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    },
    data: {
      aspect,
      label: `${type}_${id}`,
      type,
      id,
      createdAt: currentDate,
      updatedAt: currentDate,
    },
  };

  if (isBlock(type)) {
    newNode.data.hasTerminal = false;
    newNode.data.hasConnector = false;
  }

  if (isTerminal(type)) {
    newNode.data.hasConnector = false;
    newNode.data.terminalOf = null;
    newNode.data.transfersTo = null;
  }

  setNodes([...nodes, newNode]);
};

export const updateNode = (
  nodeId: string,
  newNodeData: UpdateNode,
  nodes: Node[],
  setNodes: (nodes: Node[]) => void
) => {
  const nodeToUpdate = nodes.find(node => node.id === nodeId);
  const index = nodes.findIndex(node => node.id === nodeId);

  if (!nodeToUpdate || index === -1) {
    toast.error('Could not update name -> no node selected');
    return;
  }

  Object.keys(newNodeData).forEach(key => {
    // @ts-ignore
    nodeToUpdate.data[key] = newNodeData[key];
  });

  updateNodeData(index, nodeToUpdate, nodes, setNodes);

  if (newNodeData.aspect) {
    toast.success('Aspect type updated');
  }

  if (newNodeData.customName) {
    toast.success('Name updated');
  }
};

export const deleteSelectedNode = (
  selectedNodeId: string,
  edges: Edge[],
  setEdges: (edges: Edge[]) => void,
  nodes: Node[],
  setNodes: (nodes: Node[]) => void
): void => {
  const currentNode = nodes.find(node => node.id === selectedNodeId);

  if (!currentNode) {
    toast.error('Could not delete -> no node selected');
    return;
  }

  const connectedEdges = getConnectedEdges([currentNode], edges);

  for (const edge of connectedEdges) {
    updateNodeRelations(edge, nodes, setNodes);
  }

  const updatedEdges = getSymmetricDifference(edges, connectedEdges);

  const updatedNodes = nodes.filter(node => node.id !== selectedNodeId);

  setNodes(updatedNodes);
  setEdges(updatedEdges);

  toast.success(
    `${capitalizeFirstLetter(currentNode.data.type)} ${selectedNodeId} deleted`
  );
};

export const deleteEdgeWithRelations = (
  currentEdgeId: string,
  edges: Edge[],
  setEdges: (nodes: Edge[]) => void,
  nodes: Node[],
  setNodes: (nodes: Node[]) => void
) => {
  const currentEdge = edges.find(edge => edge.id === (currentEdgeId as string));

  if (!currentEdge) {
    toast.error('Could not delete -> no edge selected');
    return;
  }

  deleteSelectedEdge(currentEdge.id, edges, setEdges);

  updateNodeRelations(currentEdge, nodes, setNodes);
};

export const updateNodeRelations = (
  currentEdge: Edge,
  nodes: Node[],
  setNodes: (nodes: Node[]) => void
) => {
  if (
    isTerminal(currentEdge.sourceHandle!) &&
    isTerminal(currentEdge.targetHandle!)
  ) {
    // Deleting a terminal -> terminal connection where "transfersTo" should be updated
    const sourceTerminal = nodes.find(
      terminal => terminal.id === currentEdge.source
    );
    const sourceIndex = nodes.findIndex(
      terminal => terminal.id === currentEdge.source
    );
    const targetTerminal = nodes.find(
      terminal => terminal.id === currentEdge.target
    );
    const targetIndex = nodes.findIndex(
      terminal => terminal.id === currentEdge.target
    );

    if (
      !sourceTerminal ||
      !targetTerminal ||
      sourceIndex === -1 ||
      targetIndex === -1
    )
      return;

    targetTerminal.data.transfersTo = null;
    sourceTerminal.data.transfersTo = null;

    updateNodeData(sourceIndex, sourceTerminal, nodes, setNodes);
    updateNodeData(targetIndex, targetTerminal, nodes, setNodes);
  }
  if (
    isTerminal(currentEdge.sourceHandle!) &&
    isBlock(currentEdge.targetHandle!)
  ) {
    // Deleting a block -> terminal connection where terminalOf array should be updated
    const nodeToUpdate = nodes.find(node => node.id === currentEdge.source);
    const index = nodes.findIndex(node => node.id === currentEdge.source);

    if (!nodeToUpdate || index === -1) return;

    const updatedTerminalOf = nodeToUpdate.data.terminalOf.filter(
      (terminal: { id: string }) => terminal.id !== currentEdge.target
    );

    nodeToUpdate.data.terminalOf = updatedTerminalOf;

    if (updatedTerminalOf.length === 0) {
      nodeToUpdate.data.terminalOf = null;
    }

    updateNodeData(index, nodeToUpdate, nodes, setNodes);
  }
  if (
    currentEdge.data.lockConnection &&
    isBlock(currentEdge.sourceHandle!) &&
    isTerminal(currentEdge.targetHandle!)
  ) {
    // Deleting a connection where block has hasTerminal set to true
    const nodeToUpdate = nodes.find(node => node.id === currentEdge.source);
    const index = nodes.findIndex(node => node.id === currentEdge.source);

    if (!nodeToUpdate || index === -1) return;

    const updatedTerminals = nodeToUpdate.data.terminals.filter(
      (terminal: { id: string }) => terminal.id !== currentEdge.target
    );

    nodeToUpdate.data.terminals = updatedTerminals;

    if (updatedTerminals.length === 0) {
      delete nodeToUpdate.data.terminals;
      nodeToUpdate.data.hasTerminal = false;
    }

    updateNodeData(index, nodeToUpdate, nodes, setNodes);
  }

  if (
    currentEdge.data.lockConnection &&
    (isBlock(currentEdge.sourceHandle!) ||
      isTerminal(currentEdge.sourceHandle!)) &&
    isConnector(currentEdge.targetHandle!)
  ) {
    // Deleting a connection where block or terminal has hasConnector set to true
    const nodeToUpdate = nodes.find(node => node.id === currentEdge.source);
    const index = nodes.findIndex(node => node.id === currentEdge.source);

    if (!nodeToUpdate || index === -1) return;

    const updatedConnectors = nodeToUpdate.data.connectors.filter(
      (connector: { id: string }) => connector.id !== currentEdge.target
    );

    nodeToUpdate.data.connectors = updatedConnectors;

    if (updatedConnectors.length === 0) {
      delete nodeToUpdate.data.connectors;
      nodeToUpdate.data.hasConnector = false;
    }

    updateNodeData(index, nodeToUpdate, nodes, setNodes);
  }
};

export const updateNodeData = (
  index: number,
  nodeToUpdate: Node,
  nodes: Node[],
  setNodes: (nodes: Node[]) => void
) => {
  const newNodes = [...nodes];
  newNodes[index] = nodeToUpdate;

  setNodes(newNodes);
};

export const deleteSelectedEdge = (
  selectedEdgeId: string,
  edges: Edge[],
  setEdges: (edges: Edge[]) => void
): void => {
  const updatedEdges = edges.filter(edge => edge.id !== selectedEdgeId);

  setEdges(updatedEdges);

  toast.success(`Edge ${selectedEdgeId} deleted`);
};

export const getRelatedNodesWithRelations = (
  sidebar: Sidebar,
  edges: Edge[],
  nodes: Node[]
): ConnectionWithChildren[] => {
  const currentNodeRelations = edges.filter(
    edge => edge.source === sidebar.currentNode?.id
  );

  const relatedNodes = currentNodeRelations?.map(r =>
    nodes.find(node => node.id === r?.target)
  );

  const data = currentNodeRelations.map((r, i) => ({
    type: r.data.type,
    target: relatedNodes?.[i]?.id,
    displayName:
      relatedNodes?.[i]?.data?.customName ??
      `${capitalizeFirstLetter(relatedNodes?.[i]?.type as string)} ${
        relatedNodes?.[i]?.id
      }`,
  })) as ConnectionWithTarget[];

  const result = data.reduce(
    (accumulator: ConnectionWithChildren[], currentValue) => {
      const existingEntry = accumulator.find(
        entry => entry.type === currentValue.type
      );
      if (existingEntry) {
        existingEntry.children.push({
          id: currentValue.target,
          displayName: currentValue.displayName,
        });
      } else {
        accumulator.push({
          type: currentValue.type,
          children: [
            {
              id: currentValue.target,
              displayName: currentValue.displayName,
            },
          ],
        });
      }
      return accumulator;
    },
    []
  );

  return result;
};

export const getReadableEdgeType = (type: EdgeType) => {
  switch (type) {
    case EdgeType.Connected:
      return 'Connected to';
    case EdgeType.Fulfilled:
      return 'Fulfilled by';
    case EdgeType.Part:
      return 'Part of';
    case EdgeType.Transfer:
      return 'Transfer to';
    default:
      return null;
  }
};
