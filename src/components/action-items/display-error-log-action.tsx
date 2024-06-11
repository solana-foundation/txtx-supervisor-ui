import {
  ActionItemRequest,
  Diagnostic,
  formatDiagnosticForDisplay,
  formatValueForDisplay as valueToPrimitive,
} from "../main/types";
import { ActionItemRow } from "./components/action-item-row";
import { OutputRow } from "./components/output-row";
import { ReviewInputCell } from "./components/review-input-cell";
import React from "react";

export interface DisplayErrorLogAction {
  actionItem: ActionItemRequest;
}
export function DisplayErrorLogAction({ actionItem }: DisplayErrorLogAction) {
  const { actionStatus, actionType } = actionItem;

  if (actionType.type !== "DisplayErrorLog") {
    throw new Error(
      "DisplayErrorLogAction component requires DisplayErrorLog action type.",
    );
  }

  const displayValue = formatDiagnosticForDisplay(actionType.data.diagnostic);

  return <OutputRow displayValue={displayValue} />;
}
