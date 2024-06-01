import React from "react";
import { ActionItemRow } from "./components/action-item-row";
import { ActionItemRequest, ActionItemResponse } from "../main/types";
import { ReviewInputCell } from "./components/review-input-cell";
import { ElementSize, PanelButton } from "../buttons/panel-button";
import { UPDATE_ACTION_ITEM } from "../../utils/queries";
import { useMutation } from "@apollo/client";
import {
  getPublicKeyFromLocalStorage,
  getStorageKey,
} from "../../utils/helpers";
import addonManager from "../../utils/addons-initializer";

export interface ProvideSignedTransactionAction {
  actionItem: ActionItemRequest;
  isFirst: boolean;
  isLast: boolean;
}
export function ProvideSignedTransactionAction({
  actionItem,
  isFirst,
  isLast,
}: ProvideSignedTransactionAction) {
  const { uuid, actionStatus, actionType } = actionItem;

  if (actionType.type !== "ProvideSignedTransaction") {
    throw new Error(
      "ProvideSignedTransactionAction component requires ProvideSignedTransaction action type.",
    );
  }
  const { type, value } = actionType.data.payload;
  if (
    type !== "Primitive" ||
    value.type !== "String" ||
    typeof value.value !== "string"
  ) {
    throw new Error(
      "ProvideSignedTransaction action must provide value of Type Primitive::String",
    );
  }
  const { value: transaction } = value;
  return (
    <ActionItemRow
      actionItem={actionItem}
      isFirst={isFirst}
      isLast={isLast}
      onClick={() => {}}
      subRow={{
        text: transaction,
        children: (
          <PanelButton
            title="Sign Transaction"
            onClick={() => {}}
            isDisabled={false}
            size={ElementSize.S}
          />
        ),
      }}
    >
      <div></div>
    </ActionItemRow>
  );
}
