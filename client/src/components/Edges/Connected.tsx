import { useSheet } from "@/hooks";
import type { EdgeProps } from "reactflow";

const Part = (props: EdgeProps) => {
  const { openSheet } = useSheet();
  return (
    <g onClick={() => openSheet(props)}>
      <path
        fill="transparent"
        stroke="#bfdbfe"
        strokeWidth={2}
        d={`M${props.sourceX},${props.sourceY}L${props.targetX},${props.targetY}`}
      />
    </g>
  );
};

export default Part;
