export type NodeData = {
  data: {
    label: string;
  };
};

export type Node = {
  id: string;
  type: "block" | "connector" | "terminal";
  width: number;
  height: number;
  selected?: boolean;
  position: { x: number; y: number };
  positionAbsolute?: { x: number; y: number };
  dragging?: boolean;
} & NodeData;
