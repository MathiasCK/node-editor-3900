import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  type Edge,
  type Node,
  type Connection,
  Background,
  EdgeTypes,
  NodeTypes,
} from 'reactflow';
import { shallow } from 'zustand/shallow';

import 'reactflow/dist/style.css';
import { Block, Connector, Terminal } from '@/components/Nodes';
import { NodeRelation, UserWithToken } from '@/lib/types';
import {
  checkConnection,
  getSessionDetails,
  handleNewNodeRelations,
} from '@/lib/utils';
import {
  storeSelector,
  useConnection,
  useStore,
  useTheme,
  useToken,
} from '@/hooks';

import { Connected, Fulfilled, Part, Transfer } from '@/components/Edges';
import {
  ControlsStyled,
  MiniMapStyled,
  ReactFlowStyled,
  darkTheme,
  lightTheme,
} from '@/components/ui/styled';
import { ThemeProvider } from 'styled-components';
import { Sidebar, Settings, SelectConnection, Spinner } from '@/components/ui';
import { fetchNodes, updateNode } from '@/api/nodes';
import { createEdge, fetchEdges } from '@/api/edges';
import { useQuery } from '@tanstack/react-query';
import { validateToken } from '@/api/auth';
import { actions } from './state';

const Home = () => {
  const nodeTypes = useMemo(
    () => ({
      block: Block,
      connector: Connector,
      terminal: Terminal,
    }),
    []
  );

  const edgeTypes = useMemo(
    () => ({
      part: Part,
      connected: Connected,
      fulfilled: Fulfilled,
      transfer: Transfer,
    }),
    []
  );
  const { token } = useToken();
  const { theme } = useTheme();
  const { edgeType, openDialog } = useConnection();
  const [params, setParams] = useState<Edge | Connection | null>();
  const [displayDialog, setDisplayDialog] = useState<boolean>(true);

  const session = getSessionDetails();

  const { nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange } =
    useStore(storeSelector, shallow);

  useEffect(() => {
    (async () => {
      const edges = (await fetchEdges()) ?? [];
      const nodes = (await fetchNodes()) ?? [];
      setNodes(nodes as Node[]);
      setEdges(edges as Edge[]);
    })();
  }, [setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const { canConnect, lockConnection } = checkConnection(
        params,
        edgeType,
        nodes
      );
      if (!canConnect) return;

      if (lockConnection) {
        setDisplayDialog(false);
      } else {
        setDisplayDialog(true);
      }
      openDialog();
      setParams(params);
    },
    [edgeType, openDialog, nodes]
  );

  const { isPending, error, data } = useQuery({
    queryKey: ['tokenData', token],
    queryFn: () => validateToken(token),
  });

  if (isPending) {
    return <Spinner />;
  }

  if (error || !data || !(data as UserWithToken).token) {
    actions.logout();
    return null;
  }

  const createNewConnection = async () => {
    if (!params) return;

    const { connectionType, lockConnection, newNodeRelations } =
      checkConnection(params, edgeType, nodes);

    const currentDate = Date.now();
    const id = edges.length.toString();

    const newEdge = {
      ...params,
      id: `reactflow__edge-${params.source}${params.sourceHandle}-${params.target}${params.targetHandle}`,
      type: connectionType,
      data: {
        id,
        label: `Edge ${id}`,
        lockConnection,
        createdAt: currentDate,
        updatedAt: currentDate,
        createdBy: session?.user?.username,
      },
    };

    const edge = await createEdge(newEdge as Edge, edges, setEdges);

    if (edge) {
      handleNewNodeRelations(
        newNodeRelations as NodeRelation[],
        nodes,
        setNodes
      );
    }
  };

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <ReactFlowStyled
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes as unknown as NodeTypes}
        edgeTypes={edgeTypes as unknown as EdgeTypes}
        onNodeDragStop={(_, node) => updateNode(node.id, nodes, setNodes)}
      >
        <Sidebar />
        <Settings />
        <SelectConnection
          displayDialog={displayDialog}
          createNewConnection={createNewConnection}
        />
        <ControlsStyled />
        <MiniMapStyled />
        <Background gap={12} size={1} />
      </ReactFlowStyled>
    </ThemeProvider>
  );
};

export default Home;
