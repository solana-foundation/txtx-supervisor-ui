import classNames from "../ui/class-names";
import { ActionItemRequest } from "../../types/runbook";
import { OutputRow } from "./shared/output-row";
import React from "react";

export interface DisplayInfoAction {
  text: string;
  bottomBorder?: boolean;
}
export function DisplayInfoAction({
  text,
  bottomBorder = false,
}: DisplayInfoAction) {
  return (
    <div className="overflow-auto scrollbar-thin self-stretch flex-col justify-start items-start flex">
      <div className="w-full self-stretch bg-white/opacity-0 justify-start items-start inline-flex cursor-pointer flex-wrap bg-gray-950 rounded">
        <div
          className={classNames(
            "w-full p-4 bg-black bg-opacity-0 justify-start items-start inline-flex",
            bottomBorder ? "border-b border-gray-800" : "",
          )}
        >
          <div className="grow shrink basis-0 text-sm font-normal font-inter leading-[18.20px] text-stone-500">
            {text}
          </div>
        </div>
      </div>
    </div>
  );
}
