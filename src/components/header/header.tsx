import React from "react";
import { selectActiveRunbook } from "../../reducers/runbooks-slice";
import { useAppSelector } from "../../hooks";
import RunbookStatusBar from "../main/runbook-status-bar";

export interface HeaderProps {
  title: string;
  panelScrollHandler: any;
}
export function Header({ title, panelScrollHandler }: HeaderProps) {
  const { metadata, commandSections } = useAppSelector(selectActiveRunbook);
  if (!metadata) {
    return <div>Loading...</div>;
  }
  return (
    <div className="backdrop-blur-md bg-opacity-50 sticky top-0 z-50 px-8 py-4 flex shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 bg-zinc-950 border-b dark:border-zinc-900">
      <div className="w-full justify-center flex flex-col items-center">
        <div className="self-stretch px-8 flex-col gap-2 flex">
          <div className="self-stretch text-emerald-500 text-center font-bold font-['Inter'] uppercase">
            {metadata.name}
          </div>
          <div className="self-stretch text-white text-sm font-normal font-['Inter'] text-center">
            {metadata.description}
          </div>

          <RunbookStatusBar
            steps={commandSections.length + 2}
            scrollHandler={panelScrollHandler}
          />
        </div>
      </div>
      <div className="py-4">
        <div className="flex">
          {/* <h1 className="font-bold text-2xl dark:text-emerald-400">{title}</h1> */}
          {/* <VersionBadge versions={versions}></VersionBadge> */}
        </div>
        {/* <span className="font-bold dark:text-slate-500">Protocol Runbook</span> */}
      </div>
    </div>
  );
}
