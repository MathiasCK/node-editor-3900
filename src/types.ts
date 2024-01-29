export type NodeData = {
  data: {
    label: string;
  };
};

export type Node = {
  id: string;
  type: "block" | "connector" | "terminal";
  position: { x: number; y: number };
} & NodeData;
