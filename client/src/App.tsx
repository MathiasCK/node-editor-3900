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
  EdgeTypes,
} from "reactflow";

import "reactflow/dist/style.css";
import { Block, Connector, Terminal, TextBox } from "./components/Nodes";
import { buttonVariants } from "./lib/config";
import { EdgeType, NodeType } from "./lib/types";
import { canConnect, cn, getSymmetricDifference } from "./lib/utils";
import { useSheet, useTheme } from "./hooks";

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
import { Info, Settings } from "./components/ui";
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
  const [edgeType, setEdgeType] = useState<EdgeType>(EdgeType.Part);

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
        const currentDate = Date.now();
        const newConnection = {
          ...params,
          type: edgeType,
          data: {
            id: edgeCount.toString(),
            label: `Edge ${edgeCount}`,
            type: edgeType,
            createdAt: currentDate,
            updatedAt: currentDate,
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
    const currentDate = Date.now();
    const newNode = {
      id,
      type,
      position: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      },
      data: {
        label: `${type}_${id}`,
        type,
        id,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    };

    setNodes(nds => nds.concat(newNode));
    setNodeCount(nodeCount + 1);
  };

  const deleteSelectedNode = (selectedNodeId: string): void => {
    const currentNode = nodes.find(node => node.id === selectedNodeId);

    if (!currentNode) {
      toast.error("Could not delete -> no node selected");
      return;
    }

    const connectedEdges = getConnectedEdges([currentNode], edges);
    const updatedEdges = getSymmetricDifference(edges, connectedEdges);

    const updatedNodes = nodes.filter(node => node.id !== selectedNodeId);

    setNodes(updatedNodes);
    setEdges(updatedEdges);

    toast.success(`Node ${selectedNodeId} deleted`);
  };

  const deleteSelectedEdge = (
    selectedEdgeId: string,
    displayToast = true,
  ): void => {
    const currentNode = edges.find(edge => edge.id === selectedEdgeId);

    if (!currentNode) {
      toast.error("Could not delete -> no edge selected");
      return;
    }

    const updatedEdges = edges.filter(edge => edge.id !== selectedEdgeId);
    setEdges(updatedEdges);

    if (displayToast) {
      toast.success(`Edge ${selectedEdgeId} deleted`);
    }
  };

  const updateNodeName = (nodeId: string, newName: string) => {
    const nodeToUpdate = nodes.find(node => node.id === nodeId);
    const index = nodes.findIndex(node => node.id === nodeId);

    if (!nodeToUpdate || index === -1) {
      toast.error("Could not update name -> no node selected");
      return;
    }

    nodeToUpdate.data.customName = newName;

    const newNodes = [...nodes];
    newNodes[index] = nodeToUpdate;

    setNodes(newNodes);
    toast.success("Name updated");
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
          edgeTypes={edgeTypes as EdgeTypes}
        >
          <Info
            deleteSelectedEdge={deleteSelectedEdge}
            deleteSelectedNode={deleteSelectedNode}
            setEdges={setEdges}
            updateNodeName={updateNodeName}
          />

          <Settings />

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
                    edgeType === EdgeType.Part,
                },
              )}
              onClick={() => setEdgeType(EdgeType.Part)}
            >
              Part of
            </button>
            <button
              className={cn(
                `${buttonVariants.edge} border-blue-200 text-blue-200 hover:bg-blue-200 `,
                {
                  "bg-blue-200 text-white border-transparent":
                    edgeType === EdgeType.Connected,
                },
              )}
              onClick={() => setEdgeType(EdgeType.Connected)}
            >
              Connected to
            </button>
            <button
              className={cn(
                `${buttonVariants.edge} border-blue-400 text-blue-400 hover:bg-blue-400 `,
                {
                  "bg-blue-400 text-white border-transparent":
                    edgeType === EdgeType.Transfer,
                },
              )}
              onClick={() => setEdgeType(EdgeType.Transfer)}
            >
              Transfer to
            </button>
            <button
              className={cn(
                `${buttonVariants.edge} border-amber-300 text-amber-300 hover:bg-amber-300 `,
                {
                  "bg-amber-300 text-white border-transparent":
                    edgeType === EdgeType.Specialisation,
                },
              )}
              onClick={() => setEdgeType(EdgeType.Specialisation)}
            >
              Specialisation of
            </button>
            <button
              className={cn(
                `${buttonVariants.edge} border-amber-300 text-amber-300 hover:bg-amber-300 border-dotted`,
                {
                  "bg-amber-300 text-white border-transparent":
                    edgeType === EdgeType.Fulfilled,
                },
              )}
              onClick={() => setEdgeType(EdgeType.Fulfilled)}
            >
              Fulfilled by
            </button>
            <button
              className={cn(
                `${buttonVariants.edge} border-gray-200 text-gray-200 hover:bg-gray-200 `,
                {
                  "bg-gray-200 text-white border-transparent":
                    edgeType === EdgeType.Proxy,
                },
              )}
              onClick={() => setEdgeType(EdgeType.Proxy)}
            >
              Proxy
            </button>
            <button
              className={cn(
                `${buttonVariants.edge} border-dotted border-gray-200 text-gray-200 hover:bg-gray-200`,
                {
                  "bg-gray-200 text-white border-transparent":
                    edgeType === EdgeType.Projection,
                },
              )}
              onClick={() => setEdgeType(EdgeType.Projection)}
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
