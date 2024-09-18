import React, { forwardRef, useEffect } from "react";

import { ActionGroup, ActionSubGroup, ModalBlock } from "./types";
import { classNames } from "../../utils/helpers";
import { ReviewInputAction } from "../action-items/review-input-action";
import { ProvideInputAction } from "../action-items/provide-input-action";
import { ProvideSignedTransactionAction } from "../action-items/provide-signed-transaction-action";
import { ProvidePublicKeyAction } from "../action-items/provide-public-key-action";
import { PickInputOptionAction } from "../action-items/pick-input-option-action";
import { DisplayOutputAction } from "../action-items/display-output-action";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectRunbookActiveStep } from "../../reducers/runbook-step-slice";
import {
  RunbookStepStatus,
  statusForStepNumber,
} from "../header/runbook-status-bar";
import {
  selectActiveActionId,
  setModalVisibility,
} from "../../reducers/runbooks-slice";
import { ValidateModalAction } from "../action-items/validate-modal-action";
import { ButtonColor, ElementSize, PanelButton } from "../buttons/panel-button";
import { ModalWrapper } from "./modal-wrapper";
import useHandleEscapeKey from "../../hooks/useHandleEscapeKey";

export interface Modal {
  block: ModalBlock<true>;
  index: number;
}
export function Modal({ block, index }: Modal) {
  const dispatch = useAppDispatch();
  const isVisible = block.visible;

  useHandleEscapeKey(
    () => {
      dispatch(setModalVisibility([block.uuid, false]));
    },
    [dispatch, block.uuid, block.visible],
    isVisible,
  );

  return (
    <ModalWrapper
      visible={isVisible}
      onClick={() => {
        dispatch(setModalVisibility([block.uuid, false]));
      }}
    >
      <Panel
        key={block.uuid}
        block={block}
        panelIndex={index}
        scrollHandler={() => {}}
      />
    </ModalWrapper>
  );
}

interface PanelProps {
  block: ModalBlock;
  panelIndex: number;
  scrollHandler: any;
}

const Panel = forwardRef(function Panel(
  { block, panelIndex, scrollHandler }: PanelProps,
  ref: React.ForwardedRef<any>,
) {
  const { uuid, visible, panel } = block;
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
      className="w-full p-4 md:p-6 bg-zinc-900 rounded-lg shadow border border-neutral-800 flex-col justify-center items-start gap-2.5 inline-flex"
      id={uuid}
    >
      <div className="self-stretch justify-start items-start inline-flex">
        <div
          className="scroll-mt-44 grow shrink basis-0 text-emerald-500 text-base font-normal font-gt uppercase"
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
        <Group group={group} key={i} index={i} modalUuid={uuid} />
      ))}
    </div>
  );
});

export interface Group {
  group: ActionGroup;
  modalUuid: string;
  index: number;
}
export function Group({ group, index, modalUuid }: Group) {
  const mod = index % 3;
  let borderColor, textColor;
  if (mod === 0) {
    borderColor = "border-red-600";
    textColor = "text-red-600";
  } else if (mod === 1) {
    borderColor = "border-blue-600";
    textColor = "text-blue-600";
  } else {
    borderColor = "border-amber-400";
    textColor = "text-amber-400";
  }
  const { subGroups, title } = group;
  return (
    <div className="w-full flex-col justify-center items-start gap-2.5 inline-flex pb-8">
      <div
        className={classNames(
          "px-2 text-sm font-normal font-inter rounded",
          !title ? "" : "border",
          borderColor,
          textColor,
        )}
      >
        {title}
      </div>
      {subGroups.map((subGroup, i) =>
        // we're assuming that if any action item in this subgroup is a button (ValidateModal),
        // then all actions in this subGroup are buttons
        subGroup.actionItems[0].actionType.type === "ValidateModal" ? (
          <ButtonSubGroup subGroup={subGroup} modalUuid={modalUuid} key={i} />
        ) : (
          <SubGroup subGroup={subGroup} key={i} />
        ),
      )}
    </div>
  );
}

