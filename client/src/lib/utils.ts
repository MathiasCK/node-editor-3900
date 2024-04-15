import toast from 'react-hot-toast';
import { type Connection, type Edge, type Node, Position } from 'reactflow';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  AspectType,
  CustomAttribute,
  CustomNodeProps,
  EdgeType,
  NodeRelation,
  NodeType,
  RelationKeys,
  RelationKeysWithChildren,
  RelationType,
} from './types';
import { createNode, updateNode } from '@/api/nodes';
import { useConnection, useSession, useStore } from '@/hooks';
import { createEdge } from '@/api/edges';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const onConnect = async (params: Edge | Connection) => {
  const { setParams } = useConnection.getState();
  setParams(params);

  const { nodes } = useStore.getState();
  const { openDialog } = useConnection.getState();

  const newNodeRelations: NodeRelation[] = [];

  if (params.source === params.target) {
    toast.error('Cannot connect node to itself');
    return;
  }

  // Set terminalOf property for terminal & terminals array for block
  if (
    isTerminal(params.targetHandle as string) &&
    isBlock(params.sourceHandle as string)
  ) {
    const terminal = nodes.find(t => t.id === params.target);

    if (terminal?.data?.terminalOf) {
      const block = nodes.find(b => b.id === terminal?.data?.terminalOf);
      toast.error(
        `Terminal ${terminal?.data?.customName === '' ? params.target : terminal?.data?.customName} is already a terminal of ${block?.data?.customName === '' ? terminal?.data?.terminalOf : block?.data?.customName}`
      );
      return;
    }

    newNodeRelations.push({
      nodeId: params.target as string,
      relation: {
        terminalOf: params.source as string,
      },
    });

    newNodeRelations.push({
      nodeId: params.source as string,
      relations: {
        terminals: {
          id: params.target as string,
        },
      },
    });

    return addEdge(EdgeType.Connected, newNodeRelations);
  }

  // Set terminalOf property for terminal & terminals array for block
  if (
    isBlock(params.targetHandle as string) &&
    isTerminal(params.sourceHandle as string)
  ) {
    const terminal = nodes.find(t => t.id === params.source);

    if (terminal?.data?.terminalOf) {
      const block = nodes.find(b => b.id === terminal?.data?.terminalOf);
      toast.error(
        `Terminal ${terminal?.data?.customName === '' ? params.source : terminal?.data?.customName} is already a terminal of ${block?.data?.customName === '' ? terminal?.data?.terminalOf : block?.data?.customName}`
      );
      return;
    }

    newNodeRelations.push({
      nodeId: params.source as string,
      relation: {
        terminalOf: params.target as string,
      },
    });

    newNodeRelations.push({
      nodeId: params.target as string,
      relations: {
        terminals: {
          id: params.source as string,
        },
      },
    });

    return addEdge(EdgeType.Connected, newNodeRelations);
  }

  if (
    (isConnector(params.sourceHandle as string) &&
      isBlock(params.targetHandle as string)) ||
    (isBlock(params.sourceHandle as string) &&
      isConnector(params.targetHandle as string))
  ) {
    newNodeRelations.push({
      nodeId: params.source as string,
      relations: {
        connectedTo: {
          id: params.target as string,
        },
      },
    });

    newNodeRelations.push({
      nodeId: params.target as string,
      relations: {
        connectedBy: {
          id: params.source as string,
        },
      },
    });

    return addEdge(EdgeType.Connected, newNodeRelations);
  }

  // Set transfersTo & transferedBy property for terminals
  if (
    isTerminal(params.sourceHandle as string) &&
    isTerminal(params.targetHandle as string)
  ) {
    const targetTerminal = nodes.find(node => node.id === params.target);
    const sourceTerminal = nodes.find(node => node.id === params.source);

    if (targetTerminal?.data.transferedBy) {
      toast.error(
        `Terminal ${targetTerminal?.data.customName === '' ? targetTerminal.id : targetTerminal?.data.customName} is already being transferred by another terminal`
      );
      return;
    }

    if (sourceTerminal?.data.transfersTo) {
      toast.error(
        `Terminal ${sourceTerminal?.data.customName === '' ? sourceTerminal.id : sourceTerminal?.data.customName} is already transferring to another terminal`
      );
      return;
    }

    newNodeRelations.push({
      nodeId: params.source as string,
      relation: {
        transfersTo: params.target as string,
      },
    });

    newNodeRelations.push({
      nodeId: params.target as string,
      relation: {
        transferedBy: params.source as string,
      },
    });

    return addEdge(EdgeType.Transfer, newNodeRelations);
  }

  if (
    (isTerminal(params.sourceHandle as string) &&
      isConnector(params.targetHandle as string)) ||
    (isConnector(params.sourceHandle as string) &&
      isTerminal(params.targetHandle as string))
  ) {
    newNodeRelations.push({
      nodeId: params.source as string,
      relations: {
        connectedTo: {
          id: params.target as string,
        },
      },
    });

    newNodeRelations.push({
      nodeId: params.target as string,
      relations: {
        connectedBy: {
          id: params.source as string,
        },
      },
    });

    return addEdge(EdgeType.Connected, newNodeRelations);
  }

  if (
    isConnector(params.sourceHandle as string) &&
    isConnector(params.targetHandle as string)
  ) {
    newNodeRelations.push({
      nodeId: params.source as string,
      relations: {
        connectedTo: {
          id: params.target as string,
        },
      },
    });

    newNodeRelations.push({
      nodeId: params.target as string,
      relations: {
        connectedBy: {
          id: params.source as string,
        },
      },
    });

    return addEdge(EdgeType.Connected, newNodeRelations);
  }

  return openDialog();
};

