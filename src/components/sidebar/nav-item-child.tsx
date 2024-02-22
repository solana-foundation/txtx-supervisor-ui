import React, { useContext } from "react";
import { ActiveManualContext } from "../../App";

export interface NavItemChild {
  name: string;
  manualId: string;
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function NavItemChild({ name, manualId }: NavItemChild) {
  const { activeManualId, setActiveManualId } = useContext(ActiveManualContext);
  return (
    <li onClick={() => setActiveManualId(manualId)}>
      <a
        href="#"
        className={classNames(
          manualId == activeManualId
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
