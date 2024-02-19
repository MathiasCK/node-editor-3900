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
import { AspectType, NodeType } from "./lib/types";
import { addNode, checkConnection, handleNewNodeRelations } from "./lib/utils";
import { storeSelector, useConnection, useStore, useTheme } from "./hooks";

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
import { Sidebar, Settings, SelectConnection } from "./components/ui";

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

  const { theme } = useTheme();
  const { edgeType, openDialog } = useConnection();
  const [params, setParams] = useState<Edge | Connection | null>();
  const [displayDialog, setDisplayDialog] = useState<boolean>(true);

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

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        event.stopPropagation();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [theme]);

  const createNewConnection = () => {
    if (!params) return;

    const { connectionType, lockConnection, newNodeRelations } =
      checkConnection(params, edgeType);

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
  };

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const { canConnect, lockConnection } = checkConnection(params, edgeType);
      if (!canConnect) return;

      if (lockConnection) {
        setDisplayDialog(false);
      } else {
        setDisplayDialog(true);
      }
      openDialog();
      setParams(params);
    },
    [edgeType, openDialog],
  );

  return (
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
        <SelectConnection
          displayDialog={displayDialog}
          createNewConnection={createNewConnection}
        />
        <Panel
          position="top-right"
          className="h-full w-100 flex justify-center flex-col"
        >
          <button
            className={
              theme === "light" ? buttonVariants.button : buttonVariants.textbox
            }
            onClick={() =>
              addNode("white" as AspectType, NodeType.TextBox, nodes, setNodes)
            }
          >
            Add TextBox
          </button>
        </Panel>
        <ControlsStyled />
        <MiniMapStyled />
        <Background gap={12} size={1} />
      </ReactFlowStyled>
    </ThemeProvider>
  );
}
