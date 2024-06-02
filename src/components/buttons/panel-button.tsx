import React from "react";
import { MouseEventHandler } from "react";
import { classNames } from "../../utils/helpers";

export enum ButtonColor {
  Emerald,
  Amber,
  Gray,
}
export enum ElementSize {
  S,
  M,
  L,
  XL,
  XXL,
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
      ? "bg-teal-950 text-emerald-500"
      : color === ButtonColor.Gray
        ? "bg-gray-700 text-zinc-400"
        : "bg-stone-850 text-amber-400 border-stone-700 border";

  let sizeClass =
    size === ElementSize.XXL
      ? "w-80 h-20"
      : size === ElementSize.XL
        ? "w-52 h-16"
        : size === ElementSize.L
          ? "w-40 h-12"
          : size === ElementSize.M
            ? "w-36 h-10"
            : "w-28 h-8";
  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className={classNames(
        "px-4 py-2 rounded flex-col justify-center items-center gap-2.5 inline-flex text-center text-xs font-normal font-['GT America Mono'] uppercase leading-none tracking-tight",
        colorClass,
        sizeClass,
      )}
    >
      {title}
    </button>
  );
}
