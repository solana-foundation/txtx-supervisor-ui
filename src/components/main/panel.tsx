import React, { MouseEventHandler, forwardRef, useState } from "react";
import {
  classNames,
  getPublicKeyFromLocalStorage,
  getStorageKey,
} from "../../utils/helpers";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RunbookStepStatus, statusForStepNumber } from "./runbook-status-bar";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { GET_BLOCKS, UPDATE_ACTION_ITEM } from "../../utils/queries";
import { useMutation } from "@apollo/client";
import debounce from "debounce";
import {
  selectRunbookActiveStep,
  setRunbookActiveStep,
} from "../../reducers/runbook-step-slice";
import {
  ActionGroup,
  ActionItemRequest,
  ActionItemResponse,
  ActionItemStatus,
  ActionSubGroup,
  Block,
  InputOption,
  PickInputOptionActionItemRequest,
  ProvideInputRequest,
  ProvidePublicKeyRequest,
  toValue,
} from "./types";
import { setBlocks } from "../../reducers/runbooks-slice";
import addonManager from "../../utils/addons-initializer";
import { ConnectWalletFunction, ConnectedWalletInfo } from "../../utils/addons";

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
  panel: Block;
  panelIndex: number;
  scrollHandler: any;
}
export const Panel = forwardRef(function Panel(
  { panel, panelIndex, scrollHandler }: PanelProps,
  ref: React.ForwardedRef<any>,
) {
  const { title, description, groups } = panel;
  const activeStep = useAppSelector(selectRunbookActiveStep);

  let status = statusForStepNumber(panelIndex, activeStep);

  const contentVisibility = "";
  // status === RunbookStepStatus.Queued ? "invisible" : "";
  const buttonsDisabled = status === RunbookStepStatus.Complete;

  const panelId =
    title.toLocaleLowerCase().split(" ").join("-") + "-" + panelIndex;

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
          id={panelId}
        >
          {title}
        </div>
      </div>
      <div className="w-full h-[19px] text-gray-400 text-sm font-normal font-['Inter']">
        {description}
      </div>
      {groups.map((group, i) => (
        <Group group={group} key={i} />
      ))}
      <div className="pt-2 self-stretch justify-end items-center gap-2.5 inline-flex">
        <div className="flex-col justify-center items-end gap-8 inline-flex">
          {/* {primaryButtonEl} */}
        </div>
      </div>
    </div>
  );
});

interface Group {
  group: ActionGroup;
}
function Group({ group }: Group) {
  const { subGroups, title } = group;
  return (
    <div className="w-full flex-col justify-center items-start gap-2.5 inline-flex">
      <div className="text-gray-400 text-sm font-normal font-['Inter']">
        {title}
      </div>
      {subGroups.map((subGroup, i) => (
        <SubGroup subGroup={subGroup} key={i} />
      ))}
    </div>
  );
}

