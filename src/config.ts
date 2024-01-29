import type { Edge } from "reactflow";
import { Node, NodeType } from "./types";

export const INITIAL_NODES: Node[] = [
  {
    id: "6",
    type: NodeType.Block,
    position: { x: 442.85013677640416, y: 129.74870636700842 },
    data: { label: "block 6" },
    width: 100,
    height: 50,
    selected: false,
    positionAbsolute: { x: 442.85013677640416, y: 129.74870636700842 },
    dragging: false,
  },
  {
    id: "9",
    type: NodeType.Terminal,
    position: { x: 601.3317996161815, y: 130.82827799564245 },
    data: { label: "terminal 9" },
    width: 10,
    height: 10,
    selected: false,
    positionAbsolute: { x: 601.3317996161815, y: 130.82827799564245 },
    dragging: false,
  },
  {
    id: "11",
    type: NodeType.Connector,
    position: { x: 561.6553743792239, y: 249.54701649316326 },
    data: { label: "connector 11" },
    width: 30,
    height: 30,
    selected: false,
    positionAbsolute: { x: 561.6553743792239, y: 249.54701649316326 },
    dragging: false,
  },
  {
    id: "13",
    type: NodeType.Connector,
    position: { x: 729.9448590216551, y: 114.51568059574194 },
    data: { label: "connector 13" },
    width: 30,
    height: 30,
    selected: false,
    positionAbsolute: { x: 729.9448590216551, y: 114.51568059574194 },
    dragging: false,
  },
  {
    id: "14",
    type: NodeType.Terminal,
    position: { x: 823.1985637248258, y: 143.10128651276682 },
    data: { label: "terminal 14" },
    width: 10,
    height: 10,
    selected: false,
    positionAbsolute: { x: 823.1985637248258, y: 143.10128651276682 },
    dragging: false,
  },
  {
    id: "15",
    type: NodeType.Block,
    position: { x: 836.175122834657, y: 123.1396294622898 },
    data: { label: "block 15" },
    width: 100,
    height: 50,
    selected: false,
    positionAbsolute: { x: 836.175122834657, y: 123.1396294622898 },
    dragging: false,
  },
  {
    id: "16",
    type: NodeType.Terminal,
    position: { x: 938.3637564687866, y: 143.57058008652427 },
    data: { label: "terminal 16" },
    width: 10,
    height: 10,
    selected: true,
    positionAbsolute: { x: 938.3637564687866, y: 143.57058008652427 },
    dragging: false,
  },
];

export const INITIAL_EDGES: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
  },
  {
    source: "6",
    sourceHandle: "block_right_source",
    target: "9",
    targetHandle: "terminal_left_target",
    id: "reactflow__edge-6block_right_source-9terminal_left_target",
  },
  {
    source: "13",
    sourceHandle: "connector_top_source",
    target: "9",
    targetHandle: "terminal_right_target",
    id: "reactflow__edge-13connector_top_source-9terminal_right_target",
  },
  {
    source: "14",
    sourceHandle: "terminal_top_source",
    target: "13",
    targetHandle: "connector_bottom_target",
    id: "reactflow__edge-14terminal_top_source-13connector_bottom_target",
  },
  {
    source: "15",
    sourceHandle: "block_left_source",
    target: "14",
    targetHandle: "terminal_right_target",
    id: "reactflow__edge-15block_left_source-14terminal_right_target",
  },
  {
    source: "15",
    sourceHandle: "block_right_source",
    target: "16",
    targetHandle: "terminal_top_target",
    id: "reactflow__edge-15block_right_source-16terminal_top_target",
  },
  {
    source: "6",
    sourceHandle: "block_right_source",
    target: "11",
    targetHandle: "connector_left_target",
    id: "reactflow__edge-6block_right_source-11connector_left_target",
  },
];

export const buttonVariants = {
  button:
    "px-5 py-2.5 border-2 border-black bg-transparent text-black uppercase font-bold cursor-pointer transition duration-300 ease-in-out outline-none m-5 hover:bg-black hover:text-white hover:border-transparent",
  block:
    "px-5 py-2.5 border-2 border-block bg-transparent text-block uppercase font-bold cursor-pointer transition duration-300 ease-in-out outline-none m-5 hover:bg-block hover:text-white hover:border-transparent",
  connector:
    "px-5 py-2.5 border-2 border-connector bg-transparent text-connector uppercase font-bold cursor-pointer transition duration-300 ease-in-out outline-none m-5 hover:bg-connector hover:text-white hover:border-transparent",
  terminal:
    "px-5 py-2.5 border-2 border-terminal bg-transparent text-terminal uppercase font-bold cursor-pointer transition duration-300 ease-in-out outline-none m-5 hover:bg-terminal hover:text-white hover:border-transparent",
};
