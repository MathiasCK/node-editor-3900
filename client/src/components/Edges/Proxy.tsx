import { useSheet } from "@/hooks";
import type { CustomEdgeProps } from "@/lib/types";

const Proxy = (props: CustomEdgeProps) => {
  const { openSheet } = useSheet();
  return (
    <g onClick={() => openSheet(props)}>
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
