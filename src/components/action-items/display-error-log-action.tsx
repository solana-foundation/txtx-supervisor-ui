import { ActionItemRequest, formatDiagnosticForDisplay } from "../../types/runbook";
import { OutputRow } from "./shared/output-row";
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
