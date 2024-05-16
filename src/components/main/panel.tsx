import React, {
  MouseEventHandler,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { classNames } from "../../utils/helpers";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RunbookStepStatus, statusForStepNumber } from "./runbook-status-bar";
import {
  selectActiveRunbookActiveStep,
  setActiveRunbookActiveStep,
  setRunbookData,
  updateFieldDirtinessMap,
} from "../../reducers/runbooks-slice";
import { GET_MANUAL, UPDATE_COMMAND_INPUT } from "../../utils/queries";
import { useMutation } from "@apollo/client";
import debounce from "debounce";

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
  primaryButton?: PanelButton | JSX.Element;
  secondaryButton?: PanelButton | JSX.Element;
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
  const activeStep = useAppSelector(selectActiveRunbookActiveStep);

  let status = statusForStepNumber(panelIndex, activeStep);

  const contentVisibility =
    status === RunbookStepStatus.Queued ? "invisible" : "";
  const buttonsDisabled = status === RunbookStepStatus.Complete;

  let primaryButtonEl;
  if (primaryButton === undefined || primaryButton.hasOwnProperty("title")) {
    const button = primaryButton as PanelButton | undefined;
    primaryButtonEl = (
      <PrimaryPanelButton
        panelIndex={panelIndex}
        disabled={button?.disabled || buttonsDisabled}
        button={button}
        scrollHandler={scrollHandler}
      />
    );
  } else {
    primaryButtonEl = primaryButton as JSX.Element;
  }
  return (
    <div
      className={classNames(
        "w-full p-6 bg-zinc-900 rounded-lg shadow border border-neutral-800 flex-col justify-center items-start gap-2.5 inline-flex",
        contentVisibility,
      )}
    >
      <div className="self-stretch justify-start items-start inline-flex">
        <div
          className="scroll-mt-44 grow shrink basis-0 text-emerald-500 text-base font-normal font-['GT America Mono'] uppercase"
          ref={ref}
        >
          {title}
        </div>
      </div>
      <div className="w-full h-[19px] text-gray-400 text-sm font-normal font-['Inter']">
        {description}
      </div>
      {content}
      <div className="pt-2 self-stretch justify-end items-center gap-2.5 inline-flex">
        <div className="flex-col justify-center items-end gap-8 inline-flex">
          {primaryButtonEl}
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
  const activeStep = useAppSelector(selectActiveRunbookActiveStep);

  const [rowCheckedArr, setRowCheckedArr] = useState(
    new Array(rows.length).fill(false),
  );
  useEffect(() => {
    setRowCheckedArr(new Array(rows.length).fill(false));
  }, [rows]);

  const onRowCheck = (idx, state) => {
    const nextState = rowCheckedArr.map((current, i) => {
      if (idx === -1) {
        return state;
      } else if (i === idx) {
        return state;
      } else return current;
    });

    setRowCheckedArr(nextState);
  };
  const isRowChecked = (idx) => {
    return rowCheckedArr[idx];
  };

  let status = statusForStepNumber(panelIndex, activeStep);

  const contentVisibility =
    status === RunbookStepStatus.Queued ? "invisible" : "";
  const buttonsDisabled = status === RunbookStepStatus.Complete;
  return (
    <div
      className={classNames(
        "w-full p-6 bg-zinc-900 rounded-lg shadow border border-neutral-800 flex-col justify-center items-start gap-2.5 inline-flex",
        contentVisibility,
      )}
    >
      <div className="self-stretch justify-start items-start inline-flex">
        <div
          className="scroll-mt-44 grow shrink basis-0 text-emerald-500 text-base font-normal font-['GT America Mono'] uppercase"
          ref={ref}
        >
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
              rowCheckedArr.some((isChecked) => !isChecked) ||
              buttonsDisabled
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
  cell: ReadonlyCellProps | InputCellProps | ButtonCellProps;
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
            onClick={() => {
              onRowCheck(-1, true);
            }}
            size={ElementSize.S}
          />
        </div>
      </div>
    </div>
  );
}

