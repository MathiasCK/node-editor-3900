import { EdgeProps, NodeProps } from 'reactflow';

export enum AspectType {
  Function = 'function',
  Product = 'product',
  Location = 'location',
  Empty = 'empty',
}

export enum NodeType {
  Block = 'block',
  Connector = 'connector',
  Terminal = 'terminal',
  TextBox = 'textbox',
}

export enum EdgeType {
  Connected = 'connected',
  Fulfilled = 'fulfilled',
  Part = 'part',
  Transfer = 'transfer',
}

export enum RelationType {
  ConnectedTo = 'connectedTo',
  DirectParts = 'directParts',
  FulfilledBy = 'fulfilledBy',
  Terminals = 'terminals',
  TerminalOf = 'terminalOf',
  DirectPartOf = 'directPartOf',
  TransfersTo = 'transfersTo',
  TransferedBy = 'transferedBy',
  FulFills = 'fullFills',
}

export type UpdateNode = { customName?: string; aspect?: AspectType };

export type NodeData = {
  aspect: AspectType;
  hasTerminal?: boolean;
  terminals?: {
    id: string;
  }[];
  terminalOf?: {
    id: string;
  }[];
  transfersTo?: string;
  transferedBy?: string;
  connectedTo?: {
    id: string;
  }[];
  hasDirectPart?: boolean;
  directParts?: {
    id: string;
  }[];
  directPartOf?: string;
  fulfilledBy?: {
    id: string;
  }[];
  fullFills?: {
    id: string;
  }[];

  label: string;
  type: string;
  createdAt: number;
  updatedAt: number;
  customName?: string;
};

export type EdgeData = {
  id: string;
  label: string;
  type: string;
  lockConnection: boolean;
  createdAt: number;
  updatedAt: number;
  customName?: string;
};

export type CustomEdgeProps = Omit<EdgeProps, 'data'> &
  EdgeData & {
    data: EdgeData;
  };

export type CustomNodeProps = Omit<NodeProps, 'data'> &
  NodeData & {
    data: NodeData;
  };

export type NodeRelation = {
  nodeId: string;
  value?: {
    [key: string]: boolean | string;
  };
  array?: {
    [key: string]: {
      id: string;
    };
  };
};

export type NavItem = {
  title: string;
  subtitle: string;
  children: {
    title: string;
    description: string;
    nodeType: NodeType;
  }[];
};

export type RelationKeys =
  | 'connectedTo'
  | 'directParts'
  | 'fulfilledBy'
  | 'terminals'
  | 'terminalOf'
  | 'directPartOf'
  | 'transfersTo'
  | 'transferedBy'
  | 'fullFills';

export type RelationKeysWithChildren = {
  key: RelationKeys;
  children: { id: string }[];
};
