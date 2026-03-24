import React from "react";
import { useAppSelector } from "../../../hooks";
import { selectActiveActionId } from "../../../reducers/runbooks-slice";
import { ActionSubGroup } from "../../../types/runbook";
import { DisplayOutputAction } from "../display-output-action";
import { PickInputOptionAction } from "../pick-input-option-action";
import { ProvideInputAction } from "../provide-input-action";
import { ProvidePublicKeyAction } from "../provide-public-key-action";
import { ProvideSignedTransactionAction } from "../provide-signed-transaction-action";
import { ReviewInputAction } from "../review-input-action";
import { SendTransactionAction } from "../send-transaction-action";
import { ProvideSignedMessageAction } from "../provide-signed-message-action";
import { OpenModalAction } from "../open-modal-action";
import classNames from "../../ui/class-names";
import { DisplayErrorLogAction } from "../display-error-log-action";
import { DisplayInfoAction } from "../display-info-action";
import { VerifyThirdPartySignatureAction } from "../verify-third-party-signature-action";

interface SubGroup {
  subGroup: ActionSubGroup;
}
export function SubGroup({ subGroup }: SubGroup) {
  const activeItemId = useAppSelector(selectActiveActionId);
  const { actionItems, allowBatchCompletion } = subGroup;

  let isCurrentSubGroup = false;
  let isErrorSubGroup = false;
  const uiActionItems = actionItems.reduce((accumulator, actionItem, i) => {
    const { actionType, id, actionStatus } = actionItem;
    const { type } = actionType;
    const isFirst = i === 0;
    const isLast = i === actionItems.length - 1;
    const isCurrent = activeItemId === id;
    if (isCurrent) {
      isCurrentSubGroup = true;
    }
    if (actionStatus.status === "Error") {
      isErrorSubGroup = true;
    }

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
    } else if (type === "ProvideSignedMessage") {
      accumulator.push(
        <ProvideSignedMessageAction
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
    } else if (type === "SendTransaction") {
      accumulator.push(
        <SendTransactionAction
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
    } else if (type === "OpenModal") {
      accumulator.push(
        <OpenModalAction
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
    } else if (type === "BeginFlow") {
      const text = `Beginning execution of flow '${actionType.data.name}'.`;
      accumulator.push(
        <DisplayInfoAction
          text={text}
          bottomBorder={!!actionType.data.description}
          key={`${id}-0`}
        />,
      );
      if (actionType.data.description) {
        const text = `Flow description: '${actionType.data.description}'.`;
        accumulator.push(<DisplayInfoAction text={text} key={`${id}-1`} />);
      }
    } else if (type === "VerifyThirdPartySignature") {
      accumulator.push(
        <VerifyThirdPartySignatureAction
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
    <div
      className={classNames(
        "self-stretch flex-col justify-start items-start inline-flex border rounded",
        isCurrentSubGroup && !isErrorSubGroup
          ? "border-emerald-650"
          : "border-gray-800",
      )}
    >
      {uiActionItems}
    </div>
  );
}
