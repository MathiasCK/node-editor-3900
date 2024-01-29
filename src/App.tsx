import { useCallback, useState } from "react";
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
import { canConnect } from "./utils";
import { INITIAL_EDGES, INITIAL_NODES, buttonVariants } from "./config";
import { NodeType } from "./types";

export default function App() {
  const nodeTypes = { block: Block, connector: Connector, terminal: Terminal };

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
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      },
      data: { label: `${type} ${newNodeId}` },
    };

    setNodes(nds => nds.concat(newNode));
    setNodeCount(nodeCount + 1);
  };

  return (
    <main className="w-screen h-screen bg-black">
      <div className="absolute z-10 flex justify-center w-full">
        <button
          className={buttonVariants.block}
          onClick={() => addNode(NodeType.Block)}
        >
          Add block
        </button>
        <button
          className={buttonVariants.connector}
          onClick={() => addNode(NodeType.Connector)}
        >
          Add connector
        </button>
        <button
          className={buttonVariants.terminal}
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
    </main>
  );
}
