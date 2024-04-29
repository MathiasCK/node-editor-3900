import toast from 'react-hot-toast';
import { type Connection, type Edge, type Node, Position } from 'reactflow';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import JSZip from 'jszip';
import { v4 as uuidv4 } from 'uuid';
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
  if (isTerminal(params.target as string) && isBlock(params.source as string)) {
    const terminal = nodes.find(t => t.id === params.target);

    if (terminal?.data?.terminalOf) {
      const block = nodes.find(b => b.id === terminal?.data?.terminalOf);
      toast.error(
        `Terminal ${terminal?.data?.customName === '' ? terminal?.data?.label : terminal?.data?.customName} is already a terminal of ${block?.data?.customName === '' ? terminal?.data?.terminalOf : block?.data?.customName}`
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
  if (isBlock(params.target as string) && isTerminal(params.source as string)) {
    const terminal = nodes.find(t => t.id === params.source);

    if (terminal?.data?.terminalOf) {
      const block = nodes.find(b => b.id === terminal?.data?.terminalOf);
      toast.error(
        `Terminal ${terminal?.data?.customName === '' ? terminal?.data?.label : terminal?.data?.customName} is already a terminal of ${block?.data?.customName === '' ? block?.data?.label : block?.data?.customName}`
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

  // if (
  //   (isConnector(params.source as string) &&
  //     isBlock(params.target as string)) ||
  //   (isBlock(params.source as string) && isConnector(params.target as string))
  // ) {
  //   newNodeRelations.push({
  //     nodeId: params.source as string,
  //     relations: {
  //       connectedTo: {
  //         id: params.target as string,
  //       },
  //     },
  //   });

  //   newNodeRelations.push({
  //     nodeId: params.target as string,
  //     relations: {
  //       connectedBy: {
  //         id: params.source as string,
  //       },
  //     },
  //   });

  //   return addEdge(EdgeType.Connected, newNodeRelations);
  // }

  // Set transfersTo & transferedBy property for terminals
  if (
    isTerminal(params.source as string) &&
    isTerminal(params.target as string)
  ) {
    const targetTerminal = nodes.find(node => node.id === params.target);
    const sourceTerminal = nodes.find(node => node.id === params.source);

    if (targetTerminal?.data.transferedBy) {
      toast.error(
        `Terminal ${targetTerminal?.data.customName === '' ? targetTerminal.data.label : targetTerminal?.data.customName} is already being transferred by another terminal`
      );
      return;
    }

    if (sourceTerminal?.data.transfersTo) {
      toast.error(
        `Terminal ${sourceTerminal?.data.customName === '' ? sourceTerminal.data.label : sourceTerminal?.data.customName} is already transferring to another terminal`
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
    (isTerminal(params.source as string) &&
      isConnector(params.target as string)) ||
    (isConnector(params.source as string) &&
      isTerminal(params.target as string))
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
    isConnector(params.source as string) &&
    isConnector(params.target as string)
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

  return openDialog(
    isBlock(params.source as string) && isBlock(params.target as string)
  );
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

  const labelNum =
    nodes.length === 0
      ? '0'
      : nodes
          .reduce(
            (max, obj) =>
              Math.max(
                max,
                Number(obj.data.label.charAt(obj.data.label.length - 1)) + 1
              ),
            0
          )
          .toString();

  const label =
    type === 'block'
      ? `Block${labelNum}`
      : type === 'terminal'
        ? `T${labelNum}`
        : `C${labelNum}`;

  const newNode: Node = {
    type,
    id: `${type}-${uuidv4()}`,
    position: {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    },
    data: {
      aspect,
      label,
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
  if (isTerminal(currentEdge.source!) && isTerminal(currentEdge.target!)) {
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
  if (isTerminal(currentEdge.source!) && isBlock(currentEdge.target!)) {
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
  if (isTerminal(currentEdge.target!) && isBlock(currentEdge.source!)) {
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

  if (currentEdge.type === EdgeType.Connected) {
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
  oldConnection: EdgeType,
  newConnection: EdgeType
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
  } else if (oldConnection === EdgeType.Connected) {
    const filteredConnectedBy = targetNode.data.connectedBy.filter(
      (node: { id: string }) => node.id !== sourceNodeId
    );

    targetNode.data.connectedBy =
      filteredConnectedBy.length > 0 ? filteredConnectedBy : [];

    const filteredConnectedTo = sourceNode.data.connectedTo.filter(
      (node: { id: string }) => node.id !== targetNodeId
    );

    sourceNode.data.connectedTo =
      filteredConnectedTo.length > 0 ? filteredConnectedTo : [];
  } else {
    // oldConnection === EdgeType.Fulfilled
    const filteredFulfilledBy = sourceNode.data.fulfilledBy.filter(
      (node: { id: string }) => node.id !== targetNodeId
    );

    sourceNode.data.fulfilledBy =
      filteredFulfilledBy.length > 0 ? filteredFulfilledBy : [];

    const filteredFulfills = targetNode.data.fulfills.filter(
      (node: { id: string }) => node.id !== sourceNodeId
    );

    targetNode.data.fulfills =
      filteredFulfills.length > 0 ? filteredFulfills : [];
  }

  if (newConnection === EdgeType.Part) {
    sourceNode.data.directPartOf = targetNodeId;
    targetNode.data.directParts = [
      ...(targetNode.data.directParts ?? []),
      {
        id: sourceNodeId,
      },
    ];
  } else if (newConnection === EdgeType.Connected) {
    sourceNode.data.connectedTo = [
      ...(sourceNode.data.connectedTo ?? []),
      {
        id: targetNodeId,
      },
    ];

    targetNode.data.connectedBy = [
      ...(targetNode.data.connectedBy ?? []),
      {
        id: sourceNodeId,
      },
    ];
  } else {
    // newConnection === EdgeType.Fulfilled
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

export const downloadZipFile = async () => {
  const zip = new JSZip();

  const { nodes, edges } = useStore.getState();
  const relationsStr = mapNodeRelationsToString(nodes);

  zip.file('relations.txt', relationsStr);
  zip.file('nodes.json', JSON.stringify(nodes));
  zip.file('edges.json', JSON.stringify(edges));

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'nodeFiles.zip');
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
      return 'connectedTo';
    case 'connectedBy':
      return 'connectedBy';
    case 'directParts':
      return 'hasPart';
    case 'fulfilledBy':
      return 'fulfilledBy';
    case 'terminals':
      return 'hasTerminal';
    case 'terminalOf':
      return 'terminalOf';
    case 'directPartOf':
      return 'partOf';
    case 'transfersTo':
      return 'transfersTo';
    case 'transferedBy':
      return 'transferedBy';
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

  for (const node of nodes) {
    const nodeLabel = node.data.customName
      ? node.data.customName.replace(/ /g, '_')
      : node.data.label;

    relations.set(nodeLabel, []);

    for (const key of transformableKeys) {
      if (!node.data || !node.data[key] || node.data[key].length === 0)
        continue;

      if (typeof node.data[key] === 'string') {
        const id = node.data[key];
        const currentNode = nodes.find(node => node.id === id);

        const currentLabel = currentNode?.data.customName
          ? currentNode.data.customName.replace(/ /g, '_')
          : currentNode?.data.label;

        if (currentNode) {
          relations
            .get(nodeLabel)
            ?.push(`${getReadableKey(key)} ${currentLabel}`);
        }
        continue;
      }

      for (const item of node.data[key]) {
        const currentNode = nodes.find(node => node.id === item.id);

        const currentLabel = currentNode?.data.customName
          ? currentNode.data.customName.replace(/ /g, '_')
          : currentNode?.data.label;
        if (currentNode) {
          relations
            .get(nodeLabel)
            ?.push(`${getReadableKey(key)} ${currentLabel}`);
        }
      }
    }
  }

  let str =
    '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n@prefix imf: <http://ns.imfid.org/imf#> .\n@prefix owl: <http://www.w3.org/2002/07/owl#> .\n@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n@prefix skos: <http://www.w3.org/2004/02/skos/core#> .\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n@prefix imfgui: http://example.org/imfgui# .\n\n';

  for (const node of nodes) {
    str += `imgui:${node.data.customName ? node.data.customName.replace(/ /g, '_') : node.data.label} rdf:type imf:${capitalizeFirstLetter(node.type!)};\n`;
    str += `    imf:hasAspect imf:${node.data.aspect};\n`;
    str += `    skos:preLabel "${node.data.customName === '' ? node.data.label : node.data.customName.replace(/ /g, '_')}".\n\n`;
  }

  for (const relation of relations) {
    const [key, value] = relation;
    for (const v of value) {
      const parts = v.split(' ');
      str += `imgui:${key} imf:${parts[0]} imgui:${parts[1]}.\n`;
    }
    str += '\n';
  }
  str += '\n';

  for (const node of nodes) {
    for (let i = 0; i < node.data.customAttributes.length; i++) {
      const nodeLabel = node.data.customName
        ? node.data.customName.replace(/ /g, '_')
        : node.data.label;

      const attributeName = `${nodeLabel}-attribute${i}`;
      str += `imfgui:${nodeLabel} imf:hasAttribute imfgui:${attributeName}.\n`;
      str += `imfgui:${attributeName} rdfs:label "${node.data.customAttributes[i].name}".\n`;
      str += `imfgui:${attributeName} imf:value "${node.data.customAttributes[i].value}".\n`;
    }
  }

  return str;
};

export const generateNewNodeId = (currentId: string): string => {
  if (isBlock(currentId)) {
    return `block-${uuidv4()}`;
  }
  if (isConnector(currentId)) {
    return `connector-${uuidv4()}`;
  }
  return `terminal-${uuidv4()}`;
};