interface SubGroup {
  subGroup: ActionSubGroup;
}
function SubGroup({ subGroup }: SubGroup) {
  const activeItemId = useAppSelector(selectActiveActionId);
  const { actionItems, allowBatchCompletion } = subGroup;

  const uiActionItems = actionItems.reduce((accumulator, actionItem, i) => {
    const { actionType, id } = actionItem;
    const { type } = actionType;
    const isFirst = i === 0;
    const isLast = i === actionItems.length - 1;
    const isCurrent = activeItemId === id;

    if (type === "ReviewInput") {
      accumulator.push(
        <ReviewInputAction
          actionItem={actionItem}
          isFirst={isFirst}
          isLast={isLast}
          key={id}
          isCurrent={isCurrent}
        />,
      );
    } else if (type === "ProvideInput") {
      accumulator.push(
        <ProvideInputAction
          actionItem={actionItem}
          isFirst={isFirst}
          isLast={isLast}
          key={id}
          isCurrent={isCurrent}
        />,
      );
    } else if (type === "PickInputOption") {
      accumulator.push(
        <PickInputOptionAction
          actionItem={actionItem}
          isFirst={isFirst}
          isLast={isLast}
          key={id}
          isCurrent={isCurrent}
        />,
      );
    } else if (type === "ProvidePublicKey") {
      accumulator.push(
        <ProvidePublicKeyAction
          actionItem={actionItem}
          isFirst={isFirst}
          isLast={isLast}
          key={id}
          isCurrent={isCurrent}
        />,
      );
    } else if (type === "ProvideSignedTransaction") {
      accumulator.push(
        <ProvideSignedTransactionAction
          actionItem={actionItem}
          isFirst={isFirst}
          isLast={isLast}
          key={id}
          isCurrent={isCurrent}
        />,
      );
    } else if (type === "DisplayOutput") {
      accumulator.push(
        <DisplayOutputAction
          actionItem={actionItem}
          isFirst={isFirst}
          isLast={isLast}
          key={id}
          isCurrent={isCurrent}
        />,
      );
    }
    return accumulator;
  }, [] as JSX.Element[]);

  return (
    <div className="self-stretch flex-col justify-start items-start inline-flex border border-zinc-600 rounded">
      {uiActionItems}
    </div>
  );
}

interface ButtonSubGroup {
  subGroup: ActionSubGroup;
  modalUuid: string;
}

function ButtonSubGroup({ subGroup, modalUuid }: ButtonSubGroup) {
  const { actionItems, allowBatchCompletion } = subGroup;
  if (actionItems.length > 3) {
    throw new Error(`ButtonSubGroups should have a maximum of 3 action items`);
  }
  const uiActionItems = actionItems.reduce((accumulator, actionItem, i) => {
    const { actionType, id } = actionItem;
    const { type } = actionType;
    if (type === "ValidateModal") {
      accumulator.push(
        <ValidateModalAction
          actionItem={actionItem}
          modalUuid={modalUuid}
          key={id}
          index={i}
        />,
      );
      accumulator.push(
        <CloseModalAction modalUuid={modalUuid} key={`${id}-close`} />,
      );
    } else {
      throw new Error(
        `ValidateModal actions must only be in a sub group with other ValidateModal actions`,
      );
    }
    return accumulator;
  }, [] as JSX.Element[]);
  return (
    <div className="self-stretch py-2.5 justify-end items-start inline-flex">
      {uiActionItems}
    </div>
  );
}

export interface CloseModalAction {
  modalUuid: string;
}
export function CloseModalAction({ modalUuid }: CloseModalAction) {
  const dispatch = useAppDispatch();
  const onClick = () => {
    dispatch(setModalVisibility([modalUuid, false]));
  };

  let isDisabled = false;
  if (status === "Success") {
    isDisabled = true;
  }

  const color = ButtonColor.Black;

  return (
    <div>
      <PanelButton
        title="Cancel"
        onClick={onClick}
        isDisabled={isDisabled}
        size={ElementSize.L}
        color={color}
      />
    </div>
  );
}
