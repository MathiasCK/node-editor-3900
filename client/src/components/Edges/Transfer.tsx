import { useSidebar } from "@/hooks";
import type { CustomEdgeProps } from "@/lib/types";

const Transfer = (props: CustomEdgeProps) => {
  const { openSidebar } = useSidebar();
  return (
    <g onClick={() => openSidebar(props)}>
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
          <polygon points="0 0, 7 3.5, 0 7" className="stroke-transfer" />
        </marker>
      </defs>
      <path
        className="stroke-2 stroke-transfer"
        d={`M${props.sourceX},${props.sourceY}L${props.targetX},${props.targetY}`}
        markerEnd="url(#transferhead)"
      />
    </g>
  );
};

export default Transfer;
