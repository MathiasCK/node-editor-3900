import Handles from './Handles';
import { useSidebar } from '@/hooks';
import type { CustomNodeProps } from '@/lib/types';

const Connector = (props: CustomNodeProps) => {
  const { openSidebar } = useSidebar();

  return (
    <figure id={props.data.label}>
      <div
        onClick={() => openSidebar(props)}
        className={`h-8 w-8 rounded-xl bg-${props.data.aspect}-light dark:bg-${props.data.aspect}-dark`}
      >
        <header className="flex h-full w-full items-center justify-center">
          <p
            className={`text-center text-${props.data.aspect}-foreground-light dark:text-${props.data.aspect}-foreground-dark`}
          >
            {props.id}
          </p>
        </header>
      </div>

      <Handles nodeId={props.data.label} />
    </figure>
  );
};

export default Connector;
