import { useSheet } from "@/hooks";
import type { CustomEdgeProps } from "@/lib/types";

const Part = (props: CustomEdgeProps) => {
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
