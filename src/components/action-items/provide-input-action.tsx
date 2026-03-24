import { useMutation } from "@apollo/client/react";
import {
  ActionItemRequest,
  ActionItemResponse,
  valueToJson,
  toValue,
} from "../../types/runbook";
import { ActionItemRow } from "./shared/action-item-row";
import { UPDATE_ACTION_ITEM } from "../../utils/queries";
import React from "react";
import { ProvideInputCell } from "./shared/provide-input-cell";

export interface ProvideInputAction {
  actionItem: ActionItemRequest;
  isFirst: boolean;
  isLast: boolean;
  isCurrent: boolean;
}
export function ProvideInputAction({
  actionItem,
  isFirst,
  isLast,
  isCurrent,
}: ProvideInputAction) {
  const { id, actionType, actionStatus } = actionItem;
  const [updateActionItem, {}] = useMutation(UPDATE_ACTION_ITEM);

  if (actionType.type !== "ProvideInput") {
    throw new Error(
      "ProvideInputAction component requires ProvideInput action type.",
    );
  }

  const onClick = (e: any) => {
    // don't send review input events if the user was clicking on the input field
    if (e.target instanceof HTMLInputElement) return;
    const event: ActionItemResponse = {
      actionItemId: id,
      type: "ReviewInput",
      data: {
        inputName: actionType.data.inputName,
        valueChecked: actionStatus.status === "Todo",
        forceExecution: false,
      },
    };
    updateActionItem({ variables: { event: JSON.stringify(event) } });
  };
  const onChange = (value: string | number | object) => {
    const { inputName, typing } = actionType.data;
    const event: ActionItemResponse = {
      actionItemId: id,
      type: "ProvideInput",
      data: {
        inputName,
        updatedValue: toValue(value, typing),
      },
    };
    updateActionItem({ variables: { event: JSON.stringify(event) } });

    const reviewEvent: ActionItemResponse = {
      actionItemId: id,
      type: "ReviewInput",
      data: {
        inputName,
        valueChecked: true,
        forceExecution: false,
      },
    };
    updateActionItem({ variables: { event: JSON.stringify(reviewEvent) } });
  };
  const defaultValue = actionType.data.defaultValue;
  return (
    <ActionItemRow
      actionItem={actionItem}
      isFirst={isFirst}
      isLast={isLast}
      onClick={onClick}
      isCurrent={isCurrent}
    >
      <ProvideInputCell
        actionItem={actionItem}
        onChange={onChange}
        defaultValue={
          defaultValue !== undefined ? valueToJson(defaultValue) : undefined
        }
        isCurrent={isCurrent}
      />
    </ActionItemRow>
  );
}
