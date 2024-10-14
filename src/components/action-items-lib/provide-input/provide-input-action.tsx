import { useMutation } from "@apollo/client";
import {
  ActionItemRequest,
  ActionItemResponse,
  formatValueForDisplay,
  toValue,
} from "../../main/types";
import { UPDATE_ACTION_ITEM } from "../../../utils/queries";
import React from "react";
import { ProvideInputCell } from "./provide-input-cell";
import { ReviewInputCell } from "../../action-items/components/review-input-cell";
import { ActionItemWrapper } from "../action-item-wrapper";
import { ActionItemRow } from "../../action-items/components/action-item-row";

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
  const [updateActionItem, { }] = useMutation(UPDATE_ACTION_ITEM);
  const skippable = false;
  if (actionType.type !== "ProvideInput") {
    throw new Error(
      "ProvideInputAction component requires ProvideInput action type.",
    );
  }

  const onClick = (e: any) => {
    // send review input events if the user was clicking on the input field
    // because the new design makes the input always visible 
    // if (e.target instanceof HTMLInputElement) return;
    if (isCurrent && e.target instanceof HTMLInputElement) return;
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

      (isCurrent) ? 
        <ActionItemWrapper
          actionItem={actionItem}
          isFirst={isFirst}
          isLast={isLast}
          onClick={onClick}
          isCurrent={isCurrent}
        >
        <ProvideInputCell
          actionItem={actionItem}
          onChange={onChange}
          isCurrent={isCurrent}
          onClick={onClick}
          defaultValue={defaultValue !== undefined ? formatValueForDisplay(defaultValue) : undefined} 
        />
        </ActionItemWrapper>
        :
        <ActionItemRow
          actionItem={actionItem}
          isFirst={isFirst}
          isLast={isLast}
          onClick={onClick}
          isCurrent={isCurrent}
        >
      <ReviewInputCell
        value={defaultValue?.value?.toString() || ''}
        actionStatus={actionStatus}
        isCurrent={isCurrent}
      />
        </ActionItemRow>
      
      
  );
}
