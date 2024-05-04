import React, { MouseEventHandler, forwardRef, useState } from "react";
import { classNames } from "../../utils/helpers";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RunbookStepStatus, statusForStepNumber } from "./runbook-status-bar";
import {
  selectActiveRunbookActiveStep,
  setActiveRunbookActiveStep,
} from "../../reducers/runbooks-slice";

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
  title: String;
  description: String;
  content: JSX.Element;
  primaryButton?: PanelButton;
  secondaryButton?: PanelButton;
  panelIndex: number;
  scrollHandler: any;
}
export const Panel = forwardRef(function Panel(
  {
    title,
    description,
    primaryButton,
    secondaryButton,
    content,
    panelIndex,
    scrollHandler,
  }: PanelProps,
  ref: React.ForwardedRef<any>,
) {
  return (
    <div className="w-full p-6 bg-zinc-900 rounded-lg shadow border border-neutral-800 flex-col justify-center items-start gap-2.5 inline-flex">
      <div className="self-stretch justify-start items-start inline-flex">
        <div className="grow shrink basis-0 text-emerald-500 text-base font-normal font-['GT America Mono']">
          {title}
        </div>
      </div>
      <div className="w-full h-[19px] text-gray-400 text-sm font-normal font-['Inter']">
        {description}
      </div>
      {content}
      <div className="pt-2 self-stretch justify-end items-center gap-2.5 inline-flex">
        <div className="flex-col justify-center items-end gap-8 inline-flex">
          <PrimaryPanelButton
            panelIndex={panelIndex}
            disabled={primaryButton?.disabled}
            button={primaryButton}
            scrollHandler={scrollHandler}
          />
        </div>
      </div>
    </div>
  );
});

export interface PanelWithTableProps {
  title: String;
  description: String;
  readonly: boolean;
  rows: TableForPanelProps[];
  primaryButton?: PanelButton;
  secondaryButton?: PanelButton;
  panelIndex: number;
  scrollHandler: any;
}

export const PanelWithTable = forwardRef(function Panel(
  {
    title,
    description,
    primaryButton,
    secondaryButton,
    readonly,
    rows,
    panelIndex,
    scrollHandler,
  }: PanelWithTableProps,
  ref: React.ForwardedRef<any>,
) {
  const [rowCheckedArr, setRowCheckedArr] = useState(
    new Array(rows.length).fill(false),
  );

  const onRowCheck = (idx, state) => {
    const nextState = rowCheckedArr.map((current, i) => {
      if (i === idx) {
        return state;
      } else return current;
    });
    setRowCheckedArr(nextState);
  };
  const isRowChecked = (idx) => {
    return rowCheckedArr[idx];
  };

  return (
    <div className="w-full p-6 bg-zinc-900 rounded-lg shadow border border-neutral-800 flex-col justify-center items-start gap-2.5 inline-flex">
      <div className="self-stretch justify-start items-start inline-flex">
        <div className="grow shrink basis-0 text-emerald-500 text-base font-normal font-['GT America Mono']">
          {title}
        </div>
      </div>
      <div className="w-full h-[19px] text-gray-400 text-sm font-normal font-['Inter']">
        {description}
      </div>
      <TableForPanel
        readonly={readonly}
        rows={rows}
        onRowCheck={onRowCheck}
        isRowChecked={isRowChecked}
      />

      <div className="pt-2 self-stretch justify-end items-center gap-2.5 inline-flex">
        <div className="flex-col justify-center items-end gap-8 inline-flex">
          <PrimaryPanelButton
            panelIndex={panelIndex}
            disabled={
              primaryButton?.disabled ||
              rowCheckedArr.some((isChecked) => !isChecked)
            }
            button={primaryButton}
            scrollHandler={scrollHandler}
          />
        </div>
      </div>
    </div>
  );
});

export interface TableForPanelProps {
  index: number;
  title: string;
  cell: ReadonlyCellProps | InputCellProps;
}
export function TableForPanel({
  readonly,
  rows,
  onRowCheck,
  isRowChecked,
}: {
  readonly: boolean;
  rows: TableForPanelProps[];
  onRowCheck: any;
  isRowChecked: any;
}) {
  return (
    <div className="w-full flex-col justify-start items-start inline-flex">
      <div className="self-stretch bg-neutral-700 rounded border border-zinc-600 flex-col justify-start items-start flex">
        {rows.map((props) => (
          <Row
            key={props.index}
            {...props}
            isRowChecked={isRowChecked}
            onRowCheck={onRowCheck}
            readonly={readonly}
          />
        ))}
      </div>
      <div className="pt-2 self-stretch justify-end items-center gap-2.5 inline-flex">
        <div className="flex-col justify-center items-end gap-8 inline-flex">
          <PanelButton
            title="Check All"
            isDisabled={false}
            onClick={() => {}}
            size={ElementSize.S}
          />
        </div>
      </div>
    </div>
  );
}

