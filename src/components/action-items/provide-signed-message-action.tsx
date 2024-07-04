import React from "react";
import { ActionItemRow, ActionItemSubRow } from "./components/action-item-row";
import {
  ActionItemRequest,
  ActionItemResponse,
  formatValueForDisplay,
} from "../main/types";
import { ElementSize, PanelButton } from "../buttons/panel-button";
import { UPDATE_ACTION_ITEM } from "../../utils/queries";
import { useMutation } from "@apollo/client";
import addonManager from "../../utils/addons-initializer";
import { ReviewInputCell } from "./components/review-input-cell";
import { classNames } from "../../utils/helpers";

export interface ProvideSignedMessageAction {
  actionItem: ActionItemRequest;
  isFirst: boolean;
  isLast: boolean;
}
export function ProvideSignedMessageAction({
  actionItem,
  isFirst,
  isLast,
}: ProvideSignedMessageAction) {
  const { id, actionStatus, title, description, actionType } = actionItem;
  const [updateActionItem, {}] = useMutation(UPDATE_ACTION_ITEM);

  if (actionType.type !== "ProvideSignedMessage") {
    throw new Error(
      "ProvideSignedMessageAction component requires ProvideSignedMessage action type.",
    );
  }

  const {
    data: { message, namespace, networkId, signerUuid },
  } = actionType;

  addonManager.addNetworkInstance(namespace, networkId);
  const msgStr = formatValueForDisplay(message);
  if (msgStr == null || typeof msgStr !== "string") {
    throw new Error(
      `ProvideSignedMessageAction component requires string payload, received ${actionType.data.message}`,
    );
  }

  // insert a zero-width space every other character to allow the text to break as needed
  const displayedValue = msgStr.match(/(.{1})/g)?.join("​") || msgStr;

  const isWalletConnected = addonManager.isWalletConnected(
    namespace,
    networkId,
  );
  if (!isWalletConnected) {
    const onClick = async () => {
      await addonManager.connectWallet(namespace, networkId);
    };
    return (
      <SignTransactionRow
        actionItem={actionItem}
        isFirst={isFirst}
        isLast={isLast}
        onClick={() => {}}
        subRow={{
          text: displayedValue,
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
      </SignTransactionRow>
    );
  }

  const address = addonManager.getAddress(namespace, networkId);
  const onClick = async () => {
    const signedMessage = await addonManager.signMessage(
      namespace,
      networkId,
      address,
      msgStr,
    );
    return;
    // if (signedMessage !== undefined) {
    //   const event: ActionItemResponse = {
    //     actionItemUuid: uuid,
    //     type: "ProvideSignedMessage",
    //     data: {
    //       signerUuid,
    //       signedMessageBytes: signedMessage,
    //     },
    //   };
    //   updateActionItem({ variables: { event: JSON.stringify(event) } });
    // }
  };

  let isDisabled = false;
  if (actionStatus.status === "Success") {
    isDisabled = true;
  }
  return (
    <SignTransactionRow
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
            isDisabled={isDisabled}
            size={ElementSize.S}
          />
        ),
      }}
    >
      <div></div>
    </SignTransactionRow>
  );
}

interface SignTransactionRow {
  actionItem: ActionItemRequest;
  isFirst: boolean;
  isLast: boolean;
  onClick: any;
  subRow?: ActionItemSubRow;
}
function SignTransactionRow({
  actionItem,
  isFirst,
  isLast,
  children,
  onClick,
  subRow,
}: SignTransactionRow & { children }) {
  const { index, title, description, actionStatus } = actionItem;
  const { status } = actionStatus;
  // todo: handle other statuses
  let checkClass;
  if (status === "Todo") {
    checkClass = "text-white";
  } else if (status === "Success") {
    checkClass = "text-emerald-500";
  } else if (status === "Error") {
    const diag = actionStatus.data;
    checkClass = "text-rose-400";
    subRow = { text: diag.message };
  }

  return (
    <div className="w-full">
      <div
        onClick={onClick}
        className={classNames(
          "w-full self-stretch bg-white/opacity-0 justify-start items-start inline-flex cursor-pointer border-gray-800",
          isFirst ? "rounded-t border-b" : isLast ? "rounded-b" : "border-b",
        )}
      >
        <div
          className={classNames(
            "w-8 self-stretch bg-gray-950 border-r border-gray-800 flex-col justify-between items-start inline-flex",
            isFirst ? "rounded-tl" : isLast ? "rounded-bl" : "",
          )}
        >
          <div className="self-stretch py-2.5 justify-center items-center inline-flex">
            <div className="text-stone-500 text-sm font-normal font-inter leading-[18.20px]">
              #
            </div>
            <div className="text-white text-sm font-normal font-inter leading-[18.20px]">
              {index + 1}
            </div>
          </div>
        </div>

        <div className="test grow shrink basis-0 self-stretch bg-gray-950 border-l border-gray-800 flex-col justify-center items-start inline-flex">
          <div className="self-stretch px-3 py-2.5 justify-start items-start inline-flex">
            <div className="grow shrink basis-0 text-gray-400 text-sm font-normal font-inter leading-[18.20px]">
              {description ? `${description} (${title})` : title}
            </div>
          </div>
        </div>

        {children}

        {/* The below gives us the rounded top right corner of the row*/}
        <div
          className={classNames(
            "w-1 self-stretch bg-gray-950  flex-col justify-center items-start inline-flex",
            isFirst ? "rounded-tr" : isLast ? "rounded-br" : "",
          )}
        ></div>
      </div>
      {subRow ? <ActionItemSubRow {...subRow} /> : undefined}
    </div>
  );
}
