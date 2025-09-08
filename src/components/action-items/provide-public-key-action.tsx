import React from "react";
import {
  ActionItemRow,
  ErrorActionItemRow,
} from "./components/action-item-row";
import { ActionItemRequest, ActionItemResponse, toValue } from "../main/types";
import { ReviewInputCell } from "./components/review-input-cell";
import { Button } from "@txtxrun/txtx-ui-kit";
import { UPDATE_ACTION_ITEM } from "../../utils/queries";
import { useMutation } from "@apollo/client/react";
import {
  getPublicKeyFromLocalStorage,
  getStorageKey,
} from "../../utils/helpers";
import addonManager from "../../utils/addons-initializer";

export interface ProvidePublicKeyAction {
  actionItem: ActionItemRequest;
  isFirst: boolean;
  isLast: boolean;
  isCurrent: boolean;
}
export function ProvidePublicKeyAction({
  actionItem,
  isFirst,
  isLast,
  isCurrent,
}: ProvidePublicKeyAction) {
  const [updateActionItem, {}] = useMutation(UPDATE_ACTION_ITEM);
  const { id, actionStatus, actionType } = actionItem;

  if (actionType.type !== "ProvidePublicKey") {
    throw new Error(
      "ProvidePublicKeyAction component requires ProvidePublicKey action type.",
    );
  }

  const { namespace, networkId, message } = actionType.data;
  const { status } = actionStatus;
  const addNetworkResult = addonManager.addNetworkInstance(
    namespace,
    networkId,
  );

  if (addNetworkResult.is_err()) {
    return (
      <ErrorActionItemRow
        error={addNetworkResult.unwrap_err()}
        originalActionItem={actionItem}
        isFirst={isFirst}
        isLast={isLast}
        isCurrent={isCurrent}
      />
    );
  }

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
  if (!isWalletConnected) {
    const onClick = async () => {
      await addonManager.connectWallet(namespace, networkId);
    };
    return (
      <ActionItemRow
        actionItem={actionItem}
        isFirst={isFirst}
        isLast={isLast}
        onClick={() => {}}
        subRow={{
          content: <div>{message}</div>,
          footer: (
            <Button
              onClick={onClick}
              className="uppercase w-full"
              size={Button.ButtonSizes.l}
              variant={Button.ButtonVariants.primary}
            >
              Connect Wallet
            </Button>
          ),
        }}
        isCurrent={isCurrent}
      >
        <div></div>
      </ActionItemRow>
    );
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

    if (status === "Todo") {
      const publicKeyFromStorage = getPublicKeyFromLocalStorage(
        getStorageKey(namespace),
        address,
      );

      if (publicKeyFromStorage === undefined) {
        const onClick = async () => {
          const publicKeyResult = await addonManager.getPublicKey(
            namespace,
            networkId,
            address,
            message,
          );
          if (publicKeyResult.is_err()) {
            return (
              <ErrorActionItemRow
                error={publicKeyResult.unwrap_err()}
                originalActionItem={actionItem}
                isFirst={isFirst}
                isLast={isLast}
                isCurrent={isCurrent}
              />
            );
          }
          const publicKey = publicKeyResult.unwrap();
          if (publicKey === undefined) {
            throw new Error("failed to fetch public key");
          }
          const event: ActionItemResponse = {
            actionItemId: id,
            type: "ProvidePublicKey",
            data: {
              publicKey,
            },
          };
          updateActionItem({ variables: { event: JSON.stringify(event) } });
        };

        return (
          <ActionItemRow
            actionItem={actionItem}
            isFirst={isFirst}
            isLast={isLast}
            onClick={() => {}}
            subRow={{
              content: <div>{message}</div>,
              footer: (
                <Button
                  onClick={onClick}
                  className="uppercase w-full"
                  size={Button.ButtonSizes.l}
                  variant={Button.ButtonVariants.primary}
                >
                  Provide Public Key
                </Button>
              ),
            }}
            isCurrent={isCurrent}
          >
            <div></div>
          </ActionItemRow>
        );
      } else {
        const onClick = () => {
          const event: ActionItemResponse = {
            actionItemId: id,
            type: "ProvidePublicKey",
            data: {
              publicKey: publicKeyFromStorage,
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
              value={toValue(address, "string")}
              actionStatus={actionItem.actionStatus}
              isCurrent={isCurrent}
            />
          </ActionItemRow>
        );
      }
    } else if (status === "Success") {
      const onClick = () => {};
      return (
        <ActionItemRow
          actionItem={actionItem}
          isFirst={isFirst}
          isLast={isLast}
          onClick={onClick}
          isCurrent={isCurrent}
        >
          <ReviewInputCell
            value={toValue(address, "string")}
            actionStatus={actionItem.actionStatus}
            isCurrent={isCurrent}
          />
        </ActionItemRow>
      );
    } else if (status === "Error") {
      const statusData = actionStatus.data;
      const onClick = () => {
        addonManager.disconnectWallet(namespace, networkId);
      };
      return (
        <ActionItemRow
          actionItem={actionItem}
          isFirst={isFirst}
          isLast={isLast}
          onClick={() => {}}
          subRow={{
            content: <div>{statusData.message}</div>,
            footer: (
              <Button
                onClick={onClick}
                className="uppercase w-full"
                size={Button.ButtonSizes.l}
                variant={Button.ButtonVariants.primary}
              >
                Disconnect Wallet
              </Button>
            ),
          }}
          isCurrent={isCurrent}
        >
          <ReviewInputCell
            value={toValue(address, "string")}
            actionStatus={actionItem.actionStatus}
            isCurrent={isCurrent}
          />
        </ActionItemRow>
      );
    }
  }
}
