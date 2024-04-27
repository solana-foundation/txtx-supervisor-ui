import React from "react";
import CheckMark from "../icons/check-mark";
import {
  selectActiveRunbookActiveStep,
  setActiveRunbookActiveStep,
} from "../../reducers/runbooks-slice";
import { useAppDispatch, useAppSelector } from "../../hooks";

export enum RunbookStepStatus {
  Complete,
  Active,
  Queued,
}

export interface RunbookStepStatusProps {
  status: RunbookStepStatus;
  index: number;
}
interface RunbookStatusBarProps {
  steps: number;
  scrollHandler: any;
}
export function statusForStepNumber(
  stepNumber: number,
  activeStepNumber: number,
) {
  if (stepNumber < activeStepNumber) {
    return RunbookStepStatus.Complete;
  } else if (stepNumber === activeStepNumber) {
    return RunbookStepStatus.Active;
  } else {
    return RunbookStepStatus.Queued;
  }
}
export default function RunbookStatusBar({
  steps,
  scrollHandler,
}: RunbookStatusBarProps) {
  const activeStep = useAppSelector(selectActiveRunbookActiveStep);
  return (
    <div className="w-full h-8 px-8 flex-col justify-start items-start gap-2.5 inline-flex">
      <div className="justify-start items-start inline-flex">
        {
          // create an array with 0 to steps elements
          Array.from(Array(steps).keys()).map((stepNumber) => {
            let status = statusForStepNumber(stepNumber, activeStep);
            return stepNumber === 0 ? (
              <div
                className="flex"
                key={`runbook-step-status-item-${stepNumber}`}
              >
                <RunbookStepStatusItem
                  index={stepNumber}
                  status={status}
                  scrollHandler={scrollHandler}
                />
              </div>
            ) : (
              <div
                className="flex"
                key={`runbook-step-status-item-${stepNumber}`}
              >
                <RunbookStatusTrail index={stepNumber} status={status} />
                <RunbookStepStatusItem
                  index={stepNumber}
                  status={status}
                  scrollHandler={scrollHandler}
                />
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

function RunbookStepStatusItem({
  status,
  index,
  scrollHandler,
}: RunbookStepStatusProps & { scrollHandler: any }) {
  const dispatch = useAppDispatch();
  const onClick = () => {
    dispatch(setActiveRunbookActiveStep(index));
    scrollHandler(index);
  };
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
    <div
      onClick={onClick}
      className="flex-col justify-start items-center gap-2.5 inline-flex cursor-pointer"
    >
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
