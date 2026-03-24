import { ActionItemRequest } from "../../types/runbook";
import { ActionItemRow } from "./shared/action-item-row";
import { ReviewInputCell } from "./shared/review-input-cell";
import React from "react";

export interface DisplayOutputAction {
  actionItem: ActionItemRequest;
  isFirst: boolean;
  isLast: boolean;
  isCurrent: boolean;
}
export function DisplayOutputAction({
  actionItem,
  isFirst,
  isLast,
  isCurrent,
}: DisplayOutputAction) {
  const { actionStatus, actionType } = actionItem;

  if (actionType.type !== "DisplayOutput") {
    throw new Error(
      "DisplayOutputAction component requires DisplayOutput action type.",
    );
  }

  const onClick = () => {};
  return (
    <ActionItemRow
      actionItem={actionItem}
      isFirst={isFirst}
      isLast={isLast}
      onClick={onClick}
      isCurrent={false}
      displayStatus={false}
    >
      <ReviewInputCell
        value={actionType.data.value}
        actionStatus={actionStatus}
        isCurrent={false}
      />
    </ActionItemRow>
  );
}
