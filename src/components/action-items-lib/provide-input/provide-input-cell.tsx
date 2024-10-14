import debounce from "debounce";
import React from "react";
import { ActionItemRequest, DisplayableValue } from "../../main/types";
import { classNames } from "../../../utils/helpers";
import { XMarkIcon } from "@heroicons/react/20/solid";
import Pencil from "../../icons/pencil";
import { ButtonColor, ElementSize } from "../../buttons/panel-button";
import { PanelButtonNew } from "../../buttons/panel-button-new";

export interface ProvideInputCell {
  actionItem: ActionItemRequest;
  onChange: any;
  defaultValue?: DisplayableValue;
  isCurrent: boolean;
  onClick: any;
}
export function ProvideInputCell({
  actionItem,
  onChange,
  defaultValue,
  isCurrent,
  onClick,
}: ProvideInputCell) {
  const { id, actionStatus } = actionItem;
  const { status } = actionStatus;

  const isStatusError = status === "Error";
  const isStatusSuccess = status === "Success";
  const isStateDefault = !isStatusSuccess && !isStatusError && !isCurrent;

  // todo: handle other statuses
  let active = false;
  let inputClass = "bg-inputbg-400 text-inputfg-600 border-primary-400 ";

  if (isCurrent) {
    inputClass = "bg-inputbg-400 text-inputfg-400 border-primary-400 ";
  } else if (status === "Error") {
    inputClass = "bg-inputbg-400 text-inputfg-400 border-error-400 ";
  }

  const debouncedOnChange = debounce(onChange, 500);
  let defaultInputValue =
    typeof defaultValue === "boolean" ? defaultValue.toString() : defaultValue ;
  let sizeClass = 'w-full h-12'
  return (
    <div className=" w-full px-3 pb-5 pt-1 flex md:flex-row flex-col gap-y-3 items-stretch gap-x-3">
      <div className="flex-grow">
        <input
          onClick={onClick}
          id={id}
          className={classNames(
            "h-12 w-full  text-md font-normal font-gt leading-[18.20px] text-left",
            "rounded-lg",
            "focus:outline-none focus:ring-0 ring-0 focus:border-emerald-500",
            (inputClass) ? inputClass : '',
            sizeClass,
          )}
          defaultValue={defaultInputValue}
          key={defaultInputValue}
          onChange={debouncedOnChange}
        />
      </div>
      <div className="flex-none">
        <PanelButtonNew
          title={'CONFIRM'}
          onClick={onChange}
          isDisabled={!isCurrent}
          size={ElementSize.L}
          color={isCurrent ? ButtonColor.ActiveEmerald : ButtonColor.Emerald} />
      </div>
    </div>
  );
}
