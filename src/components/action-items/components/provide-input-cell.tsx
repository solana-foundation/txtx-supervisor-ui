import debounce from "debounce";
import React from "react";
import { ActionItemRequest, DisplayableValue } from "../../main/types";
import { classNames } from "../../../utils/helpers";
import { XMarkIcon } from "@heroicons/react/20/solid";
import Pencil from "../../icons/pencil";

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
  const { id, actionStatus } = actionItem;
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
    <div className="grow shrink self-stretch flex-col justify-center items-start inline-flex basis-full md:basis-0">
      <div className="self-stretch p-2.5 justify-end items-start inline-flex">
        <div className="grow flex">
          <input
            id={id}
            className={classNames(
              "grow text-sm font-normal font-gt leading-[18.20px] text-right",
              "border-gray-800 rounded-l-sm",
              "focus:outline-none focus:ring-0 ring-0 focus:border-emerald-500",
              inputClass,
            )}
            defaultValue={defaultInputValue}
            key={defaultInputValue}
            onChange={debouncedOnChange}
          />
          <div className="w-[32px] bg-neutral-800 flex items-center justify-center rounded-r-sm border-gray-800 border border-l-0">
            <Pencil
              className={
                status === "Success" ? "text-emerald-500" : "text-gray-400"
              }
            />
          </div>
        </div>
      </div>

      {/* Item edition https://tppr.me/CgrAR5 */}
      {/* <div className="relative w-[320px] border border-zinc-700 bg-zinc-200 text-gray-400 rounded-[16px] text-center p-6">
        <div className="text-emerald-500 text-base font-normal font-gt uppercase mb-2">
          Update input
        </div>
        <div className={"text-sm text-gray-400 px-6 leading-[17px]"}>
          Stx to burn when preordering the BNS name
        </div>
        <input
          className={classNames(
            "grow text-sm font-normal font-gt leading-[18.20px] my-[20px] w-full",
            "border-gray-800 rounded-sm",
            "focus:outline-none focus:ring-0 ring-0 focus:border-emerald-500",
            inputClass,
          )}
        />
        <button className="transition duration-200 px-4 py-2 rounded flex-col justify-center items-center gap-2.5 inline-flex text-center text-xs font-normal font-gt uppercase leading-none tracking-wide h-[42px] w-full bg-emerald-550 text-black hover:bg-emerald-500">
          Confirm
        </button>
        <XMarkIcon className="absolute top-[10px] right-[10px] w-[20px]" />
      </div> */}
    </div>
  );
}
