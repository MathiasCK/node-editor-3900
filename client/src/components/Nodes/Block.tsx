import Handles from './Handles';
import { useSidebar } from '@/hooks';
import type { CustomNodeProps } from '@/lib/types';

const Block = (props: CustomNodeProps) => {
  const { openSidebar } = useSidebar();

  return (
    <figure id={props.data.label}>
      <div
        onClick={() => openSidebar(props)}
        className={`h-12 w-24 rounded-xl bg-${props.data.aspect}-light dark:bg-${props.data.aspect}-dark`}
      >
        <header className="flex h-full w-full items-center justify-center">
          <p
            className={`text-center text-${props.data.aspect}-foreground-light dark:text-${props.data.aspect}-foreground-dark`}
          >
            {props.data.customName ?? props.data.id}
          </p>
        </header>
      </div>
      <Handles nodeId={props.data.label} />
    </figure>
  );
};

export default Block;
