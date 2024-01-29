import { Handle, Position } from "reactflow";
import { NodeData } from "../../types";

const Terminal = ({ data }: NodeData) => {
  return (
    <>
      <div className="terminal">
        <h1 style={{ display: "none" }}>{data.label}</h1>
      </div>
      <Handle type="target" position={Position.Top} id="tm" />

      <Handle type="source" position={Position.Bottom} id="bm" />

      <Handle type="source" position={Position.Right} id="r" />
      <Handle type="source" position={Position.Left} id="l" />
    </>
  );
};

export default Terminal;
