import { useSidebar } from "@/hooks";
import type { CustomEdgeProps } from "@/lib/types";

const Proxy = (props: CustomEdgeProps) => {
  const { openSidebar } = useSidebar();
  return (
    <g onClick={() => openSidebar(props)}>
      <path
        fill="transparent"
        stroke="#e5e7eb"
        strokeWidth={2}
        strokeDasharray="5 5"
        d={`M${props.sourceX},${props.sourceY}L${props.targetX},${props.targetY}`}
      />
    </g>
  );
};

export default Proxy;
