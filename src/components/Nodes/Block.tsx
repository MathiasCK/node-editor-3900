import { Handle, Position } from "reactflow";
import { NodeData } from "../../types";

const Block = ({ data }: NodeData) => {
  return (
    <>
      <div className="block">
        <h1 style={{ display: "none" }}>{data.label}</h1>
      </div>
      <Handle type="target" position={Position.Top} id="tm" />
      <Handle
        type="source"
        position={Position.Top}
        id="tl"
        style={{ left: 10 }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="tr"
        style={{ left: 90 }}
      />

      <Handle type="source" position={Position.Bottom} id="bm" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bl"
        style={{ left: 10 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="br"
        style={{ left: 90 }}
      />
      <Handle type="source" position={Position.Right} id="r" />
      <Handle type="source" position={Position.Left} id="l" />
    </>
  );
};

export default Block;
