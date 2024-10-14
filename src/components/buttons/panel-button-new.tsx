import React from "react";
import { MouseEventHandler } from "react";
import { classNames } from "../../utils/helpers";
import { ButtonColor, ElementSize, PanelButtonProps } from "./panel-button";


export function PanelButtonNew({
  title,
  isDisabled,
  onClick,
  size = ElementSize.M,
  color = ButtonColor.Emerald,
}: PanelButtonProps) {
  const colorClass = () => {
    if (isDisabled) return "opacity-30 bg-emerald-400 text-gray-950";
    if (color === ButtonColor.ActiveEmerald)
      return "bg-emerald-500 hover:bg-emerald-600 text-gray-950";
    if (color === ButtonColor.Emerald)
      return "bg-emerald-800 hover:bg-teal-950 text-emerald-500";
    if (color === ButtonColor.EmeraldSecondary)
      return "bg-emerald-550 hover:bg-emerald-500 text-black";
    if (color === ButtonColor.Black)
      return "bg-gray-700 text-zinc-400 hover:bg-black";
    return "bg-stone-850 text-amber-400 border-stone-700 border";
  };

  let sizeClass =
    size === ElementSize.XXXL
      ? "w-full md:w-96 h-24"
      : size === ElementSize.XXL
        ? "w-full md:w-80 h-20"
        : size === ElementSize.XL
          ? "w-full md:w-52 h-16"
          : size === ElementSize.L
            ? "w-full md:w-auto h-12"
            : size === ElementSize.M
              ? "w-full md:w-36 h-10"
              : "w-full md:w-36 h-8";
  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className={classNames(
        "transition duration-200 px-4 py-2 rounded flex-col justify-center items-center gap-2.5 inline-flex text-center text-xs font-normal font-gt uppercase leading-none tracking-wide",
        colorClass(),
        sizeClass,
      )}
    >
      {title}
    </button>
  );
}
