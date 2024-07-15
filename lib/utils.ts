import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const transformTime = (time: number) => {
  time /= 1000;
  if (time < 60) {
    // return `${Math.floor(time)}s`;
    return `Just now`;
  } else if (time < 60 * 60) {
    return `${Math.floor(time / 60)}m`;
  } else if (time < 60 * 60 * 24) {
    return `${Math.floor(time / 60 / 60)}h`;
  } else if (time < 60 * 60 * 24 * 7) {
    return `${Math.floor(time / 60 / 60 / 24)}d`;
  } else {
    return `${Math.floor(time / 60 / 60 / 24 / 7)}w`;
  }
};
