import React from "react";
import {
  ActionItemSubRow,
  ErrorActionItemRow,
} from "./components/action-item-row";
import {
  ActionItemRequest,
  ActionItemResponse,
  formatValueForDisplay,
} from "../main/types";
import { ButtonColor, ElementSize, PanelButton } from "../buttons/panel-button";
import { UPDATE_ACTION_ITEM } from "../../utils/queries";
import { useMutation } from "@apollo/client";
import addonManager from "../../utils/addons-initializer";
import { classNames } from "../../utils/helpers";
import { CheckIcon } from "@heroicons/react/20/solid";
import { SignTransactionRow } from "./provide-signed-transaction-action";

export interface SendTransactionAction {
  actionItem: ActionItemRequest;
  isFirst: boolean;
  isLast: boolean;
  isCurrent: boolean;
}
export function SendTransactionAction({
  actionItem,
  isFirst,
  isLast,
  isCurrent,
}: SendTransactionAction) {
  const { id, actionStatus, title, description, actionType } = actionItem;
  const [updateActionItem, {}] = useMutation(UPDATE_ACTION_ITEM);

  if (actionType.type !== "SendTransaction") {
    throw new Error(
      "SendTransaction component requires SendTransaction action type.",
    );
  }

  const {
    data: {
      payload,
      formattedPayload,
      namespace,
      networkId,
      signerUuid,
      expectedSignerAddress,
    },
  } = actionType;

  const transaction = formatValueForDisplay(payload);

  if (transaction == null || typeof transaction !== "string") {
    throw new Error(
      `SignTransaction component requires string payload, received ${actionType.data.payload}`,
    );
  }
  // insert a zero-width space every other character to allow the text to break as needed
  const displayedValue =
    formattedPayload || transaction.match(/(.{1})/g)?.join("​") || transaction;

  const alreadySigned = actionStatus.status === "Success";
  const signatureBlocked = actionStatus.status === "Blocked";

  addonManager.addNetworkInstance(namespace, networkId);

  const isWalletConnectedResult = addonManager.isWalletConnected(
    namespace,
    networkId,
  );
  if (isWalletConnectedResult.is_err()) {
    return (
      <ErrorActionItemRow
        error={isWalletConnectedResult.unwrap_err()}
        originalActionItem={actionItem}
        isFirst={isFirst}
        isLast={isLast}
        isCurrent={isCurrent}
      />
    );
  }
  const isWalletConnected = isWalletConnectedResult.unwrap();

  let onClick;
  let primaryButtonTitle;
  let primaryButtonIsDisabled;
  if (!isWalletConnected) {
    onClick = async () => {
      await addonManager.connectWallet(namespace, networkId);
    };
    primaryButtonTitle = "Connect Wallet";
    primaryButtonIsDisabled = false;
  } else {
    const addressResult = addonManager.getAddress(namespace, networkId);
    if (addressResult.is_err()) {
      return (
        <ErrorActionItemRow
          error={addressResult.unwrap_err()}
          originalActionItem={actionItem}
          isFirst={isFirst}
          isLast={isLast}
          isCurrent={isCurrent}
        />
      );
    }
    const address = addressResult.unwrap();

    onClick = async () => {
      const sendTxResult = await addonManager.sendTransaction(
        namespace,
        networkId,
        address,
        transaction,
      );
      if (addressResult.is_err()) {
        // todo: we need a way to set an error state that can be displayed on the page
      } else {
        const txHash = sendTxResult.unwrap();
        const event: ActionItemResponse = {
          actionItemId: id,
          type: "SendTransaction",
          data: {
            transactionHash: txHash,
            signerUuid: signerUuid,
          },
        };
        updateActionItem({ variables: { event: JSON.stringify(event) } });
      }
    };
    primaryButtonTitle = "Send Transaction";
    const isIncorrectSigner =
      expectedSignerAddress != null && address != expectedSignerAddress;
    primaryButtonIsDisabled =
      alreadySigned || signatureBlocked || isIncorrectSigner;
  }

  return (
    <SignTransactionRow
      actionItem={actionItem}
      isFirst={isFirst}
      isLast={isLast}
      onClick={() => {}}
      isCurrent={isCurrent}
      subRow={{
        text: displayedValue,
        children: (
          <div className="justify-end items-end gap-2.5 inline-flex">
            <PanelButton
              title={primaryButtonTitle}
              onClick={onClick}
              isDisabled={primaryButtonIsDisabled}
              size={ElementSize.L}
              color={
                isCurrent ? ButtonColor.ActiveEmerald : ButtonColor.Emerald
              }
            />
          </div>
        ),
      }}
    >
      <div></div>
    </SignTransactionRow>
  );
}
