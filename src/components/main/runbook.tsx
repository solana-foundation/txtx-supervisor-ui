import React from "react";
import { Variable } from "./variable";
import { Output } from "./output";
import { GET_MANUAL } from "../../utils/queries";
import { useQuery } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  setManualData,
  selectActiveManual,
  CommandSectionIndex,
} from "../../reducers/runbooksSlice";
import { StacksWalletInteraction } from "./stacks/stacks-wallet-interaction";
import { Disclosure } from "@headlessui/react";
import CommandSection, { CommandSectionType } from "./command-section";

export default function Manual() {
  const dispatch = useAppDispatch();
  const { metadata, data, isDirty, commandSections } =
    useAppSelector(selectActiveManual);
  const { loading, error } = useQuery(GET_MANUAL, {
    variables: {
      manualName: metadata?.uuid,
    },
    skip: !metadata?.uuid || isDirty,
    onCompleted: (result) => {
      dispatch(setManualData(result.manual));
    },
  });

  if (loading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="px-4 sm:px-0">
        <div className={isDirty ? "w-full flex justify-center" : "hidden"}>
          <div className="text-center w-10/12 py-1 mb-10   rounded-xl dark:bg-orange-500/20 dark:text-orange-500">
            Preview Mode: Some notice to user communicating information.
          </div>
        </div>
        <h1 className="text-3xl font-medium leading-7 dark:text-emerald-400">
          {metadata.name}
        </h1>
        <p className="mt-1 max-w-2xl font-medium leading-6 dark:text-white/90">
          {metadata.description}
        </p>
      </div>
      {commandSections.map((commandSection, i) => {
        let panel = (
          <Disclosure.Panel as="div" className="ml-2">
            {...commandSectionToElements(commandSection)}
          </Disclosure.Panel>
        );

        return (
          <CommandSection
            type={commandSection.type}
            panel={panel}
            key={`${commandSection.type}-${i}-${commandSection.items.length}`}
          />
        );
      })}
    </div>
  );
}

function commandSectionToElements(commandSection: CommandSectionIndex) {
  switch (commandSection.type) {
    case CommandSectionType.Input:
      return commandSection.items.map((item) => (
        <Variable {...(item as Variable)} key={item.uuid} />
      ));
    case CommandSectionType.Output:
      return commandSection.items.map((item) => (
        <Output {...(item as Output)} key={item.uuid} />
      ));
    case CommandSectionType.Action:
      return commandSection.items.map((item) => (
        <StacksWalletInteraction
          {...(item as StacksWalletInteraction)}
          key={item.uuid}
        />
      ));
    default:
      return [];
  }
}
