import { useCallback, useEffect, useState } from "react";
import {
  type Edge,
  type Connection,
  Background,
  addEdge,
  Panel,
  getConnectedEdges,
  EdgeTypes,
} from "reactflow";
import { shallow } from "zustand/shallow";

import "reactflow/dist/style.css";
import { Block, Connector, Terminal, TextBox } from "./components/Nodes";
import { buttonVariants } from "./lib/config";
import { EdgeType, NodeType } from "./lib/types";
import { addNode, canConnect, cn, getSymmetricDifference } from "./lib/utils";
import { storeSelector, useSidebar, useStore, useTheme } from "./hooks";

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
import { Sidebar, Settings } from "./components/ui";
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

  const { sidebar, closeSidebar } = useSidebar();
  const { theme } = useTheme();

  const { nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange } =
    useStore(storeSelector, shallow);

  useEffect(() => {
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
        if (sidebar?.open && !sidebar?.edit) {
          closeSidebar();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [sidebar?.open, closeSidebar, theme, sidebar?.edit]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      if (canConnect(params)) {
        const currentDate = Date.now();
        const id = edges.length.toString();
        const newConnection = {
          ...params,
          type: edgeType,
          data: {
            id,
            label: `Edge ${id}`,
            type: edgeType,
            createdAt: currentDate,
            updatedAt: currentDate,
          },
        };

        const newEdges = addEdge(newConnection, edges);
        return setEdges(newEdges);
      }
    },
    [edges, edgeType, setEdges],
  );

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
    const currentEdge = edges.find(edge => edge.id === selectedEdgeId);

    if (!currentEdge) {
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
          <Sidebar
            deleteSelectedEdge={deleteSelectedEdge}
            deleteSelectedNode={deleteSelectedNode}
            updateNodeName={updateNodeName}
          />

          <Settings />

          <Panel
            position="top-right"
            className="h-full w-100 flex justify-center flex-col"
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
            <button
              className={
                theme === "light"
                  ? buttonVariants.button
                  : buttonVariants.textbox
              }
              onClick={() => addNode(NodeType.TextBox, nodes, setNodes)}
            >
              Add TextBox
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
