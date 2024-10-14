import React from "react";
import { classNames } from "../../utils/helpers";
import { ActionItemRequest, errorDiagnostic } from "../main/types";
import { CheckIcon } from "@heroicons/react/20/solid";

export interface ActionItemWrapper {
  actionItem: ActionItemRequest;
  isFirst: boolean;
  isLast: boolean;
  onClick: any;
  isCurrent: boolean;
}
export function ActionItemWrapper({
  actionItem,
  isFirst,
  isLast,
  children,
  onClick,
  isCurrent,
}: ActionItemWrapper & { children: React.ReactNode }) {
  const { index, title, description, actionStatus } = actionItem;
  const { status } = actionStatus;
  const showCheckButton = false;
  // todo: handle other statuses
  let checkClass;
  if (status === "Error") {
    const diag = actionStatus.data;
    checkClass = "text-rose-400";
  }

  const isStatusError = status === "Error";
  const isStatusSuccess = status === "Success";
  const isStateDefault = !isStatusSuccess && !isStatusError && !isCurrent;

  return (
    <div className={classNames("w-full border-b border-gray-800")}
    >
      <div
        onClick={onClick}
        className={classNames(
          "bg-gray-950 w-full self-stretch bg-white/opacity-0 justify-start items-start inline-flex cursor-pointer flex-wrap",
        )}
      >
        <div className="grow shrink basis-0 self-stretch flex-col justify-center items-start inline-flex">
          <div className="self-stretch py-1.5 md:pt-[18px] justify-start items-start inline-flex">
            <div
              className={classNames(
                "ps-5 grow shrink basis-0 text-sm font-normal font-inter leading-[18.20px]",
                isStatusSuccess ? "text-emerald-620" : "",
                isCurrent ? "text-emerald-500" : "",
                isStateDefault ? "text-stone-500" : "",
                isStatusError ? "text-rose-400" : "",
              )}
            >
              {description ? `${description} (${title})` : title}
            </div>
          </div>
            {children}
        </div>
      </div>
    </div>
  );
}
