import { useState } from "react";
import { ProgressBarStatus } from "./types";
import React from "react";
import { useAppSelector } from "../../hooks";
import { selectProgressBlocks } from "../../reducers/runbooks-slice";
import { classNames } from "../../utils/helpers";

interface RunbookLogs {
  statuses: ProgressBarStatus[][];
}

export const RunbookLogs: React.FC = () => {
  const progressBlocks = useAppSelector(selectProgressBlocks);
  const [isOpen, setIsOpen] = useState(false);

  let statuses = progressBlocks
    .map((block) =>
      block.panel
        .map((status) => {
          let pendingIndex = -1;
          return status.statuses.reduce((accumulator, status) => {
            if (
              status.status.startsWith("Pending ") &&
              status.message.startsWith("Sending transaction")
            ) {
              if (pendingIndex === -1) {
                pendingIndex = accumulator.length;
                accumulator.push({
                  ...status,
                  status: "Pending",
                });
                return accumulator;
              } else {
                accumulator.splice(pendingIndex, 1);
                accumulator.push({
                  ...status,
                  status: "Pending",
                });
                pendingIndex = accumulator.length - 1;
                return accumulator;
              }
            } else {
              accumulator.push(status);
              return accumulator;
            }
          }, [] as ProgressBarStatus[]);
        })
        .flat(),
    )
    .flat();

  const rows = statuses.map((status, i) => (
    <RunbookLogEntry {...status} key={i} />
  ));

  return (
    <div className="w-[28rem] fixed bottom-0 left-0 right-4 left-auto z-50">
      <div
        className={classNames(
          "w-[28rem] min-w-md w-full bg-gray-950 shadow-xl border-t border-neutral-800 rounded-t-lg transition-all duration-300 ease-in-out overflow-hidden",
          isOpen
            ? "h-full max-h-[calc(100vh-3rem)] shadow-[0_0_20px_rgba(0,0,0,0.3)] ring-1 ring-neutral-300/30"
            : "h-12",
        )}
      >
        <button
          className="w-full h-12 flex items-center justify-between px-4 text-base text-emerald-550 font-medium font-gt uppercase hover:text-emerald-500 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>Runbook Logs</span>
          <svg
            className={classNames(
              "w-4 h-4 transform transition-transform duration-300",
              isOpen ? "rotate-180" : "",
            )}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className="scrollbar-thin overflow-y-auto h-[calc(100%-3rem)]">
          <ul className="divide-y divide-neutral-800">
            {rows.length > 0 ? (
              rows
            ) : (
              <li className="p-4 text-emerald-500">No logs available</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

const RunbookLogEntry: React.FC<ProgressBarStatus> = ({
  status,
  message,
  statusColor,
}) => {
  const colorClass =
    statusColor === "Yellow"
      ? "text-amber-400"
      : statusColor === "Red"
        ? "text-rose-400"
        : "text-emerald-400";

  return (
    <div className="flex items-start gap-2 p-2 text-sm">
      <span
        className={classNames(
          "self-center font-semibold w-[72px] shrink-0",
          colorClass,
        )}
      >
        {status}
      </span>
      <span className="text-gray-400 break-words whitespace-pre-wrap">
        {message}
      </span>
    </div>
  );
};
