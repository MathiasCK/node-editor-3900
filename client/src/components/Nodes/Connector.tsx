import Handles from "./Handles";
import { useSheet } from "@/hooks";
import type { CustomNodeProps } from "@/lib/types";

const Connector = (props: CustomNodeProps) => {
  const { openSheet } = useSheet();

  return (
    <figure id={props.data.label}>
      <div
        onClick={() => openSheet(props)}
        className="h-8 w-8 rounded-xl bg-connector"
      >
        <header className="flex items-center justify-center w-full h-full">
          <p className="uppercase text-white">{props.data.id}</p>
        </header>
      </div>

      <Handles nodeId={props.data.label} />
    </figure>
  );
};

export default Connector;
