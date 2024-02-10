import React from "react";

export function ActionBar() {
  return (
    <div className="flex mt-4 py-3 justify-end ">
      <button
        type="button"
        className="rounded-md dark:bg-white/10 px-3 py-2 mx-4 text-sm font-semibold dark:text-white shadow-sm hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
      >
        Create txtx.link
      </button>
      <button
        type="button"
        className="rounded-md dark:bg-emerald-400/80 mx-2 px-3 py-2 text-sm font-semibold dark:text-white shadow-sm hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400/90"
      >
        Sign Transaction
      </button>
    </div>
  );
}