export const addEdge = async (
  edgeType: EdgeType,
  newNodeRelations: NodeRelation[],
  lockConnection = true
) => {
  const { edges } = useStore.getState();
  const { params } = useConnection.getState();
  const { user } = useSession.getState();

  const currentDate = Date.now();
  const id = edges.length.toString();

  const newEdge = {
    ...params,
    id: `reactflow__edge-${params!.source}${params!.sourceHandle}-${params!.target}${params!.targetHandle}`,
    type: edgeType,
    data: {
      id,
      label: `Edge ${id}`,
      lockConnection,
      createdAt: currentDate,
      updatedAt: currentDate,
      createdBy: user?.id,
    },
  };

  const edge = await createEdge(newEdge as Edge);

  if (edge) {
    handleNewNodeRelations(newNodeRelations as NodeRelation[]);
  }
};

export const handleNewNodeRelations = (newNodeRelations: NodeRelation[]) => {
  const { nodes, setNodes } = useStore.getState();
  for (const relation of newNodeRelations) {
    const nodeToUpdate = nodes.find(node => node.id === relation.nodeId);
    const index = nodes.findIndex(node => node.id === relation.nodeId);

    if (!nodeToUpdate || index === -1) return;

    if (relation.relation) {
      Object.keys(relation.relation).forEach(keyToUpdate => {
        nodeToUpdate.data[keyToUpdate] = relation.relation![keyToUpdate];
      });
    }

    if (relation.relations) {
      Object.keys(relation.relations).forEach(r => {
        nodeToUpdate.data[r] = [
          ...(nodeToUpdate.data[r] ?? []),
          relation.relations![r],
        ];
      });
    }

    updateNode(nodeToUpdate.id, nodes, setNodes);
  }
};

export const isBlock = (id: string): boolean => id.includes('block');

export const isConnector = (id: string): boolean => id.includes('connector');

export const isTerminal = (id: string): boolean => id.includes('terminal');

