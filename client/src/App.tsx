import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type Edge,
  type Connection,
  Background,
  addEdge,
  Panel,
  EdgeTypes,
  NodeTypes,
} from "reactflow";
import { shallow } from "zustand/shallow";

import "reactflow/dist/style.css";
import { Block, Connector, Terminal, TextBox } from "./components/Nodes";
import { buttonVariants } from "./lib/config";
import { EdgeType, NodeType } from "./lib/types";
import {
  addNode,
  checkConnection,
  cn,
  deleteEdgeWithRelations,
  handleNewNodeRelations,
} from "./lib/utils";
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

export default function App() {
  const nodeTypes = useMemo(
    () => ({
      block: Block,
      connector: Connector,
      terminal: Terminal,
      textbox: TextBox,
    }),
    [],
  );

  const edgeTypes = useMemo(
    () => ({
      part: Part,
      connected: Connected,
      fulfilled: Fulfilled,
      projection: Projection,
      proxy: Proxy,
      specialisation: Specialisation,
      transfer: Transfer,
    }),
    [],
  );

  const [edgeType, setEdgeType] = useState<EdgeType>(EdgeType.Part);

  const { sidebar, closeSidebar, handleEdit } = useSidebar();
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
      if (
        (e.key === "Backspace" || e.key === "Delete") &&
        sidebar?.open &&
        !sidebar?.edit
      ) {
        if (sidebar.currentEdge) {
          deleteEdgeWithRelations(
            sidebar.currentEdge?.id as string,
            edges,
            setEdges,
            nodes,
            setNodes,
          );
        }

        closeSidebar();
        handleEdit(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    sidebar?.open,
    closeSidebar,
    theme,
    sidebar?.edit,
    sidebar.currentEdge,
    handleEdit,
    edges,
    setEdges,
    nodes,
    setNodes,
  ]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const { canConnect, connectionType, lockConnection, newNodeRelations } =
        checkConnection(params, edgeType);
      if (canConnect) {
        const currentDate = Date.now();
        const id = edges.length.toString();
        const newConnection = {
          ...params,
          type: connectionType,
          data: {
            id,
            label: `Edge ${id}`,
            type: connectionType,
            lockConnection,
            createdAt: currentDate,
            updatedAt: currentDate,
          },
        };

        if (newNodeRelations.length > 0) {
          handleNewNodeRelations(newNodeRelations, nodes, setNodes);
        }

        const newEdges = addEdge(newConnection, edges);
        return setEdges(newEdges);
      }
    },
    [edges, edgeType, setEdges, nodes, setNodes],
  );

  return (
    <main className="w-screen h-screen">
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
        <ReactFlowStyled
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes as unknown as NodeTypes}
          edgeTypes={edgeTypes as unknown as EdgeTypes}
        >
          <Sidebar />
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
