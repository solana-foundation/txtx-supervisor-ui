import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks";
import { selectActiveTransientLogs } from "../../reducers/runbooks-slice";
import ProgressAnimation from "../animations/progress-animation";
import classnames from "../ui-kit/classnames";
import { LogEvent } from "./types";

export default function ProgressOutput() {
  const activeTransientLogs = useAppSelector(selectActiveTransientLogs);
  const [doScroll, setDoScroll] = useState<boolean>(true);
  const height = activeTransientLogs === undefined ? "h-0" : "h-auto";

  const isEmpty =
    activeTransientLogs === undefined || activeTransientLogs.length === 0;

  const [debouncedIsEmpty, setDebouncedIsEmpty] = useState(isEmpty);

  // debounce to avoid flickering of state changes
  useEffect(() => {
    if (!isEmpty) {
      const timeout = setTimeout(() => {
        setDebouncedIsEmpty(false);
      }, 500);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDebouncedIsEmpty(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isEmpty]);

  // reset scrolling when emptied
  useEffect(() => {
    if (debouncedIsEmpty) {
      setDoScroll(true);
    }
  }, [debouncedIsEmpty]);

  useEffect(() => {
    if (debouncedIsEmpty || !doScroll) return;

    const scrollTimer = setTimeout(() => {
      document
        .getElementById("progress-bar")
        ?.scrollIntoView({ behavior: "smooth", block: "end" });
      setDoScroll(false);
    }, 200);

    return () => clearTimeout(scrollTimer);
  }, [debouncedIsEmpty, doScroll]);

  if (debouncedIsEmpty) {
    return <div></div>;
  }

  return (
    <div
      id="progress-bar"
      className={classnames("w-full justify-center items-center", height)}
    >
      <div className="relative mx-auto w-[1024px] max-w-full min-h-full px-6 justify-center flex flex-col inline-flex gap-8">
        <ProgressAnimation />
        <ActiveTransientLogsList logs={activeTransientLogs} />
      </div>
    </div>
  );
}

interface ActiveTransientLogsList {
  logs: LogEvent[];
}
function ActiveTransientLogsList({ logs }: ActiveTransientLogsList) {
  const content = logs?.map((log) => {
    return <ActiveTransientLogLine log={log} key={log.uuid} />;
  }) || <div></div>;

  return (
    <div className="absolute w-full h-full mt-6">
      <div
        className={classnames(
          "transition-opacity ease-in-out w-[370px] bg-black bg-opacity-50 rounded-lg p-4 float-right mr-6",
          logs.length ? "opacity-100" : "opacity-0",
        )}
      >
        {content}
      </div>
    </div>
  );
}

interface ActiveTransientLogLine {
  log: LogEvent;
}
function ActiveTransientLogLine({ log }: ActiveTransientLogLine) {
  const { status, summary, message } = log;
  const color =
    status === "Pending"
      ? "text-amber-400"
      : status === "Failure"
        ? "text-rose-400"
        : "text-emerald-400";

  const isSpinning = status === "Pending";

  return (
    <div className="w-full self-stretch justify-between items-start inline-flex">
      <div className="w-4/5 self-stretch flex-col justify-between items-start inline-flex">
        <div className="max-w-full flex flex-row justify-between text-white text-xs font-gt uppercase whitespace-nowrap">
          <div
            className="max-w-full overflow-hidden text-ellipsis"
            dangerouslySetInnerHTML={{ __html: message }}
          ></div>
        </div>
      </div>
      <div className="w-1/5 self-stretch flex-col justify-between items-start inline-flex">
        <div
          className={classnames(
            "text-right text-xs font-gt uppercase flex items-center justify-end gap-1",
            color,
          )}
        >
          {summary}
          {isSpinning && <Spinner loading={isSpinning} />}
        </div>
      </div>
    </div>
  );
}

const Spinner: React.FC<{ loading: boolean }> = ({ loading }) => {
  if (loading) {
    return (
      <span className="inline-flex items-center ml-1 align-middle">
        <span className="relative flex h-2 w-2">
          {/* Gradient ring */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-800 animate-spin"></span>
          {/* Inner circle for pulsing */}
          <span className="absolute inset-[2px] rounded-full bg-black animate-pulse"></span>
        </span>
      </span>
    );
  }
};
