import { useSidebar } from '@/hooks';
import type { CustomEdgeProps } from '@/lib/types';

const Connected = (props: CustomEdgeProps) => {
  const { openSidebar } = useSidebar();

  const midX1 = (props.sourceX + props.targetX) / 2;
  const midY1 = props.sourceY;
  const midX2 = midX1;
  const midY2 = props.targetY;

  const pathData = `M${props.sourceX},${props.sourceY} L${midX1},${midY1} L${midX2},${midY2} L${props.targetX},${props.targetY}`;

  return (
    <g onClick={() => openSidebar({ ...props, type: 'connected' })}>
      <path className="stroke-connected stroke-2" d={pathData} fill="none" />
    </g>
  );
};

export default Connected;
