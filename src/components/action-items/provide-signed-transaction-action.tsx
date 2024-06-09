import React from "react";
import { ActionItemSubRow } from "./components/action-item-row";
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
  const { uuid, actionStatus, title, description, actionType } = actionItem;
  const [updateActionItem, {}] = useMutation(UPDATE_ACTION_ITEM);

  if (actionType.type !== "ProvideSignedTransaction") {
    throw new Error(
      "ProvideSignedTransactionAction component requires ProvideSignedTransaction action type.",
    );
  }

  const {
    data: { payload, namespace, networkId },
  } = actionType;

  const transaction = formatValueForDisplay(payload);
  if (transaction == null || typeof transaction !== "string") {
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
            isDisabled={false}
            size={ElementSize.S}
          />
        ),
      }}
    >
      <ReviewInputCell
        value={description ? `${description} (${title})` : title}
        actionStatus={actionStatus}
      />
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
              Sign Transaction
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
