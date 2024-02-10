import React from "react";

interface VersionBadgeProps {
  versions: string[];
}
export function VersionBadge({ versions }: VersionBadgeProps) {
  return (
    <span className="inline-flex items-center gap-x-0.5 text-s ml-2 inline-flex items-center rounded-sm dark:bg-slate-950 px-2 py-0.5 font-medium dark:text-slate-500 ring-1 ring-inset dark:ring-slate-500/50">
      v0.0.1
      <button type="button" className="w-4 h-4">
        <svg
          viewBox="0 0 20 20"
          className="w-4 h-4 stroke-slate-500/80 group-hover:stroke-slate-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
          />
        </svg>
        <span className="absolute -inset-1" />
      </button>
    </span>
  );
}
