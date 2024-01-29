import { Handle, Position } from "reactflow";
import { NodeData } from "../../types";

const Terminal = ({ data }: NodeData) => {
  return (
    <>
      <div className="terminal">
        <h1 style={{ display: "none" }}>{data.label}</h1>
      </div>
      <Handle type="target" position={Position.Top} id="terminal_top_target" />
      <Handle type="source" position={Position.Top} id="terminal_top_source" />

      <Handle
        type="source"
        position={Position.Bottom}
        id="terminal_bottom_source"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="terminal_bottom_target"
      />

      <Handle
        type="source"
        position={Position.Right}
        id="terminal_right_source"
      />
      <Handle
        type="target"
        position={Position.Right}
        id="terminal_right_target"
      />

      <Handle
        type="source"
        position={Position.Left}
        id="terminal_left_source"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="terminal_left_target"
      />
    </>
  );
};

export default Terminal;
