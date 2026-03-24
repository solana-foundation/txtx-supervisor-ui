import {
  ActionItemRequest,
  InputOption,
  PickInputOptionActionItemRequest,
} from "../../../types/runbook";
import React, { useState } from "react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import PickInputPopup from "../../overlays/pick-input-popup";

export interface PickInputOptionCell {
  actionItem: ActionItemRequest;
  setSelected: any;
}
export default function PickInputOptionCell({
  actionItem,
  setSelected,
}: PickInputOptionCell) {
  const actionType = actionItem.actionType as PickInputOptionActionItemRequest;
  const { constructInstanceName, description } = actionItem;
  const { options, selected: selectedOption } = actionType.data;
  let [popupOpen, setPopupOpen] = useState(false);
  const [selected, setSelectedState] = useState(selectedOption);
  const onSubmit = (option: InputOption) => {
    setSelectedState(option);
    setSelected(option);
  };
  if (selected === undefined) {
    throw new Error(
      `selected option for PickInputOptionCell class is not a valid option. Selected: ${selectedOption}, Options: ${options}`,
    );
  }

  let closePopup = () => {
    setPopupOpen(false);
  };

  return (
    <div
      className="basis-full md:basis-0 flex items-center self-center justify-end cursor-pointer"
      onClick={() => setPopupOpen(true)}
    >
      <div className="pr-3 pb-3 pl-3 md:pt-3">
        <div className="block relative w-full rounded-md bg-neutral-800 pl-3 pr-10 text-left text-emerald-500 shadow-sm sm:text-sm sm:leading-6">
          <span className="block truncate">{selected.value}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-emerald-500"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
      <PickInputPopup
        options={options}
        currentSelection={selected}
        closePopup={closePopup}
        onSubmit={onSubmit}
        title={constructInstanceName}
        description={description}
        visible={popupOpen}
      />
    </div>
  );
}
