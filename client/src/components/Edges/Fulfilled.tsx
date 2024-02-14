import { useSheet } from "@/hooks";
import { EdgeProps } from "reactflow";

const Fulfilled = (props: EdgeProps) => {
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
      <defs>
        <marker
          id="fulfilledhead"
          markerWidth="10"
          markerHeight="7"
          refX="5"
          refY="2.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <svg
            width="5px"
            height="5px"
            viewBox="0 0 5 5"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            aria-labelledby="rectangleIconTitle"
            stroke="#fcd34c"
            strokeWidth="1"
            strokeLinecap="square"
            strokeLinejoin="miter"
            fill="black"
            color="#fcd34c"
          >
            {" "}
            <title id="rectangleIconTitle">Rectangle</title>{" "}
            <rect width="5" height="5" x="0" y="0" />{" "}
          </svg>
        </marker>
      </defs>
      <path
        fill="transparent"
        stroke="#fcd34c"
        strokeWidth={2}
        d={`M${props.sourceX},${props.sourceY}L${props.targetX},${props.targetY}`}
        markerEnd="url(#fulfilledhead)"
      />
    </g>
  );
};

export default Fulfilled;
