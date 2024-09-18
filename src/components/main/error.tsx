import React, { forwardRef, useRef } from "react";
import { classNames } from "../../utils/helpers";
import { useAppSelector } from "../../hooks";
import {
  RunbookStepStatus,
  statusForStepNumber,
} from "../header/runbook-status-bar";
import { selectRunbookActiveStep } from "../../reducers/runbook-step-slice";
import { Group } from "../action-items/components/group";
import { ActionBlock } from "./types";

function useFirstRender() {
  const ref = useRef(true);
  const firstRender = ref.current;
  ref.current = false;
  return firstRender;
}
export interface ErrorPanelProps {
  block: ActionBlock;
  panelIndex: number;
  scrollHandler: any;
  isLast: boolean;
}
export const ErrorPanel = forwardRef(function Panel(
  { block, panelIndex, scrollHandler, isLast }: ErrorPanelProps,
  ref: React.ForwardedRef<any>,
) {
  const { uuid, visible, panel } = block;
  const { title, description, groups } = panel;
  const activeStep = useAppSelector(selectRunbookActiveStep);
  const firstRender = useFirstRender();

  let status = statusForStepNumber(panelIndex, activeStep);

  const contentVisibility = "";
  // status === RunbookStepStatus.Queued ? "invisible" : "";
  const buttonsDisabled = status === RunbookStepStatus.Complete;

  const panelId =
    title.toLocaleLowerCase().split(" ").join("-") + "-" + panelIndex;

  if (firstRender && isLast) {
    setTimeout(() => {
      document
        .getElementById(uuid)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  }

  return (
    <div
      className={classNames(
        "w-full p-6 bg-stone-900 rounded-lg shadow border border-stone-800 flex-col justify-center items-start gap-2.5 inline-flex",
        contentVisibility,
      )}
      id={uuid}
    >
      <div className="self-stretch justify-start items-start inline-flex">
        <div
          className="scroll-mt-44 grow shrink basis-0 text-rose-400 text-base font-normal font-gt uppercase"
          ref={ref}
          id={panelId}
        >
          {title}
        </div>
      </div>
      <div className="w-full h-[19px] text-gray-400 text-sm font-normal font-inter">
        {description}
      </div>
      {groups.map((group, i) => (
        <Group group={group} key={i} />
      ))}
    </div>
  );
});
