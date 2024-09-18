import { ActionItemRequest, formatValueForDisplay } from "../main/types";
import { ActionItemRow } from "./components/action-item-row";
import { ReviewInputCell } from "./components/review-input-cell";
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
  const displayValue = formatValueForDisplay(actionType.data.value);
  if (displayValue === undefined) {
    throw new Error(
      `DisplayOutputAction component only supports displaying Primitive values, got ${actionType.data.value}`,
    );
  }
  const subRow =
    displayValue &&
    typeof displayValue === "string" &&
    displayValue?.length > 50
      ? { text: displayValue }
      : undefined;
  const el = subRow ? (
    <div></div>
  ) : (
    <ReviewInputCell
      value={displayValue?.toString() || ""}
      actionStatus={actionStatus}
      isCurrent={isCurrent}
    />
  );
  return (
    <ActionItemRow
      actionItem={actionItem}
      isFirst={isFirst}
      isLast={isLast}
      onClick={onClick}
      subRow={subRow}
      isCurrent={isCurrent}
    >
      {el}
    </ActionItemRow>
  );
}
