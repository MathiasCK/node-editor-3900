import { useSidebar } from '@/hooks';
import type { CustomEdgeProps } from '@/lib/types';

const Projection = (props: CustomEdgeProps) => {
  const { openSidebar } = useSidebar();
  return (
    <g onClick={() => openSidebar(props)}>
      <defs>
        <marker
          id="projectionhead"
          markerWidth="10"
          markerHeight="7"
          refX="7"
          refY="3.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0 0, 7 3.5, 0 7" className="fill-projection" />
        </marker>
      </defs>
      <path
        className="stroke-projection stroke-2"
        strokeDasharray="5 5"
        d={`M${props.sourceX},${props.sourceY}L${props.targetX},${props.targetY}`}
        markerEnd="url(#projectionhead)"
      />
    </g>
  );
};

export default Projection;
