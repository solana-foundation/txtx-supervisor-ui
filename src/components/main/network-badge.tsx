import React from "react";

export interface NetworkBadge {
  network: string;
}
export function NetworkBadge({ network }: NetworkBadge) {
  return (
    <span className="uppercase mb-4 inline-flex items-center rounded-md dark:bg-emerald-400/20 px-2 py-1 text-xs font-medium dark:text-emerald-400/90 ring-1 ring-inset dark:ring-emerald-400/70">
      {network} Transaction
    </span>
  );
}
