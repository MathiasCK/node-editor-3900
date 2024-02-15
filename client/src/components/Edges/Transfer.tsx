import { useSheet } from "@/hooks";
import type { EdgeProps } from "reactflow";

const Transfer = (props: EdgeProps) => {
  const { openSheet } = useSheet();
  return (
    <g onClick={() => openSheet(props)}>
      <defs>
        <marker
          id="transferhead"
          markerWidth="10"
          markerHeight="7"
          refX="7"
          refY="3.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0 0, 7 3.5, 0 7" fill="#60a5fa" />
        </marker>
      </defs>
      <path
        fill="transparent"
        stroke="#60a5fa"
        strokeWidth={2}
        d={`M${props.sourceX},${props.sourceY}L${props.targetX},${props.targetY}`}
        markerEnd="url(#transferhead)"
      />
    </g>
  );
};

export default Transfer;
