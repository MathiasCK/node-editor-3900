import { FC } from "react";
import { Handle, Position } from "reactflow";

const Handles: FC<{
  nodeId: string;
}> = ({ nodeId }) => {
  return (
    <>
      <Handle type="target" position={Position.Top} id={`${nodeId}_target`} />
      <Handle
        type="source"
        position={Position.Bottom}
        id={`${nodeId}_source`}
      />
    </>
  );
};

export default Handles;
