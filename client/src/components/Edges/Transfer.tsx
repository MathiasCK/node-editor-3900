import { useSidebar } from '@/hooks';
import type { CustomEdgeProps } from '@/lib/types';

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

        <marker
          id="transfertail"
          markerWidth="10"
          markerHeight="7"
          refX="3"
          refY="3.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="7 0, 0 3.5, 7 7" className="stroke-transfer" />
        </marker>
      </defs>
      <path
        className="stroke-transfer stroke-2"
        d={`M${props.sourceX},${props.sourceY}L${props.targetX},${props.targetY}`}
        markerEnd="url(#transferhead)"
        markerStart="url(#transfertail)"
      />
    </g>
  );
};

export default Transfer;
