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
    <div className="w-[1024px] h-[399px] p-6 bg-zinc-900 rounded-lg shadow border border-neutral-800 flex-col justify-center items-start gap-2.5 inline-flex">
      <div className="self-stretch justify-start items-start inline-flex">
        <div className="grow shrink basis-0 text-emerald-500 text-base font-normal font-['GT America Mono']">
          RUNBOOK CHECKLIST
        </div>
      </div>
      <div className="w-[488px] h-[19px] text-gray-400 text-sm font-normal font-['Inter']">
        Review and check the items from the list below
      </div>
      <div className="w-[976px] h-[167px] flex-col justify-start items-start inline-flex">
        <div className="self-stretch h-[167px] bg-neutral-700 rounded border border-zinc-600 flex-col justify-start items-start flex">
          <div className="self-stretch bg-white/opacity-0 justify-start items-start inline-flex">
            <div className="w-8 self-stretch bg-gray-950 border-l border-t border-gray-800 flex-col justify-between items-start inline-flex">
              <div className="self-stretch py-2.5 justify-center items-center inline-flex">
                <div className="text-stone-500 text-sm font-normal font-['Inter'] leading-[18.20px]">
                  #
                </div>
                <div className="text-white text-sm font-normal font-['Inter'] leading-[18.20px]">
                  1
                </div>
              </div>
            </div>
            <div className="grow shrink basis-0 self-stretch bg-gray-950 border-l border-t border-neutral-800 flex-col justify-center items-start inline-flex">
              <div className="self-stretch px-3 py-2.5 justify-start items-start inline-flex">
                <div className="grow shrink basis-0 text-gray-400 text-sm font-normal font-['Inter'] leading-[18.20px]">
                  Check Stacks blockchain Mainnet liveness
                </div>
              </div>
            </div>
            <div className="self-stretch bg-gray-950 border-t border-neutral-800 flex-col justify-center items-start inline-flex">
              <div className="self-stretch px-2 py-2.5 justify-end items-start inline-flex">
                <div className="px-2 py-0.5 bg-neutral-800 rounded-sm flex-col justify-end items-start gap-2.5 inline-flex">
                  <div className="text-gray-400 text-sm font-normal font-['GT America Mono'] uppercase leading-[18.20px]">
                    140,349 Blocks
                  </div>
                </div>
              </div>
            </div>
            <div className="w-8 self-stretch bg-gray-950 border-l border-t border-neutral-800 flex-col justify-center items-start inline-flex">
              <div className="self-stretch py-2.5 justify-center items-start inline-flex">
                <div className="text-white text-xs font-normal font-['Inter'] leading-none">
                  ✓
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch bg-white/opacity-0 justify-start items-start inline-flex">
            <div className="w-8 self-stretch bg-neutral-900 border-l border-t border-neutral-800 flex-col justify-between items-start inline-flex">
              <div className="self-stretch py-2.5 justify-center items-center inline-flex">
                <div className="text-stone-500 text-sm font-normal font-['Inter'] leading-[18.20px]">
                  #
                </div>
                <div className="text-white text-sm font-normal font-['Inter'] leading-[18.20px]">
                  2
                </div>
              </div>
            </div>
            <div className="grow shrink basis-0 self-stretch bg-neutral-900 border-l border-t border-neutral-800 flex-col justify-center items-start inline-flex">
              <div className="self-stretch px-3 py-2.5 justify-start items-start inline-flex">
                <div className="grow shrink basis-0 text-gray-400 text-sm font-normal font-['Inter'] leading-[18.20px]">
                  Check wallet address executing the Runbook
                </div>
              </div>
            </div>
            <div className="self-stretch bg-neutral-900 border-t border-neutral-800 flex-col justify-center items-start inline-flex">
              <div className="self-stretch px-2 py-2.5 justify-end items-start inline-flex">
                <div className="px-2 py-0.5 bg-neutral-800 rounded-sm flex-col justify-end items-start gap-2.5 inline-flex">
                  <div className="text-gray-400 text-sm font-normal font-['GT America Mono'] uppercase">
                    SP12293498239481941230912309543
                  </div>
                </div>
              </div>
            </div>
            <div className="w-8 self-stretch bg-neutral-900 border-l border-t border-neutral-800 flex-col justify-center items-start inline-flex">
              <div className="self-stretch py-2.5 justify-center items-start inline-flex">
                <div className="text-white text-xs font-normal font-['Inter'] leading-none">
                  ✓
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch bg-white/opacity-0 justify-start items-start inline-flex">
            <div className="w-8 self-stretch bg-gray-950 border-l border-t border-neutral-800 flex-col justify-between items-start inline-flex">
              <div className="self-stretch py-2.5 justify-center items-center inline-flex">
                <div className="text-stone-500 text-sm font-normal font-['Inter'] leading-[18.20px]">
                  #
                </div>
                <div className="text-white text-sm font-normal font-['Inter'] leading-[18.20px]">
                  3
                </div>
              </div>
            </div>
            <div className="grow shrink basis-0 self-stretch bg-gray-950 border-l border-t border-neutral-800 flex-col justify-center items-start inline-flex">
              <div className="self-stretch px-3 py-2.5 justify-start items-start inline-flex">
                <div className="grow shrink basis-0 text-gray-400 text-sm font-normal font-['Inter'] leading-[18.20px]">
                  Check estimated cost for executing the Runbook (STX)
                </div>
              </div>
            </div>
            <div className="self-stretch bg-gray-950 border-t border-neutral-800 flex-col justify-center items-start inline-flex">
              <div className="self-stretch px-2 py-2.5 justify-end items-start inline-flex">
                <div className="px-2 py-0.5 bg-neutral-800 rounded-sm flex-col justify-end items-start gap-2.5 inline-flex">
                  <div className="text-gray-400 text-sm font-normal font-['GT America Mono'] uppercase leading-[18.20px]">
                    150 STX
                  </div>
                </div>
              </div>
            </div>
            <div className="w-8 self-stretch bg-gray-950 border-l border-t border-neutral-800 flex-col justify-center items-start inline-flex">
              <div className="self-stretch py-2.5 justify-center items-start inline-flex">
                <div className="text-white text-xs font-normal font-['Inter'] leading-none">
                  ✓
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch bg-white/opacity-0 justify-start items-start inline-flex">
            <div className="w-8 self-stretch bg-neutral-900 border-l border-t border-neutral-800 flex-col justify-between items-start inline-flex">
              <div className="self-stretch py-2.5 justify-center items-center inline-flex">
                <div className="text-stone-500 text-sm font-normal font-['Inter'] leading-[18.20px]">
                  #
                </div>
                <div className="text-white text-sm font-normal font-['Inter'] leading-[18.20px]">
                  4
                </div>
              </div>
            </div>
            <div className="grow shrink basis-0 self-stretch bg-neutral-900 border-l border-t border-neutral-800 flex-col justify-center items-start inline-flex">
              <div className="self-stretch px-3 py-2.5 justify-start items-start inline-flex">
                <div className="grow shrink basis-0 text-gray-400 text-sm font-normal font-['Inter'] leading-[18.20px]">
                  Check wallet provisioning (STX)
                </div>
              </div>
            </div>
            <div className="self-stretch bg-neutral-900 border-t border-neutral-800 flex-col justify-center items-start inline-flex">
              <div className="self-stretch px-2 py-2.5 justify-end items-start inline-flex">
                <div className="px-2 py-0.5 bg-neutral-800 rounded-sm flex-col justify-end items-start gap-2.5 inline-flex">
                  <div className="text-gray-400 text-sm font-normal font-['GT America Mono'] uppercase leading-[18.20px]">
                    100 STX
                  </div>
                </div>
              </div>
            </div>
            <div className="w-8 self-stretch bg-neutral-900 border-l border-t border-neutral-800 flex-col justify-center items-start inline-flex">
              <div className="self-stretch py-2.5 justify-center items-start inline-flex">
                <div className="text-white text-xs font-normal font-['Inter'] leading-none">
                  ✓
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch justify-end items-center gap-2.5 inline-flex">
        <div className="flex-col justify-center items-end gap-8 inline-flex">
          <PrimaryPanelButton
            panelIndex={panelIndex}
            button={{ title: "Check All" }}
            scrollHandler={scrollHandler}
          />
          <PrimaryPanelButton
            panelIndex={panelIndex}
            disabled={true}
            button={{ title: "Start Runbook" }}
            scrollHandler={scrollHandler}
          />
        </div>
      </div>
    </div>
  );
});
interface PrimaryPanelButtonProps {
  button?: PanelButton;
  panelIndex: number;
  disabled?: boolean;
  scrollHandler: any;
}
function PrimaryPanelButton({
  button,
  panelIndex,
  disabled = false,
  scrollHandler,
}: PrimaryPanelButtonProps) {
  const dispatch = useAppDispatch();
  let onClick;
  if (button !== undefined && button.onClick !== undefined) {
    onClick = async (mouseEvent) => {
      // @ts-ignore (I don't know why typescript says this could be undefined)
      await button.onClick(mouseEvent);
      scrollHandler(panelIndex + 1);
      dispatch(setActiveRunbookActiveStep(panelIndex + 1));
    };
  } else {
    onClick = () => {
      scrollHandler(panelIndex + 1);
      dispatch(setActiveRunbookActiveStep(panelIndex + 1));
    };
  }
  const isDisabled = disabled || button?.disabled || false;
  return (
    <PanelButton
      title={button?.title || "Continue"}
      onClick={onClick}
      isDisabled={isDisabled}
    />
  );
}

export enum ElementSize {
  XS,
  S,
  M,
  L,
  XL,
}
export interface PanelButtonProps {
  title: String;
  isDisabled: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  size?: ElementSize;
}

function PanelButton({
  title,
  isDisabled,
  onClick,
  size = ElementSize.M,
}: PanelButtonProps) {
  let colorClass = isDisabled
    ? "opacity-30 bg-black text-zinc-400"
    : "bg-teal-950 text-emerald-500";
  let sizeClass =
    size === ElementSize.XL
      ? "w-20 h-16"
      : size === ElementSize.L
        ? "w-16 h-12"
        : size === ElementSize.M
          ? "w-16 h-12"
          : "w-16 h-8";
  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className={classNames(
        "max-w-[150px] h-8 px-4 py-2 rounded flex-col justify-center items-center gap-2.5 inline-flex text-center text-xs font-normal font-['GT America Mono'] uppercase leading-none tracking-tight",
        colorClass,
      )}
    >
      {title}
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
