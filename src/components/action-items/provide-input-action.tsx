import { useMutation } from "@apollo/client";
import {
  ActionItemRequest,
  ActionItemResponse,
  formatValueForDisplay,
  toValue,
} from "../main/types";
import { ActionItemRow } from "./components/action-item-row";
import { UPDATE_ACTION_ITEM } from "../../utils/queries";
import React from "react";
import { ProvideInputCell } from "./components/provide-input-cell";

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
  isCurrent
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
      },
    };
    updateActionItem({ variables: { event: JSON.stringify(event) } });
  };
  const onChange = (e: any) => {
    const { inputName, typing } = actionType.data;
    const event: ActionItemResponse = {
      actionItemId: id,
      type: "ProvideInput",
      data: {
        inputName,
        updatedValue: toValue(e.target.value, typing),
      },
    };
    updateActionItem({ variables: { event: JSON.stringify(event) } });
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
          defaultValue !== undefined
            ? formatValueForDisplay(defaultValue)
            : undefined
        }
      />
    </ActionItemRow>
  );
}
