import { Handle, Position } from "reactflow";
import { NodeData } from "../../types";

const Connector = ({ data }: NodeData) => {
  return (
    <>
      <div className="h-8 w-8 rounded-3xl bg-connector">
        <h1 style={{ display: "none" }}>{data.label}</h1>
      </div>

      <Handle type="target" position={Position.Top} id="connector_top_target" />
      <Handle type="source" position={Position.Top} id="connector_top_source" />

      <Handle
        type="source"
        position={Position.Bottom}
        id="connector_bottom_source"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="connector_bottom_target"
      />

      <Handle
        type="source"
        position={Position.Right}
        id="connector_right_source"
      />
      <Handle
        type="target"
        position={Position.Right}
        id="connector_right_target"
      />

      <Handle
        type="source"
        position={Position.Left}
        id="connector_left_source"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="connector_left_target"
      />
    </>
  );
};

export default Connector;
