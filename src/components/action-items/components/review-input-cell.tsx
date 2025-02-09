import React from "react";
import { classNames } from "../../../utils/helpers";
import { ActionItemStatus, DisplayableValue } from "../../main/types";

export interface ReviewInputCell {
  value: DisplayableValue;
  actionStatus: ActionItemStatus;
  isCurrent: boolean;
}
export function ReviewInputCell({
  value,
  actionStatus,
  isCurrent,
}: ReviewInputCell) {
  const { status } = actionStatus;

  const isStatusError = status === "Error";
  const isStatusSuccess = status === "Success";
  const isStateDefault = !isStatusSuccess && !isStatusError && !isCurrent;

  let descriptionContainerClass, descriptionClass;
  if (status === "Todo") {
    descriptionContainerClass = "bg-neutral-800";
    descriptionClass = "text-gray-400";
  } else if (status === "Success") {
    descriptionContainerClass = "bg-teal-950";
    descriptionClass = "text-emerald-500";
  } else if (status === "Error") {
    descriptionContainerClass = "bg-stone-900";
    descriptionClass = "text-rose-400";
  }
  // descriptionContainerClass = "bg-emerald-500"; // To-do state version https://tppr.me/xkN4je

  let el =
    typeof value === "string" && value.startsWith("https://") ? (
      <a className="text-emerald-500" href={value} target="_blank">
        {value}
      </a>
    ) : (
      value
    );
  return (
    <div className="self-stretch flex-col justify-center items-start inline-flex basis-full md:basis-auto">
      <div className="self-stretch pr-3 pb-3 pl-3 md:pt-3 justify-end items-start inline-flex">
        <div
          className={classNames(
            "px-2 py-0.5 rounded-sm flex-col justify-end items-start gap-2.5 inline-flex",
            isStatusSuccess ? "bg-teal-950" : "",
            isCurrent ? "bg-emerald-500" : "",
            isStatusError ? "bg-stone-900" : "",
            isStateDefault ? "bg-neutral-800" : "",
          )}
        >
          <div
            className={classNames(
              "text-sm font-normal font-gt uppercase leading-[18.20px] break-all",
              isStatusSuccess ? "text-emerald-500" : "",
              isCurrent ? "text-gray-950" : "",
              isStatusError ? "text-rose-400" : "",
              isStateDefault ? "text-gray-400" : "",
            )}
          >
            {el}
          </div>
        </div>
      </div>
    </div>
  );
}
