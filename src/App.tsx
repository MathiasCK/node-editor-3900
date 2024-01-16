import { useCallback, useEffect, useState } from "react";
import ReactFlow, { useNodesState, useEdgesState, addEdge } from "reactflow";

import "reactflow/dist/style.css";
import styles from "./App.module.css";
import { CustomNode } from "./components";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    JSON.parse(localStorage.getItem("reactFlowNodes") as string) ??
      initialNodes,
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    JSON.parse(localStorage.getItem("reactFlowEdges") as string) ??
      initialEdges,
  );
  const [nextNodeId, setNextNodeId] = useState(3);

  const onConnect = useCallback(
    params => setEdges(eds => addEdge(params, eds)),
    [setEdges],
  );

  const createNode = useCallback(() => {
    const newNode = {
      id: String(nextNodeId),
      position: {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      },
      data: { label: String(nextNodeId) },
    };

    setNextNodeId(nextNodeId + 1);
    setNodes(nds => nds.concat(newNode));
  }, [setNodes, nextNodeId]);

  useEffect(() => {
    localStorage.setItem("reactFlowNodes", JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem("reactFlowEdges", JSON.stringify(edges));
  }, [edges]);

  return (
    <div className={styles.app} style={{ width: "100vw", height: "100vh" }}>
      <button className={styles.button} onClick={createNode}>
        Create node
      </button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        //nodeTypes={{ custom: CustomNode }}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      />
    </div>
  );
};

export default App;
