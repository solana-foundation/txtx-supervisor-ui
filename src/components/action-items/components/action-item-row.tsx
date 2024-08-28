import React from "react";
import { classNames } from "../../../utils/helpers";
import { ActionItemRequest } from "../../main/types";
import { CheckIcon } from "@heroicons/react/20/solid";

export interface ActionItemRow {
  actionItem: ActionItemRequest;
  isFirst: boolean;
  isLast: boolean;
  onClick: any;
  subRow?: ActionItemSubRow;
}
export function ActionItemRow({
  actionItem,
  isFirst,
  isLast,
  children,
  onClick,
  subRow,
}: ActionItemRow & { children }) {
  const { index, title, description, actionStatus } = actionItem;
  const { status } = actionStatus;
  // todo: handle other statuses
  let checkClass;
  if (status === "Todo") {
    checkClass = "text-white";
  } else if (status === "Success") {
    checkClass = "text-emerald-500";
  } else if (status === "Error") {
    const diag = actionStatus.data;
    checkClass = "text-rose-400";
    subRow = subRow ? subRow : { text: diag.message };
  }

  const isStatusSuccess = status === "Success";
  const isHighlighted = false; // Need to implement https://tppr.me/xkN4je
  const isStateDefault = !isStatusSuccess && !isHighlighted;

  return (
    <div className="w-full">
      <div
        onClick={onClick}
        className={classNames(
          "w-full self-stretch bg-white/opacity-0 justify-start items-start inline-flex cursor-pointer flex-wrap",
          isHighlighted ? "bg-emerald-950" : "bg-gray-950",
        )}
      >
        <div className="w-[46px] flex items-center justify-center self-stretch">
          <div
            className={classNames(
              "w-[20px] aspect-square border border-emerald-500 rounded-full flex items-center justify-center transition-colors hover:border-emerald-500",
              isStatusSuccess ? "border-emerald-500 bg-emerald-500" : "",
              isHighlighted ? "border-emerald-500" : "",
              isStateDefault ? "border-zinc-600" : "",
            )}
          >
            <CheckIcon
              className={classNames(
                "w-[16px] aspect-square transition-opacity",
                !isStatusSuccess ? "opacity-0" : "",
              )}
            />
          </div>
        </div>

        <div className="grow shrink basis-0 self-stretch flex-col justify-center items-start inline-flex">
          <div className="self-stretch py-3.5 md:py-[18px] justify-start items-start inline-flex">
            <div
              className={classNames(
                "grow shrink basis-0 text-sm font-normal font-inter leading-[18.20px]",
                isStatusSuccess ? "text-emerald-620" : "",
                isHighlighted ? "text-emerald-500" : "",
                isStateDefault ? "text-stone-500" : "",
              )}
            >
              {description ? `${description} (${title})` : title}
            </div>
          </div>
        </div>

        {children}
      </div>

      {subRow ? <ActionItemSubRow {...subRow} /> : undefined}

      {!isLast && <div className="border-b border-gray-800" />}
    </div>
  );
}
export interface ActionItemSubRow {
  text: string;
  children?: JSX.Element;
}
export function ActionItemSubRow({ text, children }: ActionItemSubRow) {
  let el = children ? (
    <div className="self-stretch justify-end items-end gap-2.5 inline-flex">
      {children}
    </div>
  ) : null;

  let textEl = !text ? (
    "N/A"
  ) : text.includes("https://") ? (
    <a className="text-emerald-500" href={text} target="_blank">
      {text}
    </a>
  ) : (
    text
  );
  return (
    <div
      className={classNames(
        "overflow-auto w-full p-3 justify-start items-start inline-flex bg-black",
        children ? "min-h-20" : "",
        // todo, investigate why scrollbar styling isn't working
        // "scrollbar-thin scrollbar-h-1",
      )}
    >
      <div
        className={classNames(
          "grow shrink basis-0 flex-col justify-start items-start inline-flex",
          children ? "gap-2.5" : "",
        )}
      >
        <div className="self-stretch text-stone-500 text-sm font-medium font-inter leading-[18.20px]">
          {/* weird rendering bug I can't figure out: whenever the text here is an empty string
            there's an unstyled gap. so just insert a zero-width string here
        */}
          {textEl}
        </div>
        {el}
      </div>
    </div>
  );
}
