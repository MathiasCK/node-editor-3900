import toast from "react-hot-toast";
import type { Connection, Edge } from "reactflow";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

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

export const isTextBox = (id: string): boolean => id.includes("textbox");

export const getSymmetricDifference = (arr1: Edge[], arr2: Edge[]): Edge[] => {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  const difference = new Set(
    [...set1]
      .filter(x => !set2.has(x))
      .concat([...set2].filter(x => !set1.has(x))),
  );

  return Array.from(difference);
};

export const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);
