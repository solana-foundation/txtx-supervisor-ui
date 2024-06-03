import React from "react";
import { classNames } from "../../../utils/helpers";
import { ActionItemStatus } from "../../main/types";

export interface ReviewInputCell {
  description: string;
  actionStatus: ActionItemStatus;
}
export function ReviewInputCell({
  description,
  actionStatus,
}: ReviewInputCell) {
  const { status } = actionStatus;
  // todo: handle other statuses
  let descriptionContainerClass, descriptionClass;
  if (status === "Todo") {
    descriptionContainerClass = "bg-neutral-800";
    descriptionClass = "text-gray-400";
  } else if (status === "Success") {
    descriptionContainerClass = "bg-neutral-800";
    descriptionClass = "text-emerald-500";
  } else if (status === "Error") {
    descriptionContainerClass = "bg-stone-900";
    descriptionClass = "text-rose-400";
  }

  return (
    <div className="self-stretch bg-gray-950 flex-col justify-center items-start inline-flex">
      <div className="self-stretch px-2 py-2.5 justify-end items-start inline-flex">
        <div
          className={classNames(
            "px-2 py-0.5 rounded-sm flex-col justify-end items-start gap-2.5 inline-flex",
            descriptionContainerClass,
          )}
        >
          <div
            className={classNames(
              "text-sm font-normal font-gt uppercase leading-[18.20px]",
              descriptionClass,
            )}
          >
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}
