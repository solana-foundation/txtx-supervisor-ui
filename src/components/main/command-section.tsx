import { Disclosure, Transition } from "@headlessui/react";
import React from "react";
import { classNames } from "../../utils/helpers";

export enum CommandSectionType {
  Input,
  Action,
  Output,
}

export interface CommandSection {
  type: CommandSectionType;
  panel: React.ReactNode;
}

function getTitleFromCommandSectionType(type: CommandSectionType): string {
  switch (type) {
    case CommandSectionType.Input:
      return "Input Review";
    case CommandSectionType.Action:
      return "Actions";
    case CommandSectionType.Output:
      return "Output Review";
  }
}

function getColorClassFromCommandSectionType(type: CommandSectionType): string {
  switch (type) {
    case CommandSectionType.Input:
      return "dark:text-orange-500 dark:bg-orange-500/20";
    case CommandSectionType.Action:
      return "dark:text-emerald-500 dark:bg-emerald-500/20";
    case CommandSectionType.Output:
      return "dark:text-purple-500 dark:bg-purple-500/20";
  }
}

export default function CommandSection({ type, panel }: CommandSection) {
  return (
    <Disclosure as="div" defaultOpen={false} className="mt-6 cursor-pointer">
      <Disclosure.Button
        as="h2"
        className={classNames(
          getColorClassFromCommandSectionType(type),
          " uppercase border-b dark:border-slate-500/20 text-md font-medium p-6 rounded",
        )}
      >
        {getTitleFromCommandSectionType(type)}
      </Disclosure.Button>
      <Transition
        enter="transition duration-200 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-100 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        {panel}
      </Transition>
    </Disclosure>
  );
}
