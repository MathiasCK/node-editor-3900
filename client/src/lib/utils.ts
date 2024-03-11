import toast from 'react-hot-toast';
import {
  getConnectedEdges,
  type Connection,
  type Edge,
  type Node,
  Position,
} from 'reactflow';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  AspectType,
  CustomNodeProps,
  EdgeType,
  NodeRelation,
  NodeType,
  RelationKeys,
  RelationKeysWithChildren,
  RelationType,
} from './types';
import { createNode, updateNode } from '@/api/nodes';

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

  // Set terminalOf property for terminal & terminals array for block
  if (
    isTerminal(params.targetHandle as string) &&
    isBlock(params.sourceHandle as string)
  ) {
    lockConnection = true;
    connectionType = EdgeType.Connected;

    newNodeRelations.push({
      nodeId: params.target as string,
      array: {
        terminalOf: {
          id: params.source as string,
        },
      },
    });

    newNodeRelations.push({
      nodeId: params.source as string,
      array: {
        terminals: {
          id: params.target as string,
        },
      },
      value: {
        hasTerminal: true,
      },
    });
  }

  // Set terminalOf property for terminal & terminals array for block
  if (
    isBlock(params.targetHandle as string) &&
    isTerminal(params.sourceHandle as string)
  ) {
    lockConnection = true;
    connectionType = EdgeType.Connected;

    newNodeRelations.push({
      nodeId: params.source as string,
      array: {
        terminalOf: {
          id: params.target as string,
        },
      },
    });

    newNodeRelations.push({
      nodeId: params.target as string,
      array: {
        terminals: {
          id: params.source as string,
        },
      },
      value: {
        hasTerminal: true,
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
    } else if (targetTerminal?.data?.transferedBy) {
      toast.error(
        `Terminal ${params.source} is already transfered by from another terminal`
      );
      canConnect = false;
    } else if (sourceTerminal?.data?.transfersTo) {
      toast.error(
        `Terminal ${params.target} is already transfered to another terminal`
      );
      canConnect = false;
    } else if (sourceTerminal?.data?.transferedBy) {
      toast.error(
        `Terminal ${params.source} is already transfered by from another terminal`
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
          transferedBy: params.source as string,
        },
      });
    }
  }

  if (connectionType === EdgeType.Fulfilled && !lockConnection) {
    newNodeRelations.push({
      nodeId: params.source as string,
      array: {
        fulfilledBy: {
          id: params.target as string,
        },
      },
    });

    newNodeRelations.push({
      nodeId: params.target as string,
      array: {
        fullFills: {
          id: params.source as string,
        },
      },
    });
  }

  if (connectionType === EdgeType.Connected && !lockConnection) {
    newNodeRelations.push({
      nodeId: params.source as string,
      array: {
        connectedTo: {
          id: params.target as string,
        },
      },
    });
  }

  if (connectionType === EdgeType.Part && !lockConnection) {
    newNodeRelations.push({
      nodeId: params.source as string,
      array: {
        directParts: {
          id: params.target as string,
        },
      },
      value: {
        hasDirectPart: true,
      },
    });

    newNodeRelations.push({
      nodeId: params.target as string,
      value: {
        directPartOf: params.source as string,
      },
    });
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

    updateNode(nodeToUpdate.id, nodes, setNodes);
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

export const addNode = async (
  aspect: AspectType,
  type: NodeType,
  nodes: Node[],
  setNodes: (nodes: Node[]) => void
) => {
  const id =
    nodes.length === 0
      ? '0'
      : nodes
          .reduce((max, obj) => Math.max(max, Number(obj.id) + 1), 0)
          .toString();

  const currentDate = Date.now();
  const newNode: Node = {
    type,
    id,
    position: {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    },
    data: {
      aspect,
      label: `${type}_${id}`,
      type,
      createdAt: currentDate,
      updatedAt: currentDate,
    },
  };

  if (isBlock(type) || isConnector(type)) {
    newNode.data.hasTerminal = false;
  }

  if (isTerminal(type)) {
    newNode.data.terminalOf = null;
    newNode.data.transfersTo = null;
  }

  newNode.data.connectedTo = null;
  newNode.data.hasDirectPart = false;
  newNode.data.directParts = null;
  newNode.data.directPartOf = null;
  newNode.data.fulfilledBy = null;
  newNode.data.fullFills = null;
  newNode.data.customName = null;

  await createNode(newNode as Node, nodes, setNodes);
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

export const updateNodeRelations = async (
  currentEdge: Edge,
  nodes: Node[],
  setNodes: (nodes: Node[]) => void,
  nodeIdToDelete?: string
) => {
  if (
    isTerminal(currentEdge.sourceHandle!) &&
    isTerminal(currentEdge.targetHandle!)
  ) {
    // Deleting a terminal -> terminal connection where "transfersTo" should be updated
    const sourceTerminal = nodes.find(
      terminal => terminal.id === currentEdge.source
    );

    const targetTerminal = nodes.find(
      terminal => terminal.id === currentEdge.target
    );

    if (!sourceTerminal || !targetTerminal) return;

    if (targetTerminal.id !== nodeIdToDelete) {
      targetTerminal.data.transferedBy = null;
      await updateNode(targetTerminal.id, nodes, setNodes);
    }

    if (sourceTerminal.id !== nodeIdToDelete) {
      sourceTerminal.data.transfersTo = null;
      await updateNode(sourceTerminal.id, nodes, setNodes);
    }

    return;
  }

  if (
    (isTerminal(currentEdge.sourceHandle!) &&
      isBlock(currentEdge.targetHandle!)) ||
    (isTerminal(currentEdge.targetHandle!) &&
      isBlock(currentEdge.sourceHandle!))
  ) {
    const nodeIdToUpdate =
      currentEdge.target === nodeIdToDelete
        ? currentEdge.source
        : currentEdge.target;
    // Deleting a connection between block and terminal
    const nodeToUpdate = nodes.find(node => node.id === nodeIdToUpdate);

    if (!nodeToUpdate) return;

    if (isBlock(nodeToUpdate.type as string)) {
      const updatedTerminals = nodeToUpdate.data.terminals.filter(
        (terminal: { id: string }) => terminal.id !== nodeIdToDelete
      );

      nodeToUpdate.data.terminals = updatedTerminals;

      if (updatedTerminals.length === 0) {
        delete nodeToUpdate.data.terminals;
        nodeToUpdate.data.terminals = null;
        nodeToUpdate.data.hasTerminal = false;
      }
    }

    if (isTerminal(nodeToUpdate.type as string)) {
      const updatedTerminalOf = nodeToUpdate.data.terminalOf.filter(
        (block: { id: string }) => block.id !== nodeIdToDelete
      );
      nodeToUpdate.data.terminalOf = updatedTerminalOf;

      if (updatedTerminalOf.length === 0) {
        nodeToUpdate.data.updatedTerminalOf = null;
      }
    }

    await updateNode(nodeToUpdate.id, nodes, setNodes);

    return;
  }

  if (
    currentEdge.type === EdgeType.Connected &&
    !currentEdge.data.lockCoonection
  ) {
    const nodeToUpdate = nodes.find(node => node.id === currentEdge.source);

    if (!nodeToUpdate) return;

    const updatedConnectedTo = nodeToUpdate.data.connectedTo.filter(
      (node: { id: string }) => node.id !== currentEdge.target
    );

    nodeToUpdate.data.connectedTo = updatedConnectedTo.length
      ? updatedConnectedTo
      : null;

    updateNode(nodeToUpdate.id, nodes, setNodes);
    return;
  }

  if (currentEdge.type === EdgeType.Part) {
    const sourceNode = nodes.find(node => node.id === currentEdge.source);
    const targetNode = nodes.find(node => node.id === currentEdge.target);

    if (!sourceNode || !targetNode) return;

    targetNode.data.directPartOf = null;

    const filteredDirectParts = sourceNode.data.directParts.filter(
      (part: { id: string }) => part.id !== currentEdge.target
    );

    sourceNode.data.directParts = filteredDirectParts;

    if (filteredDirectParts.length === 0) {
      sourceNode.data.directParts = null;
      sourceNode.data.hasDirectPart = false;
    }

    updateNode(sourceNode.id, nodes, setNodes);
    updateNode(targetNode.id, nodes, setNodes);

    return;
  }

  if (currentEdge.type === EdgeType.Fulfilled) {
    const sourceNode = nodes.find(node => node.id === currentEdge.source);
    const targetNode = nodes.find(node => node.id === currentEdge.target);

    if (!sourceNode || !targetNode) return;

    const updatedFulfilledBy = sourceNode.data.fulfilledBy.filter(
      (node: { id: string }) => node.id !== currentEdge.target
    );

    sourceNode.data.fulfilledBy =
      updatedFulfilledBy.length === 0 ? null : updatedFulfilledBy;

    const updatedFullFills = targetNode.data.fullFills.filter(
      (node: { id: string }) => node.id !== currentEdge.source
    );

    targetNode.data.fullFills =
      updatedFullFills.length === 0 ? null : updatedFullFills;

    updateNode(sourceNode.id, nodes, setNodes);
    updateNode(targetNode.id, nodes, setNodes);

    return;
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

export const getNodeRelations = (
  currentNode: CustomNodeProps
): RelationKeysWithChildren[] => {
  const transformableKeys: RelationKeys[] = [
    'connectedTo',
    'directParts',
    'fulfilledBy',
    'terminals',
    'terminalOf',
    'directPartOf',
    'transfersTo',
    'transferedBy',
    'fullFills',
  ];

  return transformableKeys.reduce(
    (acc: RelationKeysWithChildren[], key: RelationKeys) => {
      if (currentNode.data[key]) {
        let children: { id: string }[];

        if (typeof currentNode.data[key] === 'string') {
          children = [{ id: currentNode.data[key] as string }];
        } else {
          children = currentNode.data[key] as { id: string }[];
        }

        acc.push({
          key,
          children,
        });
      }
      return acc;
    },
    []
  );
};

export const displayNewNode = (
  newNodeId: string,
  nodes: Node[],
  openSidebar: (data: CustomNodeProps) => void,
  closeSidebar: () => void
) => {
  const node = nodes.find(n => n.id === newNodeId);

  if (!node) {
    toast.error(
      `Could not display node ${newNodeId}. Refresh page & try again`
    );
    return;
  }
  closeSidebar();
  setTimeout(() => {
    openSidebar({
      data: node.data,
      dragging: node.dragging as boolean,
      id: node.id,
      isConnectable: true,
      selected: true,
      type: node.type as string,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      xPos: node.position.x,
      yPos: node.position.y,
      zIndex: 0,
    } as CustomNodeProps);
  }, 100);
};

export const updateNodeConnectionData = async (
  sourceNodeId: string,
  targetNodeId: string,
  nodes: Node[],
  setNodes: (nodes: Node[]) => void,
  oldConnection: EdgeType,
  newConnection: EdgeType
): Promise<boolean> => {
  if (
    oldConnection === EdgeType.Transfer ||
    newConnection === EdgeType.Transfer
  ) {
    toast.error('Transfer connection cannot be updated. Delete & create new.');
    return false;
  }

  const targetNode = nodes.find(node => node.id === targetNodeId);
  const sourceNode = nodes.find(node => node.id === sourceNodeId);

  if (!sourceNode || !targetNode) {
    toast.error(
      'Could not find nodes to update connection data. Refresh page & try again.'
    );
    return false;
  }

  if (oldConnection === EdgeType.Part) {
    targetNode.data.directPartOf = null;

    const filteredDirectParts = sourceNode.data.directParts.filter(
      (node: CustomNodeProps) => node.id !== targetNode.id
    );

    sourceNode.data.directParts =
      filteredDirectParts.length > 0 ? filteredDirectParts : null;
  } else if (oldConnection === EdgeType.Fulfilled) {
    const filteredFulfills = targetNode.data.fullFills?.filter(
      (node: CustomNodeProps) => node.id !== sourceNodeId
    );
    targetNode.data.fullFills =
      filteredFulfills?.length > 0 ? filteredFulfills : null;

    const filteredFulfilledBy = sourceNode.data.fulfilledBy?.filter(
      (node: CustomNodeProps) => node.id !== targetNodeId
    );

    sourceNode.data.fulfilledBy =
      filteredFulfilledBy?.length > 0 ? filteredFulfilledBy : null;
  } else {
    const filteredConnections = sourceNode.data.connectedTo?.filter(
      (node: CustomNodeProps) => node.id !== targetNodeId
    );

    sourceNode.data.connectedTo =
      filteredConnections?.length > 0 ? filteredConnections : null;
  }

  if (newConnection === EdgeType.Fulfilled) {
    targetNode.data.fullFills = [
      ...(targetNode.data.fullFills ?? []),
      { id: sourceNodeId },
    ];

    sourceNode.data.fulfilledBy = [
      ...(sourceNode.data.fulfilledBy ?? []),
      { id: targetNodeId },
    ];
  } else if (newConnection === EdgeType.Part) {
    targetNode.data.directPartOf = sourceNodeId;
    sourceNode.data.directParts = [
      ...(sourceNode.data.directParts ?? []),
      { id: targetNodeId },
    ];
  } else {
    sourceNode.data.connectedTo = [
      ...(sourceNode.data.connectedTo ?? []),
      { id: targetNodeId },
    ];
  }

  await updateNode(sourceNode.id, nodes, setNodes);
  await updateNode(targetNode.id, nodes, setNodes);

  return true;
};

export const getReadableRelation = (type: RelationType): string | null => {
  switch (type) {
    case RelationType.DirectParts:
      return 'Direct parts';
    case RelationType.ConnectedTo:
      return 'Connected to';
    case RelationType.FulfilledBy:
      return 'Fulfilled by';
    case RelationType.Terminals:
      return 'Terminals';
    case RelationType.TerminalOf:
      return 'Terminal of';
    case RelationType.DirectPartOf:
      return 'Direct part of';
    case RelationType.TransfersTo:
      return 'Transfers to';
    case RelationType.TransferedBy:
      return 'Transfered by';
    case RelationType.FulFills:
      return 'Fulfills';
    default:
      return null;
  }
};
