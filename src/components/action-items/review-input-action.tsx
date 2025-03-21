import { useMutation } from "@apollo/client";
import { ActionItemRequest, ActionItemResponse } from "../main/types";
import { ActionItemRow } from "./components/action-item-row";
import { ReviewInputCell } from "./components/review-input-cell";
import { UPDATE_ACTION_ITEM } from "../../utils/queries";
import React from "react";

export interface ReviewInputAction {
  actionItem: ActionItemRequest;
  isFirst: boolean;
  isLast: boolean;
  isCurrent: boolean;
}
export function ReviewInputAction({
  actionItem,
  isFirst,
  isLast,
  isCurrent,
}: ReviewInputAction) {
  const { id, actionStatus, actionType } = actionItem;
  const [updateActionItem, {}] = useMutation(UPDATE_ACTION_ITEM);

  if (actionType.type !== "ReviewInput") {
    throw new Error(
      "ReviewInputAction component requires ReviewInput action type.",
    );
  }

  const onClick = () => {
    const event: ActionItemResponse = {
      actionItemId: id,
      type: "ReviewInput",
      data: {
        inputName: actionType.data.inputName,
        valueChecked: actionStatus.status === "Todo",
        forceExecution: actionType.data.forceExecution,
      },
    };
    updateActionItem({ variables: { event: JSON.stringify(event) } });
  };
  return (
    <ActionItemRow
      actionItem={actionItem}
      isFirst={isFirst}
      isLast={isLast}
      onClick={onClick}
      isCurrent={isCurrent}
    >
      <ReviewInputCell
        value={actionType.data.value}
        actionStatus={actionStatus}
        isCurrent={isCurrent}
      />
    </ActionItemRow>
  );
}
