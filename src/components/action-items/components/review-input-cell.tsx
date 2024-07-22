import React from "react";
import { classNames } from "../../../utils/helpers";
import { ActionItemStatus, DisplayableValue } from "../../main/types";

export interface ReviewInputCell {
  value: DisplayableValue;
  actionStatus: ActionItemStatus;
}
export function ReviewInputCell({ value, actionStatus }: ReviewInputCell) {
  const { status } = actionStatus;
  // todo: handle other statuses
  let descriptionContainerClass, descriptionClass;
  if (status === "Todo") {
    descriptionContainerClass = "bg-neutral-800";
    descriptionClass = "text-gray-400";
  } else if (status === "Success") {
    descriptionContainerClass = "bg-emerald-500";
    descriptionClass = "";
  } else if (status === "Error") {
    descriptionContainerClass = "bg-stone-900";
    descriptionClass = "text-rose-400";
  }
  // descriptionContainerClass = "text-emerald-500 bg-teal-950"; // To-do state version https://tppr.me/xkN4je

  let el =
    typeof value === "string" && value.includes("https://") ? (
      <a className="text-emerald-500" href={value} target="_blank">
        {value}
      </a>
    ) : (
      value
    );
  return (
    <div className="self-stretch flex-col justify-center items-start inline-flex basis-full md:basis-auto">
      <div className="self-stretch p-3 justify-end items-start inline-flex">
        <div
          className={classNames(
            "px-2 py-0.5 rounded-sm flex-col justify-end items-start gap-2.5 inline-flex",
            descriptionContainerClass,
          )}
        >
          <div
            className={classNames(
              "text-sm font-normal font-gt uppercase leading-[18.20px] break-all",
              descriptionClass,
            )}
          >
            {el}
          </div>
        </div>
      </div>
    </div>
  );
}
