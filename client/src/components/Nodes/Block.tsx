import Handles from "./Handles";
import { useSidebar } from "@/hooks";
import type { CustomNodeProps } from "@/lib/types";

const Block = (props: CustomNodeProps) => {
  const { openSidebar } = useSidebar();

  return (
    <figure id={props.data.label}>
      <div
        onClick={() => openSidebar(props)}
        className="h-12 w-24 rounded-xl bg-block"
      >
        <header className="flex items-center justify-center w-full h-full">
          <p className="uppercase text-white">{props.data.id}</p>
        </header>
      </div>
      <Handles nodeId={props.data.label} />
    </figure>
  );
};

export default Block;
