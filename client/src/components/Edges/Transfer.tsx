import { useSidebar } from '@/hooks';
import type { CustomEdgeProps } from '@/lib/types';

const Transfer = (props: CustomEdgeProps) => {
  const { openSidebar } = useSidebar();

  const midX1 = (props.sourceX + props.targetX) / 2;
  const midY1 = props.sourceY;
  const midX2 = midX1;
  const midY2 = props.targetY;

  const pathData = `M${props.sourceX},${props.sourceY} L${midX1},${midY1} L${midX2},${midY2} L${props.targetX},${props.targetY}`;

  return (
    <g onClick={() => openSidebar({ ...props, type: 'transfer' })}>
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
      </defs>
      <path
        className="stroke-transfer stroke-2"
        d={pathData}
        fill="none"
        markerEnd="url(#transferhead)"
      />
    </g>
  );
};

export default Transfer;
