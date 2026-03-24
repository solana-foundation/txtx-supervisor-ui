import { useState } from "react";
import { LogEvent } from "../../types/runbook";
import React from "react";
import { useAppSelector } from "../../hooks";
import { selectLogs } from "../../reducers/runbooks-slice";
import classNames from "../ui/class-names";

export const RunbookLogs: React.FC = () => {
  const logs = useAppSelector(selectLogs);
  const [isOpen, setIsOpen] = useState(false);

  // for each log:
  // - get the last pending log associated with a given uuid
  // - get all success/failure logs associated with a given uuid
  // - retain the order of the logs
  // return a flattened list of all logs, in their original order, but removing
  // all but the last pending log from each uuid
  const indexesOfLastPendingLogForUuid: Record<string, number> = logs.reduce(
    (acc, log, index) => {
      const { uuid, status } = log;
      if (status === "Pending") {
        acc[uuid] = index;
      }
      return acc;
    },
    {} as Record<string, number>,
  );
  const filteredFlatLogs = logs.reduce((acc, log, i) => {
    // if the status is null, it means it's a "Static" typed log, so we want to display it
    if (
      log.status === null ||
      log.status === "Success" ||
      log.status === "Failure" ||
      (log.status === "Pending" &&
        i === indexesOfLastPendingLogForUuid[log.uuid])
    ) {
      acc.push(log);
    }
    return acc;
  }, [] as LogEvent[]);

  const rows = filteredFlatLogs?.map((status, i) => (
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

        <div className="scrollbar-thin overflow-y-auto h-[50rem]">
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

const RunbookLogEntry: React.FC<LogEvent> = ({
  status,
  message,
  summary,
  uuid,
  level,
}) => {
  const colorClass =
    status === "Pending"
      ? "text-amber-400"
      : status === "Failure"
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
        {summary}
      </span>
      <span className="text-gray-400 break-words whitespace-pre-wrap">
        {message}
      </span>
    </div>
  );
};
