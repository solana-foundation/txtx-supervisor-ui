import React, { useContext } from "react";
import { ActiveRunbookContext } from "../../App";

export interface NavItemChild {
  name: string;
  runbookId: string;
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function NavItemChild({ name, runbookId }: NavItemChild) {
  const { activeRunbookId, setActiveRunbookId } =
    useContext(ActiveRunbookContext);
  return (
    <li onClick={() => setActiveRunbookId(runbookId)}>
      <a
        href="#"
        className={classNames(
          runbookId == activeRunbookId
            ? "border-l rounded-l-none dark:border-emerald-400 dark:text-emerald-400 "
            : "border-l rounded-l-none dark:border-slate-500/20 dark:text-slate-500",
          "block rounded-md py-1 pr-2 pl-9 text-sm leading-6 transition-colors",
        )}
      >
        {name}
      </a>
    </li>
  );
}
