import { useSidebar } from "@/hooks";
import type { CustomEdgeProps } from "@/lib/types";

const Fulfilled = (props: CustomEdgeProps) => {
  const { openSidebar } = useSidebar();

  return (
    <g onClick={() => openSidebar(props)}>
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
            className="stroke-fulfilled fill-white dark:fill-black"
            width="5px"
            height="5px"
            viewBox="0 0 5 5"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            aria-labelledby="rectangleIconTitle"
            strokeLinecap="square"
            strokeLinejoin="miter"
          >
            {" "}
            <title id="rectangleIconTitle">Rectangle</title>{" "}
            <rect width="5" height="5" x="0" y="0" />{" "}
          </svg>
        </marker>
      </defs>
      <path
        className="stroke-fulfilled stroke-2"
        d={`M${props.sourceX},${props.sourceY}L${props.targetX},${props.targetY}`}
        markerEnd="url(#fulfilledhead)"
      />
    </g>
  );
};

export default Fulfilled;
