import { EdgeProps, NodeProps } from "reactflow";

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

export type Data = {
  data: {
    id: string;
    label: string;
    type: string;
    createdAt: number;
    updatedAt: number;
    customName?: string;
  };
};

export type CustomNodeProps = NodeProps & Data;

export type CustomEdgeProps = EdgeProps & Data;

export type NavItem = {
  title: string;
  subtitle: string;
  children: {
    title: string;
    description: string;
    nodeType: NodeType;
  }[];
};
