import React, { useState } from "react";
import { ActionItemRequest, DisplayableValue } from "../../main/types";
import classNames from "../../ui-kit/class-names";
import Pencil from "../../icons/pencil";
import UpdateInputPopup from "../../popup/update-input-popup";

export interface ProvideInputCell {
  actionItem: ActionItemRequest;
  onChange: (value: string | number | object) => void;
  defaultValue?: DisplayableValue;
  isCurrent: boolean;
}
export function ProvideInputCell({
  actionItem,
  onChange,
  defaultValue,
  isCurrent,
}: ProvideInputCell) {
  let [popupOpen, setPopupOpen] = useState(false);
  let [defaultInputValue, setDefaultInputValue] = useState(
    typeof defaultValue === "boolean" ? defaultValue.toString() : defaultValue,
  );
  const { id, actionStatus, constructInstanceName, description } = actionItem;
  const { status } = actionStatus;
  const isStatusError = status === "Error";
  const isStatusSuccess = status === "Success";
  const isStateDefault = !isStatusSuccess && !isStatusError && !isCurrent;

  // todo: handle other statuses
  let inputClass = "";
  if (status === "Todo") {
    inputClass = "bg-neutral-800 text-gray-400";
  } else if (status === "Success") {
    inputClass = "bg-neutral-800 text-emerald-500";
  } else if (status === "Error") {
    inputClass = "bg-stone-900 text-rose-400";
  }

  let onPencilClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setPopupOpen(true);
  };
  let closePopup = () => {
    setPopupOpen(false);
  };

  let confirmAction = (value: string | number | object) => {
    setDefaultInputValue(value);
    onChange(value);
    setPopupOpen(false);
  };

  return (
    <div className="grow shrink self-stretch flex-col justify-center items-start inline-flex basis-full md:basis-0">
      <div className="self-stretch pr-3 pb-3 pl-3 md:pt-3 justify-end items-start inline-flex">
        <div className="grow flex">
          <input
            id={id}
            className={classNames(
              "grow text-sm font-normal font-gt leading-[18.20px] text-right",
              " rounded-l-sm",
              isStatusSuccess ? "bg-neutral-800 text-emerald-500" : "",
              isCurrent
                ? "bg-neutral-800 text-emerald-500 border-emerald-500/50"
                : "border-gray-800",
              isStatusError ? "bg-stone-900 text-rose-400" : "",
              isStateDefault ? "bg-neutral-800 text-gray-400" : "",
            )}
            defaultValue={defaultInputValue}
            key={defaultInputValue}
            disabled={true}
          />
          <div
            className={classNames(
              "w-[32px] bg-neutral-800 flex items-center justify-center rounded-r-sm  border border-l-0",
              isCurrent ? "border-emerald-500/50" : "border-gray-800",
            )}
            onClick={onPencilClick}
          >
            <Pencil
              className={classNames(
                isStatusSuccess ? "bg-neutral-800 text-emerald-500" : "",
                isCurrent
                  ? "bg-neutral-800 text-emerald-500"
                  : "border-gray-800",
                isStatusError ? "bg-stone-900 text-rose-400" : "",
                isStateDefault ? "bg-neutral-800 text-gray-400" : "",
              )}
            />
          </div>
        </div>
      </div>

      <UpdateInputPopup
        actionStatus={actionStatus}
        defaultInputValue={defaultInputValue}
        confirmAction={confirmAction}
        closePopup={closePopup}
        title={constructInstanceName}
        description={description}
        visible={popupOpen}
      />
    </div>
  );
}
