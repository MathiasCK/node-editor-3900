import { useSheet } from "@/hooks";
import { EdgeProps } from "reactflow";

const Proxy = (props: EdgeProps) => {
  const { openSheet } = useSheet();
  return (
    <g
      onClick={() =>
        openSheet({
          type: "edge",
          title: props.data.label,
          subtitle: `Created at: ${new Date(
            props.data.createdAt,
          ).toLocaleString()}`,
        })
      }
    >
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
