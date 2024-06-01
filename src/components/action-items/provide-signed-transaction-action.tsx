import React from "react";
import { ActionItemRow } from "./components/action-item-row";
import {
  ActionItemRequest,
  ActionItemResponse,
  valueToString,
} from "../main/types";
import { ElementSize, PanelButton } from "../buttons/panel-button";
import { UPDATE_ACTION_ITEM } from "../../utils/queries";
import { useMutation } from "@apollo/client";
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
  const [updateActionItem, {}] = useMutation(UPDATE_ACTION_ITEM);

  if (actionType.type !== "ProvideSignedTransaction") {
    throw new Error(
      "ProvideSignedTransactionAction component requires ProvideSignedTransaction action type.",
    );
  }

  const {
    data: { payload, namespace, networkId },
  } = actionType;

  const transaction = valueToString(payload);
  if (transaction === undefined) {
    throw new Error(
      `ProvideSignedTransactionAction component requires string payload, received ${actionType.data.payload}`,
    );
  }

  // insert a zero-width space every other character to allow the text to break as needed
  const displayedValue = transaction.match(/(.{1})/g)?.join("​") || transaction;

  const address = addonManager.getAddress(namespace, networkId);
  const onClick = async () => {
    const signedTxHex = await addonManager.signTransaction(
      namespace,
      networkId,
      address,
      transaction,
    );
    if (signedTxHex !== undefined) {
      const event: ActionItemResponse = {
        actionItemUuid: uuid,
        type: "ProvideSignedTransaction",
        data: {
          signedTransactionBytes: signedTxHex,
        },
      };
      updateActionItem({ variables: { event: JSON.stringify(event) } });
    }
  };
  return (
    <ActionItemRow
      actionItem={actionItem}
      isFirst={isFirst}
      isLast={isLast}
      onClick={() => {}}
      subRow={{
        text: displayedValue,
        children: (
          <PanelButton
            title="Sign Transaction"
            onClick={onClick}
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
