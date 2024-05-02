import React, { MouseEventHandler, forwardRef } from "react";
import { classNames } from "../../utils/helpers";
import {
  selectActiveRunbookActiveStep,
  setActiveRunbookActiveStep,
} from "../../reducers/runbooks-slice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RunbookStepStatus, statusForStepNumber } from "./runbook-status-bar";

export enum PanelColor {
  Purple,
  Yellow,
  Green,
}

export interface PanelButton {
  title: string;
  onClick?: (e: MouseEventHandler<HTMLButtonElement>) => Promise<void>;
  disabled?: boolean;
}

export interface PanelProps {
  color: PanelColor;
  title: String;
  primaryButton?: PanelButton;
  secondaryButton?: PanelButton;
  content: React.JSX.Element;
  panelIndex: number;
  scrollHandler: any;
}

export const Panel = forwardRef(function Panel(
  {
    color,
    title,
    primaryButton,
    secondaryButton,
    content,
    panelIndex,
    scrollHandler,
  }: PanelProps,
  ref: React.ForwardedRef<any>,
) {
  const dispatch = useAppDispatch();
  const activeStep = useAppSelector(selectActiveRunbookActiveStep);

  let status = statusForStepNumber(panelIndex, activeStep);

  const statusIsComplete = status === RunbookStepStatus.Complete;
  const panelColor = statusIsComplete
    ? "bg-white"
    : color === PanelColor.Purple
      ? "bg-zinc-800"
      : "bg-stone-900";
  const opacity = statusIsComplete
    ? "opacity-5"
    : status === RunbookStepStatus.Active
      ? "opacity-100"
      : "opacity-20";
  // the completed div is white with opacity set.
  // if we transition to/from white before the opacity, it's pretty jarring,
  // so delay the transitions accordingly:
  // in a complete -> incomplete transition, delay the color change
  // in a incomplete -> complete transition, delay the opacity
  const mainTiming = statusIsComplete ? "delay-0" : "delay-100";
  const colorTiming = statusIsComplete ? "delay-100" : "delay-0";

  const contentVisibility = statusIsComplete ? "invisible" : "";
  const height = statusIsComplete ? "max-h-[88px]" : "max-h-[10000px]";
  const cursor = statusIsComplete ? "cursor-pointer" : "";
  // if a panel is closed/complete, allow clicking on it to re-expand
  const panelOnClick = statusIsComplete
    ? () => {
        scrollHandler(panelIndex);
        dispatch(setActiveRunbookActiveStep(panelIndex));
      }
    : () => {};

  return (
    <div
      onClick={panelOnClick}
      className={classNames(
        "transition-all duration-150 w-full max-w-3xl flex-col justify-start items-start gap-2.5 inline-flex",
        opacity,
        height,
        mainTiming,
        cursor,
      )}
    >
      <div
        className={classNames(
          "transition-colors duration-150 self-stretch px-6 py-8 rounded flex-col justify-start items-start gap-4 flex",
          panelColor,
          height,
          colorTiming,
        )}
      >
        <div className="self-stretch justify-start items-start gap-2.5 inline-flex">
          <div
            className={classNames(
              "scroll-mt-32 uppercase grow shrink basis-0 text-base font-medium font-['Inter']",
              color == PanelColor.Purple
                ? "text-purple-500"
                : "text-yellow-500",
            )}
            ref={ref}
          >
            {title}
          </div>
        </div>
        <div
          className={classNames(
            "self-stretch flex-col justify-start items-start gap-4 flex w-full h-full",
            contentVisibility,
          )}
        >
          {content}
          <div className="self-stretch px-2 pt-6 justify-end items-center gap-2.5 inline-flex">
            <PrimaryPanelButton
              button={primaryButton}
              panelIndex={panelIndex}
              color={color}
              scrollHandler={scrollHandler}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
interface PanelButtonProps {
  button?: PanelButton;
  panelIndex: number;
  color: PanelColor;
  disabled?: boolean;
  scrollHandler: any;
}
function PrimaryPanelButton({
  button,
  panelIndex,
  color,
  disabled = false,
  scrollHandler,
}: PanelButtonProps) {
  const dispatch = useAppDispatch();
  let onClick;
  if (button !== undefined && button.onClick !== undefined) {
    onClick = async (mouseEvent) => {
      console.log(scrollHandler);
      // @ts-ignore (I don't know why typescript says this could be undefined)
      await button.onClick(mouseEvent);
      scrollHandler(panelIndex + 1);
      dispatch(setActiveRunbookActiveStep(panelIndex + 1));
    };
  } else {
    onClick = () => {
      console.log(scrollHandler);
      scrollHandler(panelIndex + 1);
      dispatch(setActiveRunbookActiveStep(panelIndex + 1));
    };
  }
  const isDisabled = disabled || button?.disabled;
  let colorClass = isDisabled
    ? "bg-white bg-opacity-20 hover:bg-opacity-10"
    : color == PanelColor.Purple
      ? "bg-purple-500 hover:bg-purple-400 focus-visible:outline-purple-500"
      : "bg-yellow-500 hover:bg-yellow-400 focus-visible:outline-yellow-500";
  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className={classNames(
        "rounded-md px-3.5 py-2.5 text-sm font-semibold text-white uppercase shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        colorClass,
      )}
    >
      {button?.title || "Continue"}
    </button>
  );
}

export interface PanelContentProps {
  children: React.JSX.Element[];
}
export function PanelContent({ children }: PanelContentProps) {
  return (
    <div className="self-stretch flex-col justify-start flex">
      <div className="flex-col justify-start gap-6 flex">
        {children.map((child, i) => (
          <div
            key={`panel-child-${i}`}
            className="flex-col justify-start items-start gap-2 flex"
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
