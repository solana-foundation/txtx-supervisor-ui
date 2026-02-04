import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const classnames = (...inputs: ClassValue[]): string => twMerge(clsx(...inputs));

export default classnames;
