import React from "react";
import { classNames } from "../../../utils/helpers";
import { ActionItemRequest } from "../../main/types";

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

  return (
    <div className="w-full">
      <div
        onClick={onClick}
        className={classNames(
          "w-full self-stretch bg-white/opacity-0 justify-start items-start inline-flex cursor-pointer border-gray-800",
          isFirst ? "rounded-t border-b" : isLast ? "rounded-b" : "border-b",
        )}
      >
        <div
          className={classNames(
            "w-8 self-stretch bg-gray-950 border-r border-gray-800 flex-col justify-between items-start inline-flex",
            isFirst ? "rounded-tl" : isLast ? "rounded-bl" : "",
          )}
        >
          <div className="self-stretch py-2.5 justify-center items-center inline-flex">
            <div className="text-stone-500 text-sm font-normal font-inter leading-[18.20px]">
              #
            </div>
            <div className="text-white text-sm font-normal font-inter leading-[18.20px]">
              {index + 1}
            </div>
          </div>
        </div>

        <div className="grow shrink basis-0 self-stretch bg-gray-950 border-gray-800 flex-col justify-center items-start inline-flex">
          <div className="self-stretch px-3 py-2.5 justify-start items-start inline-flex">
            <div className="grow shrink basis-0 text-gray-400 text-sm font-normal font-inter leading-[18.20px]">
              {description ? `${description} (${title})` : title}
            </div>
          </div>
        </div>

        {children}

        <div
          className={classNames(
            "w-8 self-stretch bg-gray-950 border-l border-gray-800 flex-col justify-center items-start inline-flex",
            isFirst ? "rounded-tr" : isLast ? "rounded-br" : "",
          )}
        >
          <div className="self-stretch py-2.5 justify-center items-start inline-flex">
            <div
              className={classNames(
                "text-xs font-normal font-inter leading-none",
                checkClass,
              )}
            >
              ✓
            </div>
          </div>
        </div>
      </div>
      {subRow ? <ActionItemSubRow {...subRow} /> : undefined}
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
        "overflow-auto w-full px-3 py-2.5 justify-start items-start inline-flex bg-black",
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
