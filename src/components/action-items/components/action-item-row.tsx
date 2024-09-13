import React from "react";
import { classNames } from "../../../utils/helpers";
import { ActionItemRequest, errorDiagnostic } from "../../main/types";
import { CheckIcon } from "@heroicons/react/20/solid";
import { AddonErrorType, getAddonErrorMessage } from "../../../utils/addons";

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
  if (status === "Error") {
    const diag = actionStatus.data;
    checkClass = "text-rose-400";
  }

  subRow =
    !subRow && status === "Error"
      ? { text: actionStatus.data.message }
      : subRow;
  const isStatusError = status === "Error";
  const isStatusSuccess = status === "Success";
  const isHighlighted = false; // Need to implement https://tppr.me/xkN4je
  const isStateDefault = !isStatusSuccess && !isHighlighted && !isStatusError;

  return (
    <div className="w-full relative">
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
              isStatusError ? "border-rose-400" : "",
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
                isStatusError ? "text-rose-400" : "",
              )}
            >
              {description ? `${description} (${title})` : title}
            </div>
          </div>
        </div>

        {children}
      </div>

      {subRow ? (
        <ActionItemSubRow {...subRow} isError={isStatusError} />
      ) : undefined}

      {!isLast && <div className="border-b border-gray-800" />}
    </div>
  );
}
export interface ActionItemSubRow {
  text: string;
  isError?: boolean;
  children?: JSX.Element;
}
export function ActionItemSubRow({
  text,
  children,
  isError = false,
}: ActionItemSubRow) {
  let el = children ? (
    <div className="absolute bottom-4 right-4 self-stretch justify-end items-end gap-2.5 inline-flex">
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
    <pre className="mb-12">{text}</pre>
  );

  return (
    <div
      className={classNames(
        "max-h-60 overflow-auto w-full p-3 justify-start items-start inline-flex bg-black",
        children ? "min-h-20" : "",
        // todo, investigate why scrollbar styling isn't working
        "scrollbar-thin scrollbar-h-1",
      )}
    >
      <div
        className={classNames(
          "grow shrink basis-0 flex-col justify-start items-start inline-flex",
          children ? "gap-2.5" : "",
        )}
      >
        <div
          className={classNames(
            "self-stretch text-sm font-medium font-inter leading-[18.20px]",
            isError ? "text-rose-400" : "text-stone-500",
          )}
        >
          {/* weird rendering bug I can't figure out: whenever the text here is an empty string
            there's an unstyled gap. so just insert a zero-width string here
        */}
          {textEl}
        </div>
      </div>
      {el}
    </div>
  );
}

export function ErrorActionItemRow({
  error,
  originalActionItem,
  isFirst,
  isLast,
}: {
  error: string;
  originalActionItem: ActionItemRequest;
  isFirst: boolean;
  isLast: boolean;
}) {
  let errorActionItem: ActionItemRequest = {
    ...originalActionItem,
    actionStatus: {
      status: "Error",
      data: errorDiagnostic(error),
    },
  };
  return (
    <ActionItemRow
      actionItem={errorActionItem}
      isFirst={isFirst}
      isLast={isLast}
      onClick={() => {}}
    >
      <div></div>
    </ActionItemRow>
  );
}