export const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const addNode = async (
  aspect: AspectType,
  type: NodeType,
  nodes: Node[],
  setNodes: (nodes: Node[]) => void
) => {
  const { user } = useSession.getState();

  const id =
    nodes.length === 0
      ? '0'
      : nodes
          .reduce((max, obj) => Math.max(max, Number(obj.id) + 1), 0)
          .toString();

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
      createdBy: user?.id,
    },
  };

  await createNode(newNode as Node, nodes, setNodes);
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
      targetTerminal.data.transferedBy = '';
      await updateNode(targetTerminal.id, nodes, setNodes);
    }

    if (sourceTerminal.id !== nodeIdToDelete) {
      sourceTerminal.data.transfersTo = '';
      await updateNode(sourceTerminal.id, nodes, setNodes);
    }

    return;
  }

  // Deleting a terminal -> block connection
  if (
    isTerminal(currentEdge.sourceHandle!) &&
    isBlock(currentEdge.targetHandle!)
  ) {
    const terminal = nodes.find(node => node.id === currentEdge.source);
    const block = nodes.find(node => node.id === currentEdge.target);

    if (!terminal || !block) return;

    if (terminal.id !== nodeIdToDelete) {
      terminal.data.terminalOf = '';

      await updateNode(terminal.id, nodes, setNodes);
    }

    if (block.id !== nodeIdToDelete) {
      const filteredTerminals = block.data.terminals.filter(
        (t: { id: string }) => t.id !== terminal.id
      );

      block.data.terminals = filteredTerminals.length ? filteredTerminals : [];

      await updateNode(block.id, nodes, setNodes);
    }
    return;
  }

  // Deleting a block -> terminal connection
  if (
    isTerminal(currentEdge.targetHandle!) &&
    isBlock(currentEdge.sourceHandle!)
  ) {
    const terminal = nodes.find(node => node.id === currentEdge.target);
    const block = nodes.find(node => node.id === currentEdge.source);

    if (!terminal || !block) return;

    if (terminal.id !== nodeIdToDelete) {
      terminal.data.terminalOf = '';
      await updateNode(terminal.id, nodes, setNodes);
    }

    if (block.id !== nodeIdToDelete) {
      const filteredTerminals = block.data.terminals.filter(
        (t: { id: string }) => t.id !== terminal.id
      );

      block.data.terminals = filteredTerminals.length ? filteredTerminals : [];

      await updateNode(block.id, nodes, setNodes);
    }
    return;
  }

  if (
    currentEdge.type === EdgeType.Connected &&
    !currentEdge.data.lockCoonection
  ) {
    const sourceNode = nodes.find(node => node.id === currentEdge.source);
    const targetNode = nodes.find(node => node.id === currentEdge.target);

    if (!sourceNode || !targetNode) return;

    if (sourceNode.id !== nodeIdToDelete) {
      const filteredConnectedTo = sourceNode.data.connectedTo.filter(
        (conn: { id: string }) => conn.id !== targetNode.id
      );
      sourceNode.data.connectedTo =
        filteredConnectedTo.length > 0 ? filteredConnectedTo : [];

      await updateNode(sourceNode.id, nodes, setNodes);
    }

    if (targetNode.id !== nodeIdToDelete) {
      const filteredConnectedBy = targetNode.data.connectedBy.filter(
        (conn: { id: string }) => conn.id !== sourceNode.id
      );
      targetNode.data.connectedBy =
        filteredConnectedBy.length > 0 ? filteredConnectedBy : [];

      await updateNode(targetNode.id, nodes, setNodes);
    }
    return;
  }

  if (currentEdge.type === EdgeType.Part) {
    const sourceNode = nodes.find(node => node.id === currentEdge.source);
    const targetNode = nodes.find(node => node.id === currentEdge.target);

    if (!sourceNode || !targetNode) return;

    if (targetNode.id !== nodeIdToDelete) {
      const filteredDirectParts = targetNode.data.directParts.filter(
        (part: { id: string }) => part.id !== currentEdge.source
      );

      targetNode.data.directParts =
        filteredDirectParts.length > 0 ? filteredDirectParts : [];

      const filteredChildren = targetNode.data.children.filter(
        (child: { id: string }) => child.id !== currentEdge.source
      );

      targetNode.data.children = filteredChildren.length
        ? filteredChildren
        : [];

      await updateNode(targetNode.id, nodes, setNodes);
    }

    if (sourceNode.id !== nodeIdToDelete) {
      sourceNode.data.directPartOf = '';
      sourceNode.data.parent = 'void';
      await updateNode(sourceNode.id, nodes, setNodes);
    }

    return;
  }

  if (currentEdge.type === EdgeType.Fulfilled) {
    const sourceNode = nodes.find(node => node.id === currentEdge.source);
    const targetNode = nodes.find(node => node.id === currentEdge.target);

    if (!sourceNode || !targetNode) return;

    if (targetNode.id !== nodeIdToDelete) {
      const filteredFulfills = targetNode.data.fulfills.filter(
        (node: { id: string }) => node.id !== currentEdge.source
      );

      targetNode.data.fulfills =
        filteredFulfills.length > 0 ? filteredFulfills : [];

      await updateNode(targetNode.id, nodes, setNodes);
    }

    if (sourceNode.id !== nodeIdToDelete) {
      const filteredFulfilledBy = sourceNode.data.fulfilledBy.filter(
        (node: { id: string }) => node.id !== currentEdge.target
      );

      sourceNode.data.fulfilledBy =
        filteredFulfilledBy.length > 0 ? filteredFulfilledBy : [];

      await updateNode(sourceNode.id, nodes, setNodes);
    }

    return;
  }
};

