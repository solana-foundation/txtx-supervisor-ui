import React from "react";
import { ErrorActionItemRow } from "./components/action-item-row";
import { ActionItemRequest, ActionItemResponse } from "../main/types";
import { Button } from "@txtxrun/txtx-ui-kit";
import { UPDATE_ACTION_ITEM } from "../../utils/queries";
import { useMutation } from "@apollo/client";
import addonManager from "../../utils/addons-initializer";
import {
  SignTransactionRow,
  valueToStringForSignature,
} from "./provide-signed-transaction-action";
import { useAppDispatch } from "../../hooks";
import { pushError } from "../../reducers/error-slice";
import { DisplayValue } from "./components/review-input-cell";

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
  const dispatch = useAppDispatch();

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
      dispatch(pushError(addressResult.unwrap_err()));
      return;
    }
    const address = addressResult.unwrap();

    onClick = async () => {
      const sendTxResult = await addonManager.sendTransaction(
        namespace,
        networkId,
        address,
        valueToStringForSignature(payload),
      );
      if (sendTxResult.is_err()) {
        dispatch(pushError(sendTxResult.unwrap_err()));
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
        content: (
          <DisplayValue
            input={formattedPayload || payload}
            isCurrent={isCurrent}
          />
        ),
        footer: (
          <div className="justify-end items-end gap-2.5 inline-flex">
            <Button
              disabled={primaryButtonIsDisabled}
              onClick={onClick}
              className="uppercase w-full"
              size={Button.ButtonSizes.l}
              variant={Button.ButtonVariants.primary}
            >
              {primaryButtonTitle}
            </Button>
          </div>
        ),
      }}
    >
      <div></div>
    </SignTransactionRow>
  );
}
