import React from "react";
import CheckMark from "../icons/check-mark";

export enum RunbookStepStatus {
  Complete,
  Active,
  Queued,
}

interface RunbookStatusBarProps {
  steps: RunbookStepStatusProps[];
}

export default function RunbookStatusBar({ steps }: RunbookStatusBarProps) {
  return (
    <div className="w-[432px] h-8 px-8 flex-col justify-start items-start gap-2.5 inline-flex">
      <div className="justify-start items-start inline-flex">
        {steps.map((step) => {
          return step.index === 0 ? (
            <div className="flex">
              <RunbookStepStatusItem {...step} />
            </div>
          ) : (
            <div className="flex">
              <RunbookStatusTrail {...step} />
              <RunbookStepStatusItem {...step} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export interface RunbookStepStatusProps {
  status: RunbookStepStatus;
  index: number;
}
function RunbookStepStatusItem({ status, index }: RunbookStepStatusProps) {
  let inner;
  switch (status) {
    case RunbookStepStatus.Complete:
      inner = (
        <div className="w-8 h-8 justify-center items-center inline-flex">
          <div className="w-8 h-8">
            <div className="w-8 h-8 bg-neutral-900 rounded-full border-2 border-emerald-300 place-content-center flex-col flex items-center">
              <CheckMark />
            </div>
          </div>
        </div>
      );
      break;
    case RunbookStepStatus.Active:
      inner = (
        <div className="w-8 h-8 justify-center items-center inline-flex">
          <div className="w-8 h-8">
            <div className="w-8 h-8 bg-neutral-900 rounded-full border-2 border-emerald-300 place-content-center flex-col flex items-center">
              <div className="w-[11px] h-[11px] bg-white rounded-full " />
            </div>
          </div>
        </div>
      );
      break;
    case RunbookStepStatus.Queued:
      const formattedNumber = (index + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
      inner = (
        <div className="w-8 h-8 relative">
          <div className="left-0 top-0 absolute" />
          <div className="w-8 h-8 left-0 top-0 absolute">
            <div className="w-8 h-8 left-0 top-0 absolute bg-neutral-900 rounded-full border-2 border-white border-opacity-5" />
            <div className="left-[7.50px] top-[7.50px] absolute text-center text-white text-opacity-5 text-[13px] font-medium font-['Inter']">
              {formattedNumber}
            </div>
          </div>
        </div>
      );
      break;
  }
  return (
    <div className="flex-col justify-start items-center gap-2.5 inline-flex">
      {inner}
    </div>
  );
}

function RunbookStatusTrail({ status }: RunbookStepStatusProps) {
  let color = "bg-emerald-300";
  if (status === RunbookStepStatus.Queued) {
    color = "bg-white bg-opacity-5";
  }
  return (
    <div className="w-20 h-8 relative">
      <div className={`w-20 h-0.5 left-0 top-[15px] absolute ${color}`} />
    </div>
  );
}
