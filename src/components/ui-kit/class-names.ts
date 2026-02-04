import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const classNames = (...inputs: ClassValue[]): string =>
  twMerge(clsx(...inputs));

export default classNames;
