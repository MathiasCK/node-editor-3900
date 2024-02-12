export enum NodeType {
  Block = "block",
  Connector = "connector",
  Terminal = "terminal",
  TextBox = "textbox",
}

export type NodeData = {
  data: {
    type: NodeType;
    id: string;
    createdAt: Date;
  };
};

export type Node = {
  id: string;
  type: NodeType;
  width: number;
  height: number;
  selected?: boolean;
  position: { x: number; y: number };
  positionAbsolute?: { x: number; y: number };
  dragging?: boolean;
} & NodeData;
