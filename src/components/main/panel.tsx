import React, { MouseEventHandler } from "react";
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
}

export interface PanelProps {
  color: PanelColor;
  title: String;
  primaryButton?: PanelButton;
  secondaryButton?: PanelButton;
  content: React.JSX.Element;
  panelIndex: number;
}

export function Panel(props: PanelProps) {
  const activeStep = useAppSelector(selectActiveRunbookActiveStep);
  let stepIsActive = statusForStepNumber(props.panelIndex, activeStep);
  return stepIsActive === RunbookStepStatus.Active ? (
    <PanelActive {...props} />
  ) : stepIsActive === RunbookStepStatus.Queued ? (
    <PanelQueued {...props} />
  ) : (
    <PanelComplete {...props} />
  );
}

function PanelActive({
  color,
  title,
  primaryButton,
  secondaryButton,
  content,
  panelIndex,
}: PanelProps) {
  const dispatch = useAppDispatch();

  let primaryButtonOnClick;
  if (primaryButton !== undefined && primaryButton.onClick !== undefined) {
    primaryButtonOnClick = async (mouseEvent) => {
      // @ts-ignore (I don't know why typescript says this could be undefined)
      await primaryButton.onClick(mouseEvent);
      dispatch(setActiveRunbookActiveStep(panelIndex + 1));
    };
  } else {
    primaryButtonOnClick = () =>
      dispatch(setActiveRunbookActiveStep(panelIndex + 1));
  }

  return (
    <div className="w-full max-w-3xl flex-col justify-start items-start gap-2.5 inline-flex">
      <div
        className={classNames(
          "self-stretch px-6 py-8 rounded flex-col justify-start items-start gap-4 flex",
          color == PanelColor.Purple ? "bg-zinc-800" : "bg-stone-900",
        )}
      >
        <div className="self-stretch px-2 justify-start items-start gap-2.5 inline-flex">
          <div
            className={classNames(
              "uppercase grow shrink basis-0 text-base font-medium font-['Poppins']",
              color == PanelColor.Purple
                ? "text-purple-500"
                : "text-yellow-500",
            )}
          >
            {title}
          </div>
        </div>
        {content}
        <div className="self-stretch px-2 pt-6 justify-end items-center gap-2.5 inline-flex">
          <PrimaryPanelButton
            button={primaryButton}
            panelIndex={panelIndex}
            color={color}
          />
        </div>
      </div>
    </div>
  );
}

function PanelQueued({
  color,
  title,
  primaryButton,
  secondaryButton,
  content,
  panelIndex,
}: PanelProps) {
  return (
    <div className="w-full max-w-3xl opacity-20 flex-col justify-start items-start gap-2.5 inline-flex">
      <div
        className={classNames(
          "self-stretch px-6 py-8 rounded flex-col justify-start items-start gap-4 flex",
          color == PanelColor.Purple ? "bg-zinc-800" : "bg-stone-900",
        )}
      >
        <div className="self-stretch px-2 justify-start items-start gap-2.5 inline-flex">
          <div
            className={classNames(
              "uppercase grow shrink basis-0 text-base font-medium font-['Poppins']",
              color == PanelColor.Purple
                ? "text-purple-500"
                : "text-yellow-500",
            )}
          >
            {title}
          </div>
        </div>
        {content}
        <div className="self-stretch px-2 pt-6 justify-end items-center gap-2.5 inline-flex">
          <PrimaryPanelButton
            disabled={true}
            button={primaryButton}
            panelIndex={panelIndex}
            color={color}
          />
        </div>
      </div>
    </div>
  );
}

interface PanelButtonProps {
  button?: PanelButton;
  panelIndex: number;
  color: PanelColor;
  disabled?: boolean;
}
function PrimaryPanelButton({
  button,
  panelIndex,
  color,
  disabled = false,
}: PanelButtonProps) {
  const dispatch = useAppDispatch();
  let onClick;
  if (button !== undefined && button.onClick !== undefined) {
    onClick = async (mouseEvent) => {
      // @ts-ignore (I don't know why typescript says this could be undefined)
      await button.onClick(mouseEvent);
      dispatch(setActiveRunbookActiveStep(panelIndex + 1));
    };
  } else {
    onClick = () => dispatch(setActiveRunbookActiveStep(panelIndex + 1));
  }
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={classNames(
        "rounded-md px-3.5 py-2.5 text-sm font-semibold text-white uppercase shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        color == PanelColor.Purple
          ? "bg-purple-500 hover:bg-purple-400 focus-visible:outline-purple-500"
          : "bg-yellow-500 hover:bg-yellow-400 focus-visible:outline-yellow-500",
      )}
    >
      {button?.title || "Continue"}
    </button>
  );
}

function PanelComplete({ title }: PanelProps) {
  return (
    <div className="w-full max-w-3xl h-[88px] flex-col justify-start items-start gap-2.5 inline-flex">
      <div className="self-stretch h-[88px] px-6 py-8 bg-white bg-opacity-5 rounded flex-col justify-start items-start gap-6 flex">
        <div className="self-stretch px-2 justify-start items-start gap-2.5 inline-flex">
          <div className="uppercase grow shrink basis-0 text-slate-300 text-base font-medium font-['Poppins']">
            {title}
          </div>
        </div>
      </div>
    </div>
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
