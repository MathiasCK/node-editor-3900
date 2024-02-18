import { useSidebar } from "@/hooks";
import type { CustomEdgeProps } from "@/lib/types";

const Connected = (props: CustomEdgeProps) => {
  const { openSidebar } = useSidebar();
  return (
    <g onClick={() => openSidebar(props)}>
      <path
        className="stroke-connected stroke-2"
        d={`M${props.sourceX},${props.sourceY}L${props.targetX},${props.targetY}`}
      />
    </g>
  );
};

export default Connected;
