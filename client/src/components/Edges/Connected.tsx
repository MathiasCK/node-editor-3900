import { useSheet } from "@/hooks";
import { EdgeProps } from "reactflow";

const Part = (props: EdgeProps) => {
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
        stroke="#bfdbfe"
        strokeWidth={2}
        d={`M${props.sourceX},${props.sourceY}L${props.targetX},${props.targetY}`}
      />
    </g>
  );
};

export default Part;
