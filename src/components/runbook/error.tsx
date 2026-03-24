import React, { forwardRef, useRef, useEffect } from "react";
import classNames from "../ui/class-names";
import { useAppSelector } from "../../hooks";
import {
  RunbookStepStatus,
  statusForStepNumber,
} from "../layout/runbook-status-bar";
import { selectRunbookActiveStep } from "../../reducers/runbook-step-slice";
import { Group } from "../action-items/shared/group";
import { ActionBlock } from "../../types/runbook";

function useFirstRender() {
  const ref = useRef(true);
  const firstRender = ref.current;
  ref.current = false;
  return firstRender;
}
export interface ErrorPanelProps {
  block: ActionBlock;
  panelIndex: number;
  isLast: boolean;
}
export const ErrorPanel = forwardRef(function Panel(
  { block, panelIndex, isLast }: ErrorPanelProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { uuid, panel } = block;
  const { title, description, groups } = panel;
  const activeStep = useAppSelector(selectRunbookActiveStep);
  const firstRender = useFirstRender();

  const status = statusForStepNumber(panelIndex, activeStep);

  const contentVisibility = "";
  // status === RunbookStepStatus.Queued ? "invisible" : "";

  const panelId =
    title.toLocaleLowerCase().split(" ").join("-") + "-" + panelIndex;

  useEffect(() => {
    if (!firstRender || !isLast) return;

    const scrollTimer = setTimeout(() => {
      document
        .getElementById(uuid)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);

    return () => clearTimeout(scrollTimer);
  }, [firstRender, isLast, uuid]);

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
