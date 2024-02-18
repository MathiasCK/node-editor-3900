import { useSidebar } from "@/hooks";
import type { CustomEdgeProps } from "@/lib/types";

const Specialisation = (props: CustomEdgeProps) => {
  const { openSidebar } = useSidebar();

  return (
    <g onClick={() => openSidebar(props)}>
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
              className="stroke-specialisation fill-white dark:fill-black"
              points="0 0, 10 3.5, 0 7"
            />
          </svg>
        </marker>
      </defs>
      <path
        className="stroke-specialisation stroke-2"
        d={`M${props.sourceX},${props.sourceY}L${props.targetX},${props.targetY}`}
        markerEnd="url(#specialhead)"
      />
    </g>
  );
};

export default Specialisation;
