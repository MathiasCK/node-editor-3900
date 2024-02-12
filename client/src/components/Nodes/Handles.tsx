import { isBlock } from "@/utils";
import { FC } from "react";
import { Handle, Position } from "reactflow";

const Handles: FC<{
  nodeId: string;
}> = ({ nodeId }) => {
  return (
    <>
      {isBlock(nodeId) ? (
        <>
          <Handle
            type="target"
            position={Position.Top}
            id={`${nodeId}_top_middle_target`}
          />
          <Handle
            type="source"
            position={Position.Top}
            id={`${nodeId}_top_middle_source`}
          />
          <Handle
            type="source"
            position={Position.Top}
            id={`${nodeId}_top_left_source`}
            style={{ left: 10 }}
          />
          <Handle
            type="target"
            position={Position.Top}
            id={`${nodeId}_top_left_target`}
            style={{ left: 10 }}
          />
          <Handle
            type="target"
            position={Position.Top}
            id={`${nodeId}_top_right_target`}
            style={{ left: 90 }}
          />
          <Handle
            type="source"
            position={Position.Top}
            id={`${nodeId}_top_right_source`}
            style={{ left: 90 }}
          />

          <Handle
            type="source"
            position={Position.Bottom}
            id={`${nodeId}_bottom_middle_source`}
          />
          <Handle
            type="target"
            position={Position.Bottom}
            id={`${nodeId}_bottom_middle_target`}
          />

          <Handle
            type="target"
            position={Position.Bottom}
            id={`${nodeId}_bottom_left_target`}
            style={{ left: 10 }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id={`${nodeId}_bottom_left_source`}
            style={{ left: 10 }}
          />
          <Handle
            type="target"
            position={Position.Bottom}
            id={`${nodeId}_bottom_right_target`}
            style={{ left: 90 }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id={`${nodeId}_bottom_right_source`}
            style={{ left: 90 }}
          />

          <Handle
            type="target"
            position={Position.Right}
            id={`${nodeId}_right_target`}
          />
          <Handle
            type="source"
            position={Position.Right}
            id={`${nodeId}_right_source`}
          />

          <Handle
            type="target"
            position={Position.Left}
            id={`${nodeId}_left_target`}
          />
          <Handle
            type="source"
            position={Position.Left}
            id={`${nodeId}_left_source`}
          />
        </>
      ) : (
        <>
          <Handle
            type="target"
            position={Position.Top}
            id="connector_top_target"
          />
          <Handle
            type="source"
            position={Position.Top}
            id="connector_top_source"
          />

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
      )}
    </>
  );
};

export default Handles;
