import debounce from "debounce";
import React from "react";
import { ActionItemRequest, DisplayableValue } from "../../main/types";
import { classNames } from "../../../utils/helpers";
import { XMarkIcon } from "@heroicons/react/20/solid";

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
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={
                status === "Success" ? "text-emerald-500" : "text-gray-400"
              }
            >
              <path
                d="M10.5332 2.71012L9.29035 1.46723C9.06215 1.239 8.69002 1.23885 8.46201 1.46688L2.125 7.80389L4.19658 9.87549L10.5336 3.53848C10.7616 3.31045 10.7615 2.93834 10.5332 2.71012Z"
                stroke="currentColor"
                stroke-miterlimit="22.926"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M1.29688 10.7041L2.12553 7.80387L4.19711 9.87545L1.29688 10.7041Z"
                stroke="currentColor"
                stroke-miterlimit="22.926"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9.70441 4.36743L7.63281 2.29583"
                stroke="currentColor"
                stroke-miterlimit="22.926"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
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
        <button className="transition duration-200 px-4 py-2 rounded flex-col justify-center items-center gap-2.5 inline-flex text-center text-xs font-normal font-gt uppercase leading-none tracking-wide h-[42px] w-full bg-[#04B179] text-black hover:bg-emerald-500">
          Confirm
        </button>
        <XMarkIcon className="absolute top-[10px] right-[10px] w-[20px]" />
      </div> */}
    </div>
  );
}
