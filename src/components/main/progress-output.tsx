import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks";
import { selectVisibleProgressBlock } from "../../reducers/runbooks-slice";
import ProgressAnimation from "../animations/progress-animation";
import { classNames } from "../../utils/helpers";
import { ProgressBarStatus } from "./types";

export default function ProgressOutput() {
  const progressBlock = useAppSelector(selectVisibleProgressBlock);
  const [statuses, setStatuses] = useState<ProgressBarStatus[][]>([]);
  const [doScroll, setDoScroll] = useState<boolean>(true);
  const height = progressBlock === undefined ? "h-0" : "h-auto";

  useEffect(() => {
    if (progressBlock === undefined) {
      setDoScroll(true);
      setStatuses([]);
    } else {
      setStatuses(
        progressBlock.panel.map(
          (statusesForConstruct) => statusesForConstruct.statuses,
        ),
      );
    }
  }, [progressBlock]);

  if (progressBlock === undefined) {
    return <div></div>;
  }
  setTimeout(() => {
    if (doScroll) {
      document
        .getElementById("progress-bar")
        ?.scrollIntoView({ behavior: "smooth", block: "end" });
      setDoScroll(false);
    }
  }, 200);
  return (
    <div
      id="progress-bar"
      className={classNames("w-full justify-center items-center", height)}
    >
      <div className="relative mx-auto w-[1024px] max-w-full min-h-full px-6 justify-center flex flex-col inline-flex gap-8">
        <ProgressAnimation />
        <StatusUpdates statuses={statuses} />
      </div>
    </div>
  );
}

interface StatusUpdates {
  statuses: ProgressBarStatus[][];
}
function StatusUpdates({ statuses }: StatusUpdates) {
  const content = statuses?.map((statusesForConstruct, i) => {
    const idx = statusesForConstruct.length - 1;
    const status = statusesForConstruct[idx];
    return <StatusUpdate status={status} key={i} />;
  }) || <div></div>;

  return (
    <div className="absolute w-full h-full mt-6">
      <div
        className={classNames(
          "transition-opacity ease-in-out w-[370px] bg-black bg-opacity-50 rounded-lg p-4 float-right mr-6",
          statuses.length ? "opacity-100" : "opacity-0",
        )}
      >
        {content}
      </div>
    </div>
  );
}

interface StatusUpdate {
  status: ProgressBarStatus;
}
function StatusUpdate({ status }: StatusUpdate) {
  const { status: statusStr, message, statusColor } = status;
  const color =
    statusColor === "Yellow"
      ? "text-amber-400"
      : statusColor === "Red"
        ? "text-rose-400"
        : "text-emerald-400";

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
          className={classNames("text-right text-xs font-gt uppercase", color)}
        >
          {statusStr}
        </div>
      </div>
    </div>
  );
}

