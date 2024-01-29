import toast from "react-hot-toast";
import type { Connection, Edge } from "reactflow";

export const canConnect = (params: Edge | Connection): boolean => {
  if (params.source === params.target) {
    toast.error("Cannot connect node to itself");
    return false;
  }
  if (
    isBlock(params.sourceHandle as string) &&
    isBlock(params.targetHandle as string)
  ) {
    toast.error("Cannot connect block to block");
    return false;
  }
  return true;
};

export const isBlock = (id: string): boolean => id.includes("block");

export const isConnector = (id: string): boolean => id.includes("connector");

export const isTerminal = (id: string): boolean => id.includes("terminal");