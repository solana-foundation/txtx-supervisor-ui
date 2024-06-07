import debounce from "debounce";
import React from "react";
import { ActionItemRequest, DisplayableValue } from "../../main/types";
import { classNames } from "../../../utils/helpers";

export interface ProvideInputCell {
  actionItem: ActionItemRequest;
  onChange: any;
  defaultValue?: DisplayableValue;
}
export function ProvideInputCell({
  actionItem,
  onChange,
  defaultValue,
}: ProvideInputCell) {
  const { uuid, actionStatus } = actionItem;
  const { status } = actionStatus;

  // todo: handle other statuses
  let inputClass;
  if (status === "Todo") {
    inputClass = "bg-neutral-800 text-gray-400";
  } else if (status === "Success") {
    inputClass = "bg-neutral-800 text-emerald-500";
  } else if (status === "Error") {
    inputClass = "bg-stone-900 text-rose-400";
  }

  const debouncedOnChange = debounce(onChange, 500);
  let defaultInputValue =
    typeof defaultValue === "boolean" ? defaultValue.toString() : defaultValue;
  return (
    <div className="grow shrink basis-0 self-stretch bg-gray-950 flex-col justify-center items-start inline-flex">
      <div className="self-stretch px-2 py-2.5 justify-end items-start inline-flex">
        <div className="grow shrink basis-0 self-stretch flex-col justify-end items-start gap-2.5 inline-flex">
          <input
            id={uuid}
            className={classNames(
              "self-stretch text-sm font-normal font-gt leading-[18.20px] text-right",
              "border-gray-800  rounded-sm",
              "focus:outline-none focus:ring-0 ring-0 focus:border-emerald-500",
              inputClass,
            )}
            defaultValue={defaultInputValue}
            onChange={debouncedOnChange}
          />
        </div>
      </div>
    </div>
  );
}
