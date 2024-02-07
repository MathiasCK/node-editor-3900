import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import type { Edge, Connection } from "reactflow";
import { v4 as uuidv4 } from "uuid";

import "reactflow/dist/style.css";
import { Block, Connector, Terminal, TextBox } from "./components/Nodes";
import { canConnect } from "./utils";
import { buttonVariants } from "./config";
import { NodeType } from "./types";

const nodeTypes = { block: Block, connector: Connector, terminal: Terminal, textbox: TextBox };

export default function App() {
  const [relation, setRelation] = useState({
    color: "white",
    strokeDasharray: false,
  });

  const [nodes, setNodes, onNodesChange] = useNodesState(
    localStorage.getItem("nodes")
      ? JSON.parse(localStorage.getItem("nodes")!)
      : [],
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    localStorage.getItem("edges")
      ? JSON.parse(localStorage.getItem("edges")!)
      : [],
  );
  const [nodeCount, setNodeCount] = useState(3);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      if (canConnect(params)) {
        const newConnection = {
          ...params,
          style: {
            stroke: relation.color,
            strokeWidth: 2,
            strokeDasharray: relation.strokeDasharray ? "5, 5" : "",
          },
        };
        return setEdges(eds => addEdge(newConnection, eds));
      }
    },
    [setEdges, relation.color, relation.strokeDasharray],
  );

  const addNode = (type: NodeType) => {
    const id = uuidv4();
    const newNode = {
      id,
      type,
      position: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      },
      data: { label: `${type} ${id}` },
    };

    setNodes(nds => nds.concat(newNode));
    setNodeCount(nodeCount + 1);
  };

  useEffect(() => {
    localStorage.setItem("nodes", JSON.stringify(nodes));
    localStorage.setItem("edges", JSON.stringify(edges));
  }, [nodes, edges]);

  return (
    <main className="w-screen h-screen bg-black">
      <div className="h-10 min-w-10 absolute right-0 bottom-50 flex flex-col z-20">
        <button
          className={buttonVariants.connections.part_of}
          onClick={() =>
            setRelation({ color: "rgb(74 222 128)", strokeDasharray: false })
          }
        >
          Part of
        </button>
        <button
          className={buttonVariants.connections.connected_to}
          onClick={() =>
            setRelation({ color: "rgb(191 219 254)", strokeDasharray: false })
          }
        >
          Connected to
        </button>
        <button
          className={buttonVariants.connections.transfers_to}
          onClick={() =>
            setRelation({ color: "rgb(96 165 250)", strokeDasharray: false })
          }
        >
          Transfer to
        </button>
        <button
          className={buttonVariants.connections.brown}
          onClick={() =>
            setRelation({ color: "rgb(252 211 77)", strokeDasharray: false })
          }
        >
          Specialisation of
        </button>
        <button
          className={buttonVariants.connections.brown}
          onClick={() =>
            setRelation({ color: "rgb(252 211 77)", strokeDasharray: false })
          }
        >
          Fulfilled by
        </button>
        <button
          className={buttonVariants.connections.light_gray.default}
          onClick={() =>
            setRelation({ color: "rgb(229 231 235)", strokeDasharray: true })
          }
        >
          Proxy
        </button>
        <button
          className={buttonVariants.connections.light_gray.dotted_border}
          onClick={() =>
            setRelation({ color: "rgb(229 231 235)", strokeDasharray: true })
          }
        >
          Projection
        </button>
      </div>

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
        <button
          className={buttonVariants.textbox}
          onClick={() => addNode(NodeType.TextBox)}
        >
          Add TextBox
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
        {/* @ts-ignore */}
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </main>
  );
}
