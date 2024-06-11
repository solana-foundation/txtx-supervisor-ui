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
          "transition-opacity ease-in-out w-[434px] bg-black bg-opacity-50 rounded-lg p-4 float-right mr-6",
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
  const { status: statusStr, message } = status;
  const color =
    statusStr === "Pending"
      ? "text-amber-400"
      : statusStr === "Failed"
        ? "text-rose-400"
        : "text-emerald-400";

  const msg = truncateMessage(message);

  return (
    <div className="w-full self-stretch justify-between items-start inline-flex">
      <div className="self-stretch flex-col justify-between items-start inline-flex">
        <a
          className="text-white text-xs font-gt uppercase"
          target="_blank"
          href={`https://explorer.hiro.so/txid/${message}?chain=testnet`}
        >
          transaction {msg} /
        </a>
      </div>
      <div className="self-stretch flex-col justify-between items-start inline-flex">
        <div
          className={classNames("text-right text-xs font-gt uppercase", color)}
        >
          {statusStr}
        </div>
      </div>
    </div>
  );
}

function truncateMessage(msg: string) {
  if (msg.length <= 30) return msg;
  return `${msg.substring(0, 30 - 7)}...${msg.substring(
    msg.length - 5,
    msg.length - 1,
  )}`;
}
