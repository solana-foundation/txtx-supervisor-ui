import React from "react";
import { NavItem } from "./nav-item";

export interface NavGroup {
  name: string;
  children: NavItem[];
}
interface NavGroupProp {
  navGroups: NavGroup[];
}
export function Nav({ navGroups }: NavGroupProp) {
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto dark:bg-slate-950 pr-6">
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          {navGroups.map((navGroup) => (
            <li key={navGroup.name}>
              <h2 className="pt-4 pb-2 dark:text-white/80 font-bold">
                {navGroup.name}
              </h2>
              <ul role="list" className="-mx-2 space-y-1">
                {navGroup.children.map((navItem) => (
                  <NavItem key={navItem.runbookUuid} {...navItem} />
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
