import Handles from "./Handles";
import { useSidebar } from "@/hooks";
import type { CustomNodeProps } from "@/lib/types";

const Connector = (props: CustomNodeProps) => {
  const { openSidebar } = useSidebar();

  return (
    <figure id={props.data.label}>
      <div
        onClick={() => openSidebar(props)}
        className={`h-8 w-8 rounded-xl bg-${props.data.aspect}`}
      >
        <header className="flex items-center justify-center w-full h-full">
          <p className="uppercase text-black">{props.data.id}</p>
        </header>
      </div>

      <Handles nodeId={props.data.label} />
    </figure>
  );
};

export default Connector;
