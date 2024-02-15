import { useCallback, useEffect, useState } from "react";
import {
  type Edge,
  type Connection,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  getConnectedEdges,
} from "reactflow";

import "reactflow/dist/style.css";
import { Block, Connector, Terminal, TextBox } from "./components/Nodes";
import { buttonVariants } from "./lib/config";
import { NodeType } from "./lib/types";
import { canConnect, cn, getSymmetricDifference } from "./lib/utils";
import { useSettings, useSheet, useTheme } from "./hooks";

import {
  Connected,
  Fulfilled,
  Part,
  Projection,
  Proxy,
  Specialisation,
  Transfer,
} from "./components/Edges";
import {
  ControlsStyled,
  MiniMapStyled,
  ReactFlowStyled,
  darkTheme,
  lightTheme,
} from "./components/ui/styled";
import { ThemeProvider } from "styled-components";
import { AlignJustify } from "lucide-react";
import { Info, Settings } from "./components/Sidebar";
import toast from "react-hot-toast";

const nodeTypes = {
  block: Block,
  connector: Connector,
  terminal: Terminal,
  textbox: TextBox,
};

const edgeTypes = {
  part: Part,
  connected: Connected,
  fulfilled: Fulfilled,
  projection: Projection,
  proxy: Proxy,
  specialisation: Specialisation,
  transfer: Transfer,
};

export default function App() {
  const [edgeType, setEdgeType] = useState<string>("part");

  const { openSettings } = useSettings();
  const { sheet, closeSheet } = useSheet();
  const { theme } = useTheme();

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
  const [edgeCount, setEdgeCount] = useState(edges.length);

  useEffect(() => {
    localStorage.setItem("nodes", JSON.stringify(nodes));
    localStorage.setItem("edges", JSON.stringify(edges));

    if (
      theme === "dark" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Backspace" || e.key === "Delete") {
        if (sheet?.open) {
          closeSheet();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [nodes, edges, sheet?.open, closeSheet, theme]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      if (canConnect(params)) {
        const newConnection = {
          ...params,
          type: edgeType,
          data: {
            label: `Edge ${edgeCount}`,
            type: edgeType,
            createdAt: Date.now(),
          },
        };

        setEdgeCount(edgeCount + 1);
        return setEdges(eds => addEdge(newConnection, eds));
      }
    },
    [edgeCount, setEdges, edgeType],
  );

  const addNode = (type: NodeType) => {
    const id = nodeCount.toString();
    const newNode = {
      id,
      type,
      position: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      },
      data: { type, id, createdAt: Date.now() },
    };

    setNodes(nds => nds.concat(newNode));
    setNodeCount(nodeCount + 1);
  };

  const deleteNode = (): void => {
    const id = sheet.currentNode?.id;
    const currentNode = nodes.find(node => node.id === id);

    if (!currentNode) {
      toast.error("No node selected");
      return;
    }

    const connectedEdges = getConnectedEdges([currentNode], edges);
    const updatedEdges = getSymmetricDifference(edges, connectedEdges);

    const updatedNodes = nodes.filter(node => node.id !== id);

    setNodes(updatedNodes);
    setEdges(updatedEdges);
  };

  const deleteEdge = (): void => {
    const id = sheet.currentEdge?.id;
    const currentNode = edges.find(edge => edge.id === id);

    if (!currentNode) {
      toast.error("No edge selected");
      return;
    }

    const updatedEdges = edges.filter(edge => edge.id !== id);
    setEdges(updatedEdges);
  };

  return (
    <main className="w-screen h-screen">
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
        <ReactFlowStyled
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
        >
          <Info deleteEdge={deleteEdge} deleteNode={deleteNode} />

          <Settings />
          <Panel position="top-left" className="z-10">
            <AlignJustify
              onClick={openSettings}
              className={cn("w-10 h-10", {
                "text-white": theme === "dark",
                "text-black": theme === "light",
              })}
            />
          </Panel>
          <Panel position="top-center" className="w-full flex justify-center">
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
              className={
                theme === "light"
                  ? buttonVariants.button
                  : buttonVariants.textbox
              }
              onClick={() => addNode(NodeType.TextBox)}
            >
              Add TextBox
            </button>
          </Panel>
          <Panel
            position="top-right"
            className="w-100 flex justify-center flex-col"
          >
            <button
              className={cn(
                `${buttonVariants.edge} border-green-400 text-green-400 hover:bg-green-400 `,
                {
                  "bg-green-400 text-white border-transparent":
                    edgeType === "part",
                },
              )}
              onClick={() => setEdgeType("part")}
            >
              Part of
            </button>
            <button
              className={cn(
                `${buttonVariants.edge} border-blue-200 text-blue-200 hover:bg-blue-200 `,
                {
                  "bg-blue-200 text-white border-transparent":
                    edgeType === "connected",
                },
              )}
              onClick={() => setEdgeType("connected")}
            >
              Connected to
            </button>
            <button
              className={cn(
                `${buttonVariants.edge} border-blue-400 text-blue-400 hover:bg-blue-400 `,
                {
                  "bg-blue-400 text-white border-transparent":
                    edgeType === "transfer",
                },
              )}
              onClick={() => setEdgeType("transfer")}
            >
              Transfer to
            </button>
            <button
              className={cn(
                `${buttonVariants.edge} border-amber-300 text-amber-300 hover:bg-amber-300 `,
                {
                  "bg-amber-300 text-white border-transparent":
                    edgeType === "specialisation",
                },
              )}
              onClick={() => setEdgeType("specialisation")}
            >
              Specialisation of
            </button>
            <button
              className={cn(
                `${buttonVariants.edge} border-amber-300 text-amber-300 hover:bg-amber-300 border-dotted`,
                {
                  "bg-amber-300 text-white border-transparent":
                    edgeType === "fulfilled",
                },
              )}
              onClick={() => setEdgeType("fulfilled")}
            >
              Fulfilled by
            </button>
            <button
              className={cn(
                `${buttonVariants.edge} border-gray-200 text-gray-200 hover:bg-gray-200 `,
                {
                  "bg-gray-200 text-white border-transparent":
                    edgeType === "proxy",
                },
              )}
              onClick={() => setEdgeType("proxy")}
            >
              Proxy
            </button>
            <button
              className={cn(
                `${buttonVariants.edge} border-dotted border-gray-200 text-gray-200 hover:bg-gray-200`,
                {
                  "bg-gray-200 text-white border-transparent":
                    edgeType === "projection",
                },
              )}
              onClick={() => setEdgeType("projection")}
            >
              Projection
            </button>
          </Panel>
          <ControlsStyled />
          <MiniMapStyled />
          <Background gap={12} size={1} />
        </ReactFlowStyled>
      </ThemeProvider>
    </main>
  );
}
