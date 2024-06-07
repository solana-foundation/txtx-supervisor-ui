import React from "react";
import { MouseEventHandler } from "react";
import { classNames } from "../../utils/helpers";

export enum ButtonColor {
  Emerald,
  Amber,
  Black,
}
export enum ElementSize {
  S,
  M,
  L,
  XL,
  XXL,
  XXXL,
}
export interface PanelButtonProps {
  title: String;
  isDisabled: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  size?: ElementSize;
  color?: ButtonColor;
}

export function PanelButton({
  title,
  isDisabled,
  onClick,
  size = ElementSize.M,
  color = ButtonColor.Emerald,
}: PanelButtonProps) {
  let colorClass = isDisabled
    ? "opacity-30 bg-black text-zinc-400"
    : color === ButtonColor.Emerald
      ? "bg-teal-950 hover:border-emerald-950 hover:bg-emerald-800 text-emerald-500"
      : color === ButtonColor.Black
        ? "bg-gray-700 text-zinc-400 hover:bg-black "
        : "bg-stone-850 text-amber-400 border-stone-700 border";
  let sizeClass =
    size === ElementSize.XXXL
      ? "w-96 h-24"
      : size === ElementSize.XXL
        ? "w-80 h-20"
        : size === ElementSize.XL
          ? "w-52 h-16"
          : size === ElementSize.L
            ? "w-40 h-12"
            : size === ElementSize.M
              ? "w-36 h-10"
              : "w-36 h-8";
  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className={classNames(
        "transition duration-200 px-4 py-2 rounded flex-col justify-center items-center gap-2.5 inline-flex text-center text-xs font-normal font-gt uppercase leading-none tracking-tight",
        colorClass,
        sizeClass,
      )}
    >
      {title}
    </button>
  );
}
