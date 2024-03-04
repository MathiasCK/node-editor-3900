import { FC } from 'react';
import { Handle, Position } from 'reactflow';

const Handles: FC<{
  nodeId: string;
}> = ({ nodeId }) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        id={`${nodeId}_top_target`}
      />
      <Handle
        type="source"
        position={Position.Top}
        id={`${nodeId}_top_source`}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id={`${nodeId}_bottom_target`}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id={`${nodeId}_bottom_source`}
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
    </>
  );
};

export default Handles;
