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
  };
};

export type CustomNodeProps = NodeProps & Data;

export type CustomEdgeProps = EdgeProps & Data;
