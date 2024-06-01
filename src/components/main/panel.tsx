import React, { forwardRef } from "react";
import { classNames } from "../../utils/helpers";
import { useAppSelector } from "../../hooks";
import {
  RunbookStepStatus,
  statusForStepNumber,
} from "../header/runbook-status-bar";
import { selectRunbookActiveStep } from "../../reducers/runbook-step-slice";
import { ActionGroup, ActionSubGroup, Block } from "./types";
import { ReviewInputAction } from "../action-items/review-input-action";
import { ProvideInputAction } from "../action-items/provide-input-action";
import { ValidatePanelAction } from "../action-items/validate-panel-action";
import { ProvideSignedTransactionAction } from "../action-items/provide-signed-transaction-action";
import { ProvidePublicKeyAction } from "../action-items/provide-public-key-action";
import { PickInputOptionAction } from "../action-items/pick-input-option-action";

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

  const isValidatePanel =
    actionItems.length === 1 &&
    actionItems[0].actionType.type === "ValidatePanel";

  const uiActionItems = actionItems.reduce((accumulator, actionItem, i) => {
    const { actionType, uuid } = actionItem;
    const { type } = actionType;
    const isFirst = i === 0;
    const isLast = i === actionItems.length - 1;

    if (type === "ReviewInput") {
      accumulator.push(
        <ReviewInputAction
          actionItem={actionItem}
          isFirst={isFirst}
          isLast={isLast}
          key={uuid}
        />,
      );
    } else if (type === "ProvideInput") {
      accumulator.push(
        <ProvideInputAction
          actionItem={actionItem}
          isFirst={isFirst}
          isLast={isLast}
          key={uuid}
        />,
      );
    } else if (type === "PickInputOption") {
      accumulator.push(
        <PickInputOptionAction
          actionItem={actionItem}
          isFirst={isFirst}
          isLast={isLast}
          key={uuid}
        />,
      );
    } else if (type === "ValidatePanel") {
      accumulator.push(
        <ValidatePanelAction actionItem={actionItem} key={uuid} />,
      );
    } else if (type === "ProvidePublicKey") {
      accumulator.push(
        <ProvidePublicKeyAction
          actionItem={actionItem}
          isFirst={isFirst}
          isLast={isLast}
          key={uuid}
        />,
      );
    } else if (type === "ProvideSignedTransaction") {
      accumulator.push(
        <ProvideSignedTransactionAction
          actionItem={actionItem}
          isFirst={isFirst}
          isLast={isLast}
          key={uuid}
        />,
      );
    }
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
