import { EdgeProps, NodeProps } from "reactflow";

export enum AspectType {
  Function = "function",
  Product = "product",
  Location = "location",
}

export enum NodeType {
  Block = "block",
  Connector = "connector",
  Terminal = "terminal",
  TextBox = "textbox",
}

export enum EdgeType {
  Connected = "connected",
  Fulfilled = "fulfilled",
  Part = "part",
  Projection = "projection",
  Proxy = "proxy",
  Specialisation = "specialisation",
  Transfer = "transfer",
}

export type NodeData = {
  aspect: AspectType;
  hasTerminal?: boolean;
  hasConnector?: boolean;
  id: string;
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

export type CustomEdgeProps = Omit<EdgeProps, "data"> &
  EdgeData & {
    data: EdgeData;
  };

export type CustomNodeProps = Omit<NodeProps, "data"> &
  NodeData & {
    data: NodeData;
  };

export type NodeRelation = {
  nodeId: string;
  value: {
    [key: string]: boolean;
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

export type ConnectionWithChildren = {
  type: string;
  children: {
    id: string;
    displayName: string;
  }[];
};

export type ConnectionWithTarget = {
  type: string;
  target: string;
  displayName: string;
};
