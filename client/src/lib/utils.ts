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
  CustomNodeProps,
  EdgeType,
  NodeRelation,
  NodeType,
  RelationKeys,
  RelationKeysWithChildren,
  RelationType,
  UpdateNode,
} from './types';

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

  if (
    isBlock(params.sourceHandle as string) &&
    isTerminal(params.targetHandle as string)
  ) {
    lockConnection = true;
    connectionType = EdgeType.Connected;

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

  if (connectionType === EdgeType.Fulfilled) {
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

  if (connectionType === EdgeType.Connected) {
    newNodeRelations.push({
      nodeId: params.source as string,
      array: {
        connectedTo: {
          id: params.target as string,
        },
      },
    });
  }

  if (connectionType === EdgeType.Part) {
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
    return;
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
    return;
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
    return;
  }

  if (currentEdge.type === EdgeType.Connected) {
    const nodeToUpdate = nodes.find(node => node.id === currentEdge.source);
    const index = nodes.findIndex(node => node.id === currentEdge.source);

    if (!nodeToUpdate || index === -1) return;

    const updatedConnectedTo = nodeToUpdate.data.connectedTo.filter(
      (node: { id: string }) => node.id !== currentEdge.target
    );

    nodeToUpdate.data.connectedTo = updatedConnectedTo.length
      ? updatedConnectedTo
      : null;

    updateNodeData(index, nodeToUpdate, nodes, setNodes);
    return;
  }

  if (currentEdge.type === EdgeType.Part) {
    const sourceNode = nodes.find(node => node.id === currentEdge.source);
    const sourceNodeIndex = nodes.findIndex(
      node => node.id === currentEdge.source
    );
    const targetNode = nodes.find(node => node.id === currentEdge.target);
    const targetNodeIndex = nodes.findIndex(
      node => node.id === currentEdge.target
    );

    if (
      !sourceNode ||
      !targetNode ||
      sourceNodeIndex === -1 ||
      targetNodeIndex === -1
    )
      return;

    targetNode.data.directPartOf = null;

    const filteredDirectParts = sourceNode.data.directParts.filter(
      (part: { id: string }) => part.id !== currentEdge.target
    );

    sourceNode.data.directParts = filteredDirectParts;

    if (filteredDirectParts.length === 0) {
      sourceNode.data.directParts = null;
      sourceNode.data.hasDirectPart = false;
    }

    updateNodeData(sourceNodeIndex, sourceNode, nodes, setNodes);
    updateNodeData(targetNodeIndex, targetNode, nodes, setNodes);

    return;
  }

  if (currentEdge.type === EdgeType.Fulfilled) {
    const sourceNode = nodes.find(node => node.id === currentEdge.source);
    const sourceNodeIndex = nodes.findIndex(
      node => node.id === currentEdge.source
    );
    const targetNode = nodes.find(node => node.id === currentEdge.target);
    const targetNodeIndex = nodes.findIndex(
      node => node.id === currentEdge.target
    );

    if (
      !sourceNode ||
      !targetNode ||
      sourceNodeIndex === -1 ||
      targetNodeIndex === -1
    )
      return;

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

    updateNodeData(sourceNodeIndex, sourceNode, nodes, setNodes);
    updateNodeData(targetNodeIndex, targetNode, nodes, setNodes);

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
  ];

  return transformableKeys.reduce(
    (acc: RelationKeysWithChildren[], key: RelationKeys) => {
      if (currentNode.data[key]?.length ?? 0 > 0) {
        let children = currentNode.data[key];

        // If processing 'connectedTo', filter out duplicates that are in 'terminals'.
        if (key === 'connectedTo' && currentNode.data.terminals) {
          const terminalIds = new Set(
            currentNode.data.terminals.map(terminal => terminal.id)
          );
          children = children?.filter(
            connectedToItem => !terminalIds.has(connectedToItem.id)
          );
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
    default:
      return null;
  }
};
