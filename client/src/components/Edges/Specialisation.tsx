import { useSheet, useTheme } from "@/hooks";
import type { EdgeProps } from "reactflow";

const Specialisation = (props: EdgeProps) => {
  const { openSheet } = useSheet();
  const { theme } = useTheme();
  return (
    <g onClick={() => openSheet(props)}>
      <defs>
        <marker
          id="specialhead"
          markerWidth="10"
          markerHeight="10"
          refX="7"
          refY="3.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <svg width="20" height="10" xmlns="http://www.w3.org/2000/svg">
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill={theme === "dark" ? "#000" : "#fff"}
              stroke="#fcd34c"
              strokeWidth="1"
            />
          </svg>
        </marker>
      </defs>
      <path
        fill="transparent"
        stroke="#fcd34c"
        strokeWidth={2}
        d={`M${props.sourceX},${props.sourceY}L${props.targetX},${props.targetY}`}
        markerEnd="url(#specialhead)"
      />
    </g>
  );
};

export default Specialisation;
