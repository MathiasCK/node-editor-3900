import { Handle, Position } from "reactflow";
import { NodeData } from "../../types";

const Block = ({ data }: NodeData) => {
  return (
    <>
      <div className="block">
        <h1 style={{ display: "none" }}>{data.label}</h1>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        id="block_top_middle_target"
      />
      <Handle
        type="source"
        position={Position.Top}
        id="block_top_middle_source"
      />
      <Handle
        type="source"
        position={Position.Top}
        id="block_top_left_source"
        style={{ left: 10 }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="block_top_left_target"
        style={{ left: 10 }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="block_top_right_target"
        style={{ left: 90 }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="block_top_right_source"
        style={{ left: 90 }}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        id="block_bottom_middle_source"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="block_bottom_middle_target"
      />

      <Handle
        type="target"
        position={Position.Bottom}
        id="block_bottom_left_target"
        style={{ left: 10 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="block_bottom_left_source"
        style={{ left: 10 }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="block_bottom_right_target"
        style={{ left: 90 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="block_bottom_right_source"
        style={{ left: 90 }}
      />

      <Handle type="target" position={Position.Right} id="block_right_target" />
      <Handle type="source" position={Position.Right} id="block_right_source" />

      <Handle type="target" position={Position.Left} id="block_left_target" />
      <Handle type="source" position={Position.Left} id="block_left_source" />
    </>
  );
};

export default Block;
