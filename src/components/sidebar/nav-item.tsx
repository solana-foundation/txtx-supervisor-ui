import { Disclosure, Transition } from "@headlessui/react";
import React from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import {
  selectActiveRunbook,
  setActiveRunbook,
} from "../../reducers/runbooksSlice";

export interface NavItem {
  name: string;
  runbookUuid: string;
  children?: NavItem[];
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function NavItem({ name, children, runbookUuid }: NavItem) {
  const dispatch = useAppDispatch();
  const { metadata } = useAppSelector(selectActiveRunbook);
  const activeRunbookUuid = metadata?.uuid;
  const hasChildren = children != null;
  const childIsActive =
    hasChildren &&
    children.some((child) => child.runbookUuid == activeRunbookUuid);
  return (
    <li
      onClick={() =>
        !hasChildren ? dispatch(setActiveRunbook(runbookUuid)) : null
      }
    >
      {hasChildren ? (
        <Disclosure as="div" defaultOpen={childIsActive}>
          <Disclosure.Button
            className={classNames(
              childIsActive
                ? "dark:bg-emerald-400/20 dark:text-emerald-400"
                : "dark:text-slate-500",
              "flex items-center w-full text-left rounded p-1 pl-4 gap-x-3 text-sm leading-6 font-semibold transition-colors",
            )}
          >
            {name}
          </Disclosure.Button>{" "}
          <Transition
            enter="transition duration-200 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-100 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel as="ul" className="mt-1 px-2">
              {children?.map((navItemChild) => (
                <NavItem key={navItemChild.runbookUuid} {...navItemChild} />
              ))}
            </Disclosure.Panel>
          </Transition>
        </Disclosure>
      ) : (
        <a
          href="#"
          className={classNames(
            runbookUuid == activeRunbookUuid
              ? "border-l rounded-l-none dark:border-emerald-400 dark:text-emerald-400 "
              : "border-l rounded-l-none dark:border-slate-500/20 dark:text-slate-500",
            "block rounded-md py-1 pr-2 pl-9 text-sm leading-6 transition-colors",
          )}
        >
          {name}
        </a>
      )}
    </li>
  );
}
