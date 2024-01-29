export enum NodeType {
  Block = "block",
  Connector = "connector",
  Terminal = "terminal",
}

export type NodeData = {
  data: {
    label: string;
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
