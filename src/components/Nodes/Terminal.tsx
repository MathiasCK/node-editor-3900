import { Handle, Position } from "reactflow";

const handleStyle = { left: 10 };

const Terminal = ({ data }) => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="terminal">
        <h1>Terminal {data.label}</h1>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={handleStyle}
      />
    </>
  );
};

export default Terminal;
