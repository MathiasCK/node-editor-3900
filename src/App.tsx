import { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import type { Edge, Connection } from "reactflow";

import "reactflow/dist/style.css";
import { Block, Connector, Terminal } from "./components/Nodes";
import "./App.scss";
import { Node } from "./types";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "block",
    position: { x: 500, y: 200 },
    data: { label: "Block 1" },
  },
  {
    id: "2",
    type: "connector",
    position: { x: 500, y: 300 },
    data: { label: "Connector 2" },
  },
  {
    id: "3",
    type: "terminal",
    position: { x: 500, y: 400 },
    data: { label: "Terminal 3" },
  },
];
const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
];

export default function App() {
  const nodeTypes = useMemo(
    () => ({ block: Block, connector: Connector, terminal: Terminal }),
    [],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeCount, setNodeCount] = useState(3);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges(eds => addEdge(params, eds)),
    [setEdges],
  );

  const addNode = (type: string) => {
    const newNodeId = (nodeCount + 1).toString();
    const newNode = {
      id: newNodeId,
      type,
      position: {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      },
      data: { label: `${type} ${newNodeId}` },
    };

    setNodes(nds => nds.concat(newNode));
    setNodeCount(nodeCount + 1);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <button className="block_button" onClick={() => addNode("block")}>
          Add block
        </button>
        <button
          className="connector_button"
          onClick={() => addNode("connector")}
        >
          Add connector
        </button>
        <button className="terminal_button" onClick={() => addNode("terminal")}>
          Add terminal
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <MiniMap />
        {/* @ts-ignore */}
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
