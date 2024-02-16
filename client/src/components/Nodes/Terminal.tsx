import Handles from "./Handles";
import { useSheet } from "@/hooks";
import type { CustomNodeProps } from "@/lib/types";

const Terminal = (props: CustomNodeProps) => {
  const { openSheet } = useSheet();

  return (
    <figure id={props.data.label}>
      <div onClick={() => openSheet(props)} className="h-4 w-4 bg-terminal">
        <header className="flex items-center justify-center w-full h-full">
          <p className="uppercase text-white">{props.data.id}</p>
        </header>
      </div>

      <Handles nodeId={props.data.label} />
    </figure>
  );
};

export default Terminal;
