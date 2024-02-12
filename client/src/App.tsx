import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from "reactflow";
import type { Edge, Connection } from "reactflow";
import { v4 as uuidv4 } from "uuid";

import "reactflow/dist/style.css";
import { Block, Connector, Terminal, TextBox } from "./components/Nodes";
import { canConnect } from "./utils";
import { buttonVariants, cn } from "./config";
import { NodeType } from "./types";

const nodeTypes = {
  block: Block,
  connector: Connector,
  terminal: Terminal,
  textbox: TextBox,
};

interface AppState {
  color: string;
  strokeDasharray: boolean;
  markerType: MarkerType | null;
}

export default function App() {
  const [relation, setRelation] = useState<AppState>({
    color: "#4ade80",
    strokeDasharray: false,
    markerType: null,
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
  const [nodeCount, setNodeCount] = useState(nodes.length);

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
        if (relation.markerType) {
          // @ts-ignore
          newConnection.markerEnd = {
            type: relation.markerType,
            color: relation.color,
            width: 10,
            height: 10,
          };
        }
        return setEdges(eds => addEdge(newConnection, eds));
      }
    },
    [relation.markerType, relation.color, relation.strokeDasharray, setEdges],
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
          className={cn(
            `${buttonVariants.edge} border-green-400 text-green-400 hover:bg-green-400 `,
            {
              "bg-green-400 text-white border-transparent":
                relation.color === "#4ade80",
            },
          )}
          onClick={() =>
            setRelation({
              color: "#4ade80",
              strokeDasharray: false,
              markerType: MarkerType.ArrowClosed,
            })
          }
        >
          Part of
        </button>
        <button
          className={cn(
            `${buttonVariants.edge} border-blue-200 text-blue-200 hover:bg-blue-200 `,
            {
              "bg-blue-200 text-white border-transparent":
                relation.color === "#bfdbfe",
            },
          )}
          onClick={() =>
            setRelation({
              color: "#bfdbfe",
              strokeDasharray: false,
              markerType: null,
            })
          }
        >
          Connected to
        </button>
        <button
          className={cn(
            `${buttonVariants.edge} border-blue-400 text-blue-400 hover:bg-blue-400 `,
            {
              "bg-blue-400 text-white border-transparent":
                relation.color === "#60a5fa",
            },
          )}
          onClick={() =>
            setRelation({
              color: "#60a5fa",
              strokeDasharray: false,
              markerType: MarkerType.ArrowClosed,
            })
          }
        >
          Transfer to
        </button>
        <button
          className={cn(
            `${buttonVariants.edge} border-amber-300 text-amber-300 hover:bg-amber-300 `,
            {
              "bg-amber-300 text-white border-transparent":
                relation.color === "#fcd34d",
            },
          )}
          onClick={() =>
            setRelation({
              color: "#fcd34d",
              strokeDasharray: false,
              markerType: MarkerType.ArrowClosed,
            })
          }
        >
          Specialisation of
        </button>
        <button
          className={cn(
            `${buttonVariants.edge} border-amber-300 text-amber-300 hover:bg-amber-300 border-dotted`,
            {
              "bg-amber-300 text-white border-transparent":
                relation.color === "#fcd34c",
            },
          )}
          onClick={() =>
            setRelation({
              color: "#fcd34c",
              strokeDasharray: true,
              markerType: MarkerType.Arrow,
            })
          }
        >
          Fulfilled by
        </button>
        <button
          className={cn(
            `${buttonVariants.edge} border-gray-200 text-gray-200 hover:bg-gray-200 `,
            {
              "bg-gray-200 text-white border-transparent":
                relation.color === "#e5e7ec",
            },
          )}
          onClick={() =>
            setRelation({
              color: "#e5e7ec",
              strokeDasharray: true,
              markerType: MarkerType.ArrowClosed,
            })
          }
        >
          Proxy
        </button>
        <button
          className={cn(
            `${buttonVariants.edge} border-dotted border-gray-200 text-gray-200 hover:bg-gray-200`,
            {
              "bg-gray-200 text-white border-transparent":
                relation.color === "#e5e7eb",
            },
          )}
          onClick={() =>
            setRelation({
              color: "#e5e7eb",
              strokeDasharray: true,
              markerType: MarkerType.Arrow,
            })
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
        <Background gap={12} size={1} />
      </ReactFlow>
    </main>
  );
}
