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
import { canConnect } from "./utils";
import { INITIAL_EDGES, INITIAL_NODES } from "./config";
import { NodeType } from "./types";

export default function App() {
  const nodeTypes = useMemo(
    () => ({ block: Block, connector: Connector, terminal: Terminal }),
    [],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [nodeCount, setNodeCount] = useState(3);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      if (canConnect(params)) {
        return setEdges(eds => addEdge(params, eds));
      }
    },
    [setEdges],
  );

  const addNode = (type: NodeType) => {
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
        <button
          className="block_button"
          onClick={() => addNode(NodeType.Block)}
        >
          Add block
        </button>
        <button
          className="connector_button"
          onClick={() => addNode(NodeType.Connector)}
        >
          Add connector
        </button>
        <button
          className="terminal_button"
          onClick={() => addNode(NodeType.Terminal)}
        >
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
