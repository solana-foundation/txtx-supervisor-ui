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

export interface ProvidePublicKeyAction {
  actionItem: ActionItemRequest;
  isFirst: boolean;
  isLast: boolean;
}
export function ProvidePublicKeyAction({
  actionItem,
  isFirst,
  isLast,
}: ProvidePublicKeyAction) {
  const { id, actionStatus, actionType } = actionItem;

  if (actionType.type !== "ProvidePublicKey") {
    throw new Error(
      "ProvidePublicKeyAction component requires ProvidePublicKey action type.",
    );
  }

  const { namespace, networkId, message } = actionType.data;
  const { status } = actionStatus;
  addonManager.addNetworkInstance(namespace, networkId);

  const [updateActionItem, {}] = useMutation(UPDATE_ACTION_ITEM);

  const isWalletConnected = addonManager.isWalletConnected(
    namespace,
    networkId,
  );
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
          text: message,
          children: (
            <PanelButton
              title="Connect Wallet"
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
  } else {
    const address = addonManager.getAddress(namespace, networkId);

    if (status === "Todo") {
      const publicKeyFromStorage = getPublicKeyFromLocalStorage(
        getStorageKey(namespace),
        address,
      );

      if (publicKeyFromStorage === undefined) {
        const onClick = async () => {
          let publicKey = await addonManager.getPublicKey(
            namespace,
            networkId,
            address,
            message,
          );
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
              text: message,
              children: (
                <PanelButton
                  title="Provide Public Key"
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
          >
            <ReviewInputCell
              value={address}
              actionStatus={actionItem.actionStatus}
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
        >
          <ReviewInputCell
            value={address}
            actionStatus={actionItem.actionStatus}
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
            text: statusData.message,
            children: (
              <PanelButton
                title="Disconnect Wallet"
                onClick={onClick}
                isDisabled={false}
                size={ElementSize.S}
              />
            ),
          }}
        >
          <ReviewInputCell
            value={address}
            actionStatus={actionItem.actionStatus}
          />
        </ActionItemRow>
      );
    }
  }
}
