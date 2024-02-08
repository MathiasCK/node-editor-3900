import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const commonStyles =
  "border-2 bg-transparent uppercase font-bold cursor-pointer transition duration-300 ease-in-out outline-none m-5 hover:text-white hover:border-transparent";

export const buttonVariants = {
  textbox:
    "px-5 py-2.5 border-2 border-white bg-transparent text-white uppercase font-bold cursor-pointer transition duration-300 ease-in-out outline-none m-5 hover:bg-white hover:text-black hover:border-transparent",
  edge: `${commonStyles} border-black-300 text-black-300      hover:bg-white text-white`,
  button: `${commonStyles} px-5 py-2.5 border-black  text-black hover:bg-black`,
  block: `${commonStyles} px-5 py-2.5 border-block text-block hover:bg-block`,
  connector: `${commonStyles} px-5 py-2.5 border-connector  text-connector hover:bg-connector`,
  terminal: `${commonStyles} px-5 py-2.5 border-terminal  text-terminal hover:bg-terminal`,
};
