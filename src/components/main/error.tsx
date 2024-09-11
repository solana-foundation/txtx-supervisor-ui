import React, { forwardRef, useRef } from "react";
import { classNames } from "../../utils/helpers";
import { useAppSelector } from "../../hooks";
import {
  RunbookStepStatus,
  statusForStepNumber,
} from "../header/runbook-status-bar";
import { selectRunbookActiveStep } from "../../reducers/runbook-step-slice";
import { ActionBlock, ActionGroup, ActionSubGroup } from "./types";
import { ReviewInputAction } from "../action-items/review-input-action";
import { ProvideInputAction } from "../action-items/provide-input-action";
import { ValidateBlockAction } from "../action-items/validate-block-action";
import { ProvideSignedTransactionAction } from "../action-items/provide-signed-transaction-action";
import { ProvidePublicKeyAction } from "../action-items/provide-public-key-action";
import { PickInputOptionAction } from "../action-items/pick-input-option-action";
import { DisplayOutputAction } from "../action-items/display-output-action";
import { OpenModalAction } from "../action-items/open-modal-action";
import { DisplayErrorLogAction } from "../action-items/display-error-log-action";

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

interface Group {
  group: ActionGroup;
}
function Group({ group }: Group) {
  const { subGroups, title } = group;
  return (
    <div className="w-full flex-col justify-center items-start gap-2.5 inline-flex">
      <div className="text-gray-400 text-sm font-normal font-inter">
        {title}
      </div>
      {subGroups.map((subGroup, i) =>
        // we're assuming that if any action item in this subgroup is a button (ValidateBlock),
        // then all actions in this subGroup are buttons
        subGroup.actionItems[0].actionType.type === "ValidateBlock" ? (
          <ButtonSubGroup subGroup={subGroup} key={i} />
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
  const { actionItems, allowBatchCompletion } = subGroup;
  const idx = actionItems.findIndex((item) => ['Todo', 'Error'].includes(item.actionStatus.status) );
  let currentItemId:string;
  if (idx > -1) {
    currentItemId = actionItems[idx].id;
  }

  const uiActionItems = actionItems.reduce((accumulator, actionItem, i) => {
    const { actionType, id } = actionItem;
    const { type } = actionType;
    const isFirst = i === 0;
    const isLast = i === actionItems.length - 1;
    const isCurrent = currentItemId === id;

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
    } else if (type === "DisplayErrorLog") {
      accumulator.push(
        <DisplayErrorLogAction actionItem={actionItem} key={id} />,
      );
    } else if (type === "OpenModal") {
      accumulator.push(
        <OpenModalAction
          actionItem={actionItem}
          isFirst={isFirst}
          isLast={isLast}
          key={id}
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
}

function ButtonSubGroup({ subGroup }: ButtonSubGroup) {
  const { actionItems, allowBatchCompletion } = subGroup;
  if (actionItems.length > 2) {
    throw new Error(`ButtonSubGroups should have a maximum of 3 action items`);
  }
  const uiActionItems = actionItems.reduce((accumulator, actionItem, i) => {
    const { actionType, id } = actionItem;
    const { type } = actionType;
    if (type === "ValidateBlock") {
      accumulator.push(
        <ValidateBlockAction actionItem={actionItem} key={id} index={i} />,
      );
    } else {
      throw new Error(
        `ValidateBlock actions must only be in a sub group with other ValidateBlock actions`,
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
