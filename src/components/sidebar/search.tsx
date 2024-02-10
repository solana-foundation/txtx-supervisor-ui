import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import React from "react";

export function Search() {
  return (
    <div>
      <label
        htmlFor="search"
        className="block text-sm font-medium leading-6 dark:text-slate-500"
      ></label>
      <div className="mt-2 flex rounded-md shadow-sm">
        <div className="relative flex flex-grow items-stretch">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon
              className="h-5 w-5 dark:text-slate-500/50"
              aria-hidden="true"
            />
          </div>
          <input
            type="search"
            name="search"
            id="search"
            className="block w-full rounded border-0 py-1.5 pl-10 dark:bg-slate-950 ring-1 ring-inset dark:ring-slate-500/20 sm:text-sm sm:leading-6 focus:ring-slate-500/50 dark:text-slate-500 autofill:shadow-[inset_0_0_0px_1000px_rgb(9,14,17)] dark:placeholder:text-slate-500/50 search-cancel:hidden"
            placeholder="SEARCH"
          />
          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <kbd className="inline-flex items-center rounded border px-1 font-sans text-xs dark:border-slate-500/30 dark:text-slate-500/50">
              {navigator.userAgent.toUpperCase().indexOf("MAC") >= 0
                ? "⌘ "
                : "^ "}
              K
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
