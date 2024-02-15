import Handles from "./Handles";
import type { NodeProps } from "reactflow";
import { useSheet } from "@/hooks";

const Block = (props: NodeProps) => {
  const { openSheet } = useSheet();
  const nodeId = `${props.data.type}_${props.data.id}`;

  return (
    <figure id={nodeId}>
      <div
        onClick={() => openSheet(props)}
        className="h-12 w-24 rounded-xl bg-block"
      >
        <header className="flex items-center justify-center w-full h-full">
          <p className="uppercase text-white">{props.data.id}</p>
        </header>
      </div>
      <Handles nodeId={nodeId} />
    </figure>
  );
};

export default Block;