function Row({
  index,
  title,
  readonly,
  cell,
  onRowCheck,
  isRowChecked,
}: TableForPanelProps & {
  onRowCheck: any;
  isRowChecked: any;
  readonly: boolean;
}) {
  const isChecked = isRowChecked(index);
  const checkClass = isChecked ? "text-emerald-500" : "text-white";
  let valueCell;
  if (readonly) {
    const data = cell as ReadonlyCellProps;
    valueCell = <ReadonlyCell isChecked={isChecked} value={data.value} />;
  } else {
    const data = cell as InputCellProps;
    valueCell = (
      <InputCell
        isChecked={isChecked}
        value={data.value}
        default={data.default}
        commandUuid={data.commandUuid}
      />
    );
  }
  return (
    <div className="self-stretch bg-white/opacity-0 justify-start items-start inline-flex border-t border-neutral-800 first:rounded-t last:rounded-b">
      <div className="w-8 self-stretch bg-neutral-900 border-l border-neutral-800  flex-col justify-between items-start inline-flex">
        <div className="self-stretch py-2.5 justify-center items-center inline-flex">
          <div className="text-stone-500 text-sm font-normal font-['Inter'] leading-[18.20px]">
            #
          </div>
          <div className="text-white text-sm font-normal font-['Inter'] leading-[18.20px]">
            {index + 1}
          </div>
        </div>
      </div>
      <div className="grow shrink basis-0 self-stretch bg-neutral-900 border-l  border-neutral-800 flex-col justify-center items-start inline-flex">
        <div className="self-stretch px-3 py-2.5 justify-start items-start inline-flex">
          <div className="grow shrink basis-0 text-gray-400 text-sm font-normal font-['Inter'] leading-[18.20px]">
            {title}
          </div>
        </div>
      </div>
      {valueCell}
      <div
        className="w-8 self-stretch bg-neutral-900 border-l border-neutral-800 flex-col justify-center items-start inline-flex cursor-pointer"
        onClick={() => onRowCheck(index, !isChecked)}
      >
        <div className="self-stretch py-2.5 justify-center items-start inline-flex">
          <div
            className={classNames(
              "text-xs font-normal font-['Inter'] leading-none",
              checkClass,
            )}
          >
            ✓
          </div>
        </div>
      </div>
    </div>
  );
}

export interface ReadonlyCellProps {
  value: String;
}
export function ReadonlyCell({
  isChecked,
  value,
}: ReadonlyCellProps & { isChecked: boolean }) {
  const valueClass = isChecked ? "text-emerald-500" : "text-gray-400";
  return (
    <div className="self-stretch bg-neutral-900 border-neutral-800 flex-col justify-center items-start inline-flex">
      <div className="self-stretch px-2 py-2.5 justify-end items-start inline-flex">
        <div className="px-2 py-0.5 bg-neutral-800 rounded-sm flex-col justify-end items-start gap-2.5 inline-flex">
          <div
            className={classNames(
              "text-sm font-normal font-['GT America Mono'] uppercase leading-[18.20px]",
              valueClass,
            )}
          >
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}

export interface InputCellProps {
  value?: string | boolean | number;
  default?: string | boolean | number;
  commandUuid: string;
}

export function InputCell({
  isChecked,
  value,
  commandUuid,
  default: defaultValue,
}: InputCellProps & { isChecked: boolean }) {
  const valueClass = isChecked ? "text-emerald-500" : "text-gray-400";
  return (
    <div className="self-stretch bg-neutral-900 border-neutral-800 flex-col justify-center items-start inline-flex">
      <div className="self-stretch px-2 py-2.5 justify-end items-start inline-flex">
        <div className="px-2 py-0.5 bg-neutral-800 rounded-sm flex-col justify-end items-start gap-2.5 inline-flex">
          <input
            id={commandUuid}
            className={classNames(
              "text-sm font-normal font-['GT America Mono'] uppercase leading-[18.20px]",
              valueClass,
            )}
            value={defaultValue?.toString() || undefined}
            onChange={console.log}
          />
        </div>
      </div>
    </div>
  );
}
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
      size={ElementSize.L}
    />
  );
}

export enum ElementSize {
  S,
  M,
  L,
  XL,
  XXL,
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
    size === ElementSize.XXL
      ? "w-80 h-20"
      : size === ElementSize.XL
        ? "w-52 h-16"
        : size === ElementSize.L
          ? "w-40 h-12"
          : size === ElementSize.M
            ? "w-36 h-10"
            : "w-28 h-8";
  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className={classNames(
        "px-4 py-2 rounded flex-col justify-center items-center gap-2.5 inline-flex text-center text-xs font-normal font-['GT America Mono'] uppercase leading-none tracking-tight",
        colorClass,
        sizeClass,
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
