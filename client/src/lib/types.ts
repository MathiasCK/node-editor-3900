import type { Edge, EdgeProps, Node, NodeProps } from 'reactflow';

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
}

export enum EdgeType {
  Connected = 'connected',
  Fulfilled = 'fulfilled',
  Part = 'part',
  Transfer = 'transfer',
}

export enum RelationType {
  ConnectedTo = 'connectedTo',
  ConnectedBy = 'connectedBy',
  DirectParts = 'directParts',
  FulfilledBy = 'fulfilledBy',
  Terminals = 'terminals',
  TerminalOf = 'terminalOf',
  DirectPartOf = 'directPartOf',
  TransfersTo = 'transfersTo',
  TransferedBy = 'transferedBy',
  Fulfills = 'fulfills',
}

export type UpdateNode = { customName?: string; aspect?: AspectType };

export type Relation = {
  id: string;
};

export type NodeData = {
  aspect: AspectType;
  parent: 'void' | string;
  children?: Relation[];
  terminals?: Relation[];
  terminalOf?: string;
  transfersTo?: string;
  transferedBy?: string;
  connectedTo?: Relation[];
  connectedBy?: Relation[];
  directParts?: Relation[];
  directPartOf?: string;
  fulfills?: Relation[];
  fulfilledBy?: Relation[];
  label: string;
  createdAt: number;
  updatedAt: number;
  customName?: string;
};

export type EdgeData = {
  id: string;
  label: string;
  lockConnection: boolean;
  createdAt: number;
  updatedAt: number;
  customName?: string;
};

export type CustomEdgeProps = Omit<EdgeProps, 'data'> &
  EdgeData & {
    data: EdgeData;
    type: string;
  };

export type CustomNodeProps = Omit<NodeProps, 'data'> &
  NodeData & {
    data: NodeData;
  };

export type NodeRelation = {
  nodeId: string;
  relation?: {
    [key: string]: string;
  };
  relations?: {
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
  | 'fulfills'
  | 'connectedBy';

export type RelationKeysWithChildren = {
  key: RelationKeys;
  children: { id: string }[];
};

export type NodeWithNodeId = Node & {
  nodeId: string;
};

export type EdgeWithEdgeId = Edge & {
  edgeId: string;
};

export type UserWithToken = {
  user: {
    id: string;
    username: string;
  };
  token: string;
};
