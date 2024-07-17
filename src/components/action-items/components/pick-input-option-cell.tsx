import {
  ActionItemRequest,
  PickInputOptionActionItemRequest,
} from "../../main/types";
import React, { useState } from "react";
import { classNames } from "../../../utils/helpers";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

export interface PickInputOptionCell {
  actionItem: ActionItemRequest;
  setSelected: any;
}
export default function PickInputOptionCell({
  actionItem,
  setSelected,
}: PickInputOptionCell) {
  const actionType = actionItem.actionType as PickInputOptionActionItemRequest;
  const { options, selected: selectedOption } = actionType.data;
  const [selected, setSelectedState] = useState(selectedOption);
  const onChange = (option: any) => {
    setSelectedState(option);
    setSelected(option);
  };
  if (selected === undefined) {
    throw new Error(
      `selected option for PickInputOptionCell class is not a valid option. Selected: ${selectedOption}, Options: ${options}`,
    );
  }
  return (
    <Listbox value={selected.value} onChange={onChange}>
      {({ open }) => (
        <>
          <div className="self-stretch flex-col justify-center items-start inline-flex">
            <div className="px-2 py-2.5 ">
              <ListboxButton className="block relative w-full cursor-default rounded-md bg-neutral-800 pl-3 pr-10 text-left text-emerald-500 shadow-sm sm:text-sm sm:leading-6">
                <span className="block truncate">{selected.value}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-emerald-500"
                    aria-hidden="true"
                  />
                </span>
              </ListboxButton>

              <Transition
                show={open}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ListboxOptions className="absolute z-10 mt-1 max-h-60 overflow-auto rounded-md bg-neutral-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {options.map((options) => (
                    <ListboxOption
                      key={options.value}
                      className={({ focus }) =>
                        classNames(
                          focus ? "text-emerald-500/80" : "",
                          !focus ? "text-emerald-500" : "",
                          "relative cursor-default select-none py-2 pl-3 pr-9",
                        )
                      }
                      value={options}
                    >
                      {({ selected, focus }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "block truncate",
                            )}
                          >
                            {options.displayedValue}
                          </span>

                          {selected ? (
                            <span
                              className={classNames(
                                focus
                                  ? "text-emerald-500/80"
                                  : "text-emerald-500",
                                "absolute inset-y-0 right-0 flex items-center pr-4",
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Transition>
            </div>{" "}
          </div>
        </>
      )}
    </Listbox>
  );
}