export function Row({
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
  const isError = cell.error !== undefined;
  const checkClass = isChecked
    ? "text-emerald-500"
    : isError
      ? "text-rose-400"
      : "text-white";
  let valueCell;
  if (cell.hasOwnProperty("onClick")) {
    const data = cell as ButtonCellProps;
    valueCell = <ButtonCell {...data} />;
  } else if (readonly) {
    const data = cell as ReadonlyCellProps;
    valueCell = <ReadonlyCell isChecked={isChecked} {...data} />;
  } else {
    const data = cell as InputCellProps;
    valueCell = <InputCell isChecked={isChecked} {...data} />;
  }

  const onClick = (event) => {
    if (event.target.tagName === "INPUT") return;
    onRowCheck(index, !isChecked);
  };
  return (
    <div
      className="self-stretch bg-white/opacity-0 justify-start items-start inline-flex border-t border-neutral-800 first:rounded-t last:rounded-b cursor-pointer"
      onClick={onClick}
    >
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
      <div className="w-8 self-stretch bg-neutral-900 border-l border-neutral-800 flex-col justify-center items-start inline-flex">
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
  error?: String;
}
export function ReadonlyCell({
  isChecked,
  value,
  error,
}: ReadonlyCellProps & { isChecked: boolean }) {
  const isError = error !== undefined;

  const containerClass = isChecked
    ? "bg-neutral-800"
    : isError
      ? "bg-stone-900"
      : "bg-neutral-800";

  const valueClass = isChecked
    ? "text-emerald-500"
    : isError
      ? "text-rose-400"
      : "text-gray-400";
  return (
    <div className="self-stretch bg-neutral-900 border-neutral-800 flex-col justify-center items-start inline-flex">
      <div className="self-stretch px-2 py-2.5 justify-end items-start inline-flex">
        <div
          className={classNames(
            "px-2 py-0.5 rounded-sm flex-col justify-end items-start gap-2.5 inline-flex",
            containerClass,
          )}
        >
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
  runbookUuid: string;
  error?: String;
}

export function InputCell({
  isChecked,
  value,
  commandUuid,
  runbookUuid,
  error,
  default: defaultValue,
}: InputCellProps & { isChecked: boolean }) {
  const dispatch = useAppDispatch();
  const [updateCommandInput, { data, loading, error: mutationErr }] =
    useMutation(UPDATE_COMMAND_INPUT, {
      update(cache, { data: { updateCommandInput } }) {
        const runbookData = {
          uuid: runbookUuid,
          data: updateCommandInput,
        };
        cache.writeQuery({
          query: GET_MANUAL,
          data: {
            runbook: runbookData,
          },
        });
        dispatch(setRunbookData(runbookData));
      },
    });
  const onChange = (event) => {
    updateCommandInput({
      variables: {
        runbookName: runbookUuid,
        commandUuid: commandUuid.replace("local:", ""),
        inputName: "",
        value: event.target.value,
      },
    });
  };
  const debouncedOnChange = debounce(onChange, 500);

  const isError = error !== undefined;
  const containerClass = isChecked
    ? "bg-neutral-900"
    : isError
      ? "bg-stone-900"
      : "bg-neutral-900";

  const valueClass = isChecked
    ? "text-emerald-500"
    : isError
      ? "text-rose-400"
      : "text-gray-400";
  return (
    <div className="grow shrink basis-0 self-stretch bg-neutral-900 flex-col justify-center items-start inline-flex">
      <div className="self-stretch px-2 py-2.5 justify-end items-start inline-flex">
        <div className="grow shrink basis-0 self-stretch flex-col justify-end items-start gap-2.5 inline-flex">
          <input
            id={commandUuid}
            className={classNames(
              "self-stretch text-sm font-normal font-['GT America Mono'] uppercase leading-[18.20px] text-right",
              "border-gray-800  rounded-sm",
              "focus:outline-none focus:ring-0 ring-0 focus:border-emerald-500",
              valueClass,
              containerClass,
            )}
            defaultValue={defaultValue?.toString() || undefined}
            onChange={debouncedOnChange}
          />
        </div>
      </div>
    </div>
  );
}

export interface ButtonCellProps {
  title: string;
  onClick: any;
  color?: ButtonColor;
  error: undefined;
}

export function ButtonCell({ title, onClick, color }: ButtonCellProps) {
  return (
    <div className="self-stretch bg-neutral-900 border-neutral-800 flex-col justify-center items-start inline-flex">
      <div className="self-stretch px-2 py-2.5 justify-end items-start inline-flex">
        <PanelButton
          size={ElementSize.S}
          title={title}
          onClick={onClick}
          isDisabled={false}
          color={color}
        />
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
export function PrimaryPanelButton({
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

export enum ButtonColor {
  Emerald,
  Amber,
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
  color?: ButtonColor;
}

export function PanelButton({
  title,
  isDisabled,
  onClick,
  size = ElementSize.M,
  color = ButtonColor.Emerald,
}: PanelButtonProps) {
  let colorClass = isDisabled
    ? "opacity-30 bg-black text-zinc-400"
    : color === ButtonColor.Emerald
      ? "bg-teal-950 text-emerald-500"
      : "bg-stone-850 text-amber-400 border-stone-700 border";

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
