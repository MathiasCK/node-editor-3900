import { useSheet } from "@/hooks";
import type { EdgeProps } from "reactflow";

const Part = (props: EdgeProps) => {
  const { openSheet } = useSheet();
  return (
    <g onClick={() => openSheet(props)}>
      <defs>
        <marker
          id="parthead"
          markerWidth="10"
          markerHeight="7"
          refX="5"
          refY="3.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <svg
            width="7px"
            height="7px"
            viewBox="0 0 24 24"
            fill="#4ade80"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.5757 1.42426C11.81 1.18995 12.1899 1.18995 12.4243 1.42426L22.5757 11.5757C22.81 11.81 22.8101 12.1899 22.5757 12.4243L12.4243 22.5757C12.19 22.81 11.8101 22.8101 11.5757 22.5757L1.42426 12.4243C1.18995 12.19 1.18995 11.8101 1.42426 11.5757L11.5757 1.42426Z"
              stroke="#4ade80"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </marker>
      </defs>
      <path
        fill="transparent"
        stroke="#4ade80"
        strokeWidth={2}
        d={`M${props.sourceX},${props.sourceY}L${props.targetX},${props.targetY}`}
        markerEnd="url(#parthead)"
      />
    </g>
  );
};

export default Part;
