import React from "react";

export interface HeaderProps {
  title: string;
}
export function Header({ title }: HeaderProps) {
  return (
    <div className="backdrop-blur-md bg-opacity-50 sticky top-0 z-50 flex h-20 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 bg-zinc-950 border-b dark:border-zinc-900">
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