export const getNodeRelations = (
  currentNode: CustomNodeProps
): RelationKeysWithChildren[] => {
  const transformableKeys: RelationKeys[] = [
    'connectedTo',
    'connectedBy',
    'directParts',
    'fulfilledBy',
    'terminals',
    'terminalOf',
    'directPartOf',
    'transfersTo',
    'transferedBy',
    'fulfills',
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
  oldConnection: EdgeType
): Promise<boolean> => {
  const targetNode = nodes.find(node => node.id === targetNodeId);
  const sourceNode = nodes.find(node => node.id === sourceNodeId);

  if (!sourceNode || !targetNode) {
    toast.error(
      'Could not find nodes to update connection data. Refresh page & try again.'
    );
    return false;
  }

  if (oldConnection === EdgeType.Part) {
    const filteredParts = targetNode.data.directParts.filter(
      (part: { id: string }) => part.id !== sourceNodeId
    );

    targetNode.data.directParts = filteredParts.length > 0 ? filteredParts : [];
    sourceNode.data.directPartOf = '';

    sourceNode.data.fulfilledBy = [
      ...(sourceNode.data.fulfilledBy ?? []),
      {
        id: targetNodeId,
      },
    ];

    targetNode.data.fulfills = [
      ...(targetNode.data.fulfills ?? []),
      {
        id: sourceNodeId,
      },
    ];
  } else {
    // oldConnection === EdgeType.Fulfilled
    const filteredFulfilledBy = sourceNode.data.fulfilledBy.filter(
      (node: { id: string }) => node.id !== targetNodeId
    );

    sourceNode.data.fulfilledBy =
      filteredFulfilledBy.length > 0 ? filteredFulfilledBy : [];
    sourceNode.data.directPartOf = targetNodeId;

    const filteredFulfills = targetNode.data.fulfills.filter(
      (node: { id: string }) => node.id !== sourceNodeId
    );

    targetNode.data.fulfills =
      filteredFulfills.length > 0 ? filteredFulfills : [];
    targetNode.data.directParts = [
      ...(targetNode.data.directParts ?? []),
      {
        id: sourceNodeId,
      },
    ];
  }

  await updateNode(sourceNode.id, nodes, setNodes);
  await updateNode(targetNode.id, nodes, setNodes);

  return true;
};

export const getReadableRelation = (type: RelationType): string | null => {
  switch (type) {
    case RelationType.DirectParts:
      return 'Parts';
    case RelationType.ConnectedTo:
      return 'Connected to';
    case RelationType.ConnectedBy:
      return 'Connected by';
    case RelationType.FulfilledBy:
      return 'Fulfilled by';
    case RelationType.Terminals:
      return 'Terminals';
    case RelationType.TerminalOf:
      return 'Terminal of';
    case RelationType.DirectPartOf:
      return 'Part of';
    case RelationType.TransfersTo:
      return 'Transfers to';
    case RelationType.TransferedBy:
      return 'Transfered by';
    case RelationType.Fulfills:
      return 'Fulfills';
    default:
      return null;
  }
};

export const downloadTxtFile = (nodes: Node[]) => {
  if (nodes.length === 0) {
    toast.error('No nodes to download');
    return;
  }

  const str = mapNodeRelationsToString(nodes);

  const blob = new Blob([str], { type: 'text/plain' });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'relations.txt');

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
export const downloadNodesFile = (nodes: Node[]) => {
  const blob = new Blob([JSON.stringify(nodes)], { type: 'text/plain' });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'nodes.json');

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const downloadEdgesFile = (edges: Edge[]) => {
  const blob = new Blob([JSON.stringify(edges)], { type: 'text/plain' });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'edges.json');

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const getNodeRelationLabel = (node: Node): string =>
  `${node.data.customName === '' ? `${capitalizeFirstLetter(node.type!)}_${node.id} (type: ${node.type}, aspect: ${node.data.aspect})` : node.data.customName.replace(' ', '_')}`;

export const getReadableKey = (key: RelationKeys): string => {
  switch (key) {
    case 'connectedTo':
      return 'connected_to';
    case 'connectedBy':
      return 'connected_by';
    case 'directParts':
      return 'has_part';
    case 'fulfilledBy':
      return 'fulfilled_by';
    case 'terminals':
      return 'has_terminal';
    case 'terminalOf':
      return 'terminal_of';
    case 'directPartOf':
      return 'part_of';
    case 'transfersTo':
      return 'transferring_to';
    case 'transferedBy':
      return 'being transferred_by';
    case 'fulfills':
      return 'fulfills';
  }
};

export const mapNodeRelationsToString = (nodes: Node[]): string => {
  const transformableKeys: RelationKeys[] = [
    'connectedTo',
    'connectedBy',
    'directParts',
    'fulfilledBy',
    'terminals',
    'terminalOf',
    'directPartOf',
    'transfersTo',
    'transferedBy',
    'fulfills',
  ];

  const relations = new Map<string, string[]>();
  const customAttributes = new Map<string, CustomAttribute[]>();

  for (const node of nodes) {
    const nodeLabel = getNodeRelationLabel(node);

    relations.set(nodeLabel, []);

    for (const key of transformableKeys) {
      if (!node.data || !node.data[key] || node.data[key].length === 0)
        continue;

      if (typeof node.data[key] === 'string') {
        const id = node.data[key];
        const currentNode = nodes.find(node => node.id === id);

        if (currentNode) {
          relations
            .get(nodeLabel)
            ?.push(
              `${getReadableKey(key)} ${getNodeRelationLabel(currentNode)}`
            );
        }
        continue;
      }

      for (const item of node.data[key]) {
        const currentNode = nodes.find(node => node.id === item.id);
        if (currentNode) {
          relations
            .get(nodeLabel)
            ?.push(
              `${getReadableKey(key)} ${getNodeRelationLabel(currentNode)}`
            );
        }
      }
    }

    if (node.data.customAttributes.length > 0) {
      customAttributes.set(nodeLabel, node.data.customAttributes);
    }
  }

  let str =
    'Fulfilledby - inverse of fulfills\nConnectedBy - inverse of connectedTo\nTransferedBy - inverse of transfersTo\nPartOf - inverse of directParts\nTerminalOf - inverse of terminals\n\n\n';

  relations.forEach((value, key) => {
    if (value.length === 0) return;

    str += `${key}:\n`;
    value.forEach(relation => {
      str += `  ${relation}\n`;
    });

    const attributes = customAttributes.get(key);
    if (attributes && attributes.length > 0) {
      str += '\n';
      str += `  Custom Attributes for ${key}:\n`;
      customAttributes.get(key)?.forEach(attribute => {
        str += `    ${attribute.name} : ${attribute.value}\n`;
      });
    }

    str += '\n';
  });

  return str;
};