interface SubGroup {
  subGroup: ActionSubGroup;
}
function SubGroup({ subGroup }: SubGroup) {
  const { actionItems, allowBatchCompletion } = subGroup;
  const [updateActionItem, {}] = useMutation(UPDATE_ACTION_ITEM, {
    refetchQueries: [GET_BLOCKS],
    awaitRefetchQueries: true,
  });

  const isValidatePanel =
    actionItems.length === 1 &&
    actionItems[0].actionType.type === "ValidatePanel";

  const uiActionItems = actionItems.reduce((accumulator, actionItem, i) => {
    const { actionType, uuid, actionStatus, description } = actionItem;
    const { type } = actionType;
    const { status } = actionStatus;
    const isFirst = i === 0;
    const isLast = i === actionItems.length - 1;

    if (type === "ReviewInput") {
      const onClick = () => {
        const event: ActionItemResponse = {
          actionItemUuid: uuid,
          type: "ReviewInput",
          data: {
            inputName: actionItem.title,
            valueChecked: status === "Todo",
          },
        };
        updateActionItem({ variables: { event: JSON.stringify(event) } });
      };

      accumulator.push(
        <Row
          actionItem={actionItem}
          isFirst={isFirst}
          isLast={isLast}
          onClick={onClick}
          key={uuid}
        >
          <ReviewInputCell
            description={description}
            actionStatus={actionStatus}
          />
        </Row>,
      );
    } else if (type === "ProvideInput") {
      const onClick = () => {
        const event: ActionItemResponse = {
          actionItemUuid: uuid,
          type: "ReviewInput",
          data: {
            inputName: actionItem.title,
            valueChecked: status === "Todo",
          },
        };
        updateActionItem({ variables: { event: JSON.stringify(event) } });
      };
      const onChange = (e: any) => {
        const { inputName, typing } = actionType.data;
        const event: ActionItemResponse = {
          actionItemUuid: uuid,
          type: "ProvideInput",
          data: {
            inputName,
            updatedValue: toValue(e.target.value, typing),
          },
        };
        updateActionItem({ variables: { event: JSON.stringify(event) } });
      };

      accumulator.push(
        <Row
          actionItem={actionItem}
          isFirst={isFirst}
          isLast={isLast}
          onClick={onClick}
          key={uuid}
        >
          <ProvideInputCell actionItem={actionItem} onChange={onChange} />
        </Row>,
      );
    } else if (type === "PickInputOption") {
      const onClick = () => {};
      const setSelected = (option: InputOption) => {
        const event: ActionItemResponse = {
          actionItemUuid: uuid,
          type: "PickInputOption",
          data: option.value,
        };
        updateActionItem({ variables: { event: JSON.stringify(event) } });
      };
      accumulator.push(
        <Row
          actionItem={actionItem}
          isFirst={isFirst}
          isLast={isLast}
          onClick={onClick}
          key={uuid}
        >
          <PickInputOptionCell
            actionItem={actionItem}
            setSelected={setSelected}
          />
        </Row>,
      );
    } else if (type === "ValidatePanel") {
      const onClick = () => {
        const event: ActionItemResponse = {
          actionItemUuid: uuid,
          type: "ValidatePanel",
        };
        updateActionItem({ variables: { event: JSON.stringify(event) } });
      };
      accumulator.push(
        <ValidatePanelCell
          actionItem={actionItem}
          onClick={onClick}
          key={uuid}
        />,
      );
    } else if (type === "ProvidePublicKey") {
      const { data } = actionType;
      accumulator.push(
        <ProvidePublicKeyRow
          actionItem={actionItem}
          actionTypeData={data}
          isFirst={isFirst}
          isLast={isLast}
          key={uuid}
        />,
      );
    return accumulator;
  }, [] as JSX.Element[]);

  return (
    <div
      className={classNames(
        "self-stretch flex-col justify-start items-start inline-flex ",
        isValidatePanel ? "" : "border border-zinc-600 rounded",
      )}
    >
      {uiActionItems}
    </div>
  );
}

interface Row {
  actionItem: ActionItemRequest;
  isFirst: boolean;
  isLast: boolean;
  onClick: any;
  subRow?: SubRow;
}
function Row({
  actionItem,
  isFirst,
  isLast,
  children,
  onClick,
  subRow,
}: Row & { children }) {
  const { uuid, index, title, description, actionStatus } = actionItem;
  const { status } = actionStatus;
  // todo: handle other statuses
  let checkClass;
  if (status === "Todo") {
    checkClass = "text-white";
  } else if (status === "Success") {
    checkClass = "text-emerald-500";
  } else if (status === "Error") {
    const diag = actionStatus.data;
    checkClass = "text-rose-400";
    subRow = { text: diag.message };
  }

  return (
    <div className="w-full">
      <div
        onClick={onClick}
        className={classNames(
          "w-full self-stretch bg-white/opacity-0 justify-start items-start inline-flex cursor-pointer border-gray-800",
          isFirst ? "rounded-t border-b" : isLast ? "rounded-b" : "border-b",
        )}
      >
        <div
          className={classNames(
            "w-8 self-stretch bg-gray-950 border-r border-gray-800 flex-col justify-between items-start inline-flex",
            isFirst ? "rounded-tl" : isLast ? "rounded-bl" : "",
          )}
        >
          <div className="self-stretch py-2.5 justify-center items-center inline-flex">
            <div className="text-stone-500 text-sm font-normal font-['Inter'] leading-[18.20px]">
              #
            </div>
            <div className="text-white text-sm font-normal font-['Inter'] leading-[18.20px]">
              {index + 1}
            </div>
          </div>
        </div>

        <div className="grow shrink basis-0 self-stretch bg-gray-950 border-gray-800 flex-col justify-center items-start inline-flex">
          <div className="self-stretch px-3 py-2.5 justify-start items-start inline-flex">
            <div className="grow shrink basis-0 text-gray-400 text-sm font-normal font-['Inter'] leading-[18.20px]">
              {title}
            </div>
          </div>
        </div>

        {children}

        <div
          className={classNames(
            "w-8 self-stretch bg-gray-950 border-l border-gray-800 flex-col justify-center items-start inline-flex",
            isFirst ? "rounded-tr" : isLast ? "rounded-br" : "",
          )}
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
      {subRow ? <SubRow {...subRow} /> : undefined}
    </div>
  );
}
interface SubRow {
  text: string;
  children?: JSX.Element;
}
function SubRow({ text, children }: SubRow) {
  let el = children ? (
    <div className="self-stretch justify-end items-end gap-2.5 inline-flex">
      {children}
    </div>
  ) : null;
  return (
    <div
      className={classNames(
        "w-full px-3 py-2.5 justify-start items-start inline-flex bg-black",
        children ? "h-20" : "",
      )}
    >
      <div
        className={classNames(
          "grow shrink basis-0 flex-col justify-start items-start inline-flex",
          children ? "gap-2.5" : "",
        )}
      >
        <div className="self-stretch text-stone-500 text-sm font-medium font-['Inter'] leading-[18.20px]">
          {text}
        </div>
        {el}
      </div>
    </div>
  );
}

interface ProvidePublicKeyRow {
  actionItem: ActionItemRequest;
  actionTypeData: ProvidePublicKeyRequest;
  isFirst: boolean;
  isLast: boolean;
}
function ProvidePublicKeyRow({
  actionItem,
  actionTypeData,
  isFirst,
  isLast,
}: ProvidePublicKeyRow) {
  const { uuid, actionStatus } = actionItem;
  const { namespace, networkId, message } = actionTypeData;
  const { status } = actionStatus;
  addonManager.addNetworkInstance(namespace, networkId);

  const [updateActionItem, {}] = useMutation(UPDATE_ACTION_ITEM, {
    refetchQueries: [GET_BLOCKS],
    awaitRefetchQueries: true,
  });

  const isWalletConnected = addonManager.isWalletConnected(
    namespace,
    networkId,
  );
  if (!isWalletConnected) {
    const onClick = async () => {
      await addonManager.connectWallet(namespace, networkId);
    };
    return (
      <Row
        actionItem={actionItem}
        isFirst={isFirst}
        isLast={isLast}
        onClick={() => {}}
        subRow={{
          text: message,
          children: (
            <PanelButton
              title="Connect Wallet"
              onClick={onClick}
              isDisabled={false}
              size={ElementSize.S}
            />
          ),
        }}
      >
        <div></div>
      </Row>
    );
  } else {
    const address = addonManager.getAddress(namespace, networkId);

    if (status === "Todo") {
      const publicKeyFromStorage = getPublicKeyFromLocalStorage(
        getStorageKey(namespace),
        address,
      );

      if (publicKeyFromStorage === undefined) {
        const onClick = async () => {
          let publicKey = await addonManager.getPublicKey(
            namespace,
            networkId,
            address,
            message,
          );
          if (publicKey === undefined) {
            throw new Error("failed to fetch public key");
          }
          const event: ActionItemResponse = {
            actionItemUuid: uuid,
            type: "ProvidePublicKey",
            data: {
              publicKey,
            },
          };
          updateActionItem({ variables: { event: JSON.stringify(event) } });
        };

        return (
          <Row
            actionItem={actionItem}
            isFirst={isFirst}
            isLast={isLast}
            onClick={() => {}}
            subRow={{
              text: message,
              children: (
                <PanelButton
                  title="Provide Public Key"
                  onClick={onClick}
                  isDisabled={false}
                  size={ElementSize.S}
                />
              ),
            }}
          >
            <div></div>
          </Row>
        );
      } else {
        const onClick = () => {
          const event: ActionItemResponse = {
            actionItemUuid: uuid,
            type: "ProvidePublicKey",
            data: {
              publicKey: publicKeyFromStorage,
            },
          };
          updateActionItem({ variables: { event: JSON.stringify(event) } });
        };
        return (
          <Row
            actionItem={actionItem}
            isFirst={isFirst}
            isLast={isLast}
            onClick={onClick}
          >
            <ReviewInputCell
              description={address}
              actionStatus={actionItem.actionStatus}
            />
          </Row>
        );
      }
    } else if (status === "Success") {
      const onClick = () => {};
      return (
        <Row
          actionItem={actionItem}
          isFirst={isFirst}
          isLast={isLast}
          onClick={onClick}
        >
          <ReviewInputCell
            description={address}
            actionStatus={actionItem.actionStatus}
          />
        </Row>
      );
    } else if (status === "Error") {
      const statusData = actionStatus.data;

      <Row
        actionItem={actionItem}
        isFirst={isFirst}
        isLast={isLast}
        onClick={() => {}}
        subRow={{
          text: statusData.message,
          children: <div></div>,
        }}
      >
        <div></div>
      </Row>;
    }
  }
}

interface ReviewInputCell {
  description: string;
  actionStatus: ActionItemStatus;
}
function ReviewInputCell({ description, actionStatus }: ReviewInputCell) {
  const { status } = actionStatus;
  // todo: handle other statuses
  let descriptionContainerClass, descriptionClass;
  if (status === "Todo") {
    descriptionContainerClass = "bg-neutral-800";
    descriptionClass = "text-gray-400";
  } else if (status === "Success") {
    descriptionContainerClass = "bg-neutral-800";
    descriptionClass = "text-emerald-500";
  } else if (status === "Error") {
    descriptionContainerClass = "bg-stone-900";
    descriptionClass = "text-rose-400";
  }

  return (
    <div className="self-stretch bg-gray-950 flex-col justify-center items-start inline-flex">
      <div className="self-stretch px-2 py-2.5 justify-end items-start inline-flex">
        <div
          className={classNames(
            "px-2 py-0.5 rounded-sm flex-col justify-end items-start gap-2.5 inline-flex",
            descriptionContainerClass,
          )}
        >
          <div
            className={classNames(
              "text-sm font-normal font-['GT America Mono'] uppercase leading-[18.20px]",
              descriptionClass,
            )}
          >
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProvideInputCell {
  actionItem: ActionItemRequest;
  onChange: any;
}
function ProvideInputCell({ actionItem, onChange }: ProvideInputCell) {
  const { uuid, description, actionStatus } = actionItem;
  const context = actionItem.actionType["ProvideInput"] as ProvideInputRequest;
  const { status } = actionStatus;
  // todo: handle other statuses
  let inputClass;
  if (status === "Todo") {
    inputClass = "bg-neutral-800 text-gray-400";
  } else if (status === "Success") {
    inputClass = "bg-neutral-800 text-emerald-500";
  } else if (status === "Error") {
    inputClass = "bg-stone-900 text-rose-400";
  }

  const debouncedOnChange = debounce(onChange, 500);

  return (
    <div className="grow shrink basis-0 self-stretch bg-gray-950 flex-col justify-center items-start inline-flex">
      <div className="self-stretch px-2 py-2.5 justify-end items-start inline-flex">
        <div className="grow shrink basis-0 self-stretch flex-col justify-end items-start gap-2.5 inline-flex">
          <input
            id={uuid}
            className={classNames(
              "self-stretch text-sm font-normal font-['GT America Mono'] leading-[18.20px] text-right",
              "border-gray-800  rounded-sm",
              "focus:outline-none focus:ring-0 ring-0 focus:border-emerald-500",
              inputClass,
            )}
            defaultValue={description}
            onChange={debouncedOnChange}
          />
        </div>
      </div>
    </div>
  );
}

interface PickInputOptionCell {
  actionItem: ActionItemRequest;
  setSelected: any;
}
export default function PickInputOptionCell({
  actionItem,
  setSelected,
}: PickInputOptionCell) {
  const actionType = actionItem.actionType as PickInputOptionActionItemRequest;
  const options = actionType.data;
  const selectedOption = options.find(
    (option) => option.value === actionItem.description,
  );
  const [selected, setSelectedState] = useState(selectedOption);
  const onChange = (option: any) => {
    setSelectedState(option);
    setSelected(option);
  };
  if (selected === undefined) {
    throw new Error(
      `selected option for PickInputOptionCell class is not a valid option. Selected: ${actionItem.description}, Options: ${options}`,
    );
  }
  return (
    <Listbox value={selected.value} onChange={onChange}>
      {({ open }) => (
        <>
          <div className="self-stretch bg-gray-950 flex-col justify-center items-start inline-flex">
            <div className="px-2 py-2.5 ">
              <ListboxButton className="relative w-full cursor-default rounded-md bg-neutral-800 pl-3 pr-10 text-left text-emerald-500 shadow-sm sm:text-sm sm:leading-6">
                <span className="block truncate">{selected.value}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-emerald-500"
                    aria-hidden="true"
                  />
                </span>
              </ListboxButton>

              <Transition
                show={open}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ListboxOptions className="absolute z-10 mt-1 max-h-60 overflow-auto rounded-md bg-neutral-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {options.map((options) => (
                    <ListboxOption
                      key={options.value}
                      className={({ focus }) =>
                        classNames(
                          focus ? "text-emerald-500/80" : "",
                          !focus ? "text-emerald-500" : "",
                          "relative cursor-default select-none py-2 pl-3 pr-9",
                        )
                      }
                      value={options}
                    >
                      {({ selected, focus }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "block truncate",
                            )}
                          >
                            {options.displayedValue}
                          </span>

                          {selected ? (
                            <span
                              className={classNames(
                                focus
                                  ? "text-emerald-500/80"
                                  : "text-emerald-500",
                                "absolute inset-y-0 right-0 flex items-center pr-4",
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Transition>
            </div>{" "}
          </div>
        </>
      )}
    </Listbox>
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

interface ValidatePanelCell {
  actionItem: ActionItemRequest;
  onClick: any;
}
export function ValidatePanelCell({ actionItem, onClick }: ValidatePanelCell) {
  const { title, actionStatus } = actionItem;
  const { status } = actionStatus;

  let isDisabled = false;
  if (status === "Success") {
    isDisabled = true;
  }
  return (
    <div className="self-stretch flex-col justify-center items-start inline-flex">
      <div className="self-stretch py-2.5 justify-end items-start inline-flex">
        <PanelButton
          title={title}
          onClick={onClick}
          isDisabled={isDisabled}
          size={ElementSize.L}
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
      dispatch(setRunbookActiveStep(panelIndex + 1));
    };
  } else {
    onClick = () => {
      scrollHandler(panelIndex + 1);
      dispatch(setRunbookActiveStep(panelIndex + 1));
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
