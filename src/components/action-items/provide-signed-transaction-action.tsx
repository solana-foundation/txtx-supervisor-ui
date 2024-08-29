import React from "react";
import { ActionItemSubRow } from "./components/action-item-row";
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
  const { id, actionStatus, title, description, actionType } = actionItem;
  const [updateActionItem, {}] = useMutation(UPDATE_ACTION_ITEM);

  if (actionType.type !== "ProvideSignedTransaction") {
    throw new Error(
      "ProvideSignedTransactionAction component requires ProvideSignedTransaction action type.",
    );
  }

  const {
    data: {
      payload,
      namespace,
      networkId,
      signerUuid,
      skippable,
      expectedSignerAddress,
      onlyApprovalNeeded,
    },
  } = actionType;

  const transaction = formatValueForDisplay(payload);

  if (transaction == null || typeof transaction !== "string") {
    throw new Error(
      `ProvideSignedTransactionAction component requires string payload, received ${actionType.data.payload}`,
    );
  }
  // insert a zero-width space every other character to allow the text to break as needed
  const displayedValue = transaction.match(/(.{1})/g)?.join("​") || transaction;

  const alreadySigned = actionStatus.status === "Success";
  const signatureBlocked = actionStatus.status === "Blocked";
  let skippableButtonIsDisabled = !skippable || alreadySigned;

  const onSkipSignature = () => {
    const event: ActionItemResponse = {
      actionItemId: id,
      type: "ProvideSignedTransaction",
      data: {
        signedTransactionBytes: null,
        signerUuid: signerUuid,
        signatureApproved: null,
      },
    };
    updateActionItem({ variables: { event: JSON.stringify(event) } });
  };

  // if only approving the signature, and not the actual signing, is needed in the browser, we can just return that row/button
  if (onlyApprovalNeeded) {
    const onClick = () => {
      const event: ActionItemResponse = {
        actionItemId: id,
        type: "ProvideSignedTransaction",
        data: {
          signedTransactionBytes: null,
          signerUuid: signerUuid,
          signatureApproved: true,
        },
      };
      updateActionItem({ variables: { event: JSON.stringify(event) } });
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
            <div className="self-stretch justify-end items-end gap-2.5 inline-flex">
              {skippable ? (
                <PanelButton
                  title="Skip Signature"
                  onClick={onSkipSignature}
                  isDisabled={skippableButtonIsDisabled}
                  size={ElementSize.L}
                  color={ButtonColor.Black}
                />
              ) : undefined}
              <PanelButton
                title="Approve Transaction"
                onClick={onClick}
                isDisabled={alreadySigned || signatureBlocked}
                size={ElementSize.L}
              />
            </div>
          ),
        }}
      >
        <div></div>
      </SignTransactionRow>
    );
  }

  addonManager.addNetworkInstance(namespace, networkId);

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
            <div className="self-stretch justify-end items-end gap-2.5 inline-flex">
              {skippable ? (
                <PanelButton
                  title="Skip Signature"
                  onClick={onSkipSignature}
                  isDisabled={skippableButtonIsDisabled}
                  size={ElementSize.L}
                  color={ButtonColor.Black}
                />
              ) : undefined}
              <PanelButton
                title="Connect Wallet"
                onClick={onClick}
                isDisabled={false}
                size={ElementSize.L}
              />
            </div>
          ),
        }}
      >
        <div></div>
      </SignTransactionRow>
    );
  }
  const address = addonManager.getAddress(namespace, networkId);
  const onClick = async () => {
    console.log(transaction);
    const signedTxHex = await addonManager.signTransaction(
      namespace,
      networkId,
      address,
      transaction,
    );
    if (signedTxHex !== undefined) {
      const event: ActionItemResponse = {
        actionItemId: id,
        type: "ProvideSignedTransaction",
        data: {
          signedTransactionBytes: signedTxHex,
          signerUuid: signerUuid,
          signatureApproved: null,
        },
      };
      updateActionItem({ variables: { event: JSON.stringify(event) } });
    }
  };

  const isIncorrectSigner =
    expectedSignerAddress != null && address != expectedSignerAddress;
  const signatureButtonIsDisabled =
    alreadySigned || signatureBlocked || isIncorrectSigner;

  return (
    <SignTransactionRow
      actionItem={actionItem}
      isFirst={isFirst}
      isLast={isLast}
      onClick={() => {}}
      subRow={{
        text: displayedValue,
        children: (
          <div className="self-stretch justify-end items-end gap-2.5 inline-flex">
            {skippable ? (
              <PanelButton
                title="Skip Signature"
                onClick={onSkipSignature}
                isDisabled={skippableButtonIsDisabled}
                size={ElementSize.L}
                color={ButtonColor.Black}
              />
            ) : undefined}
            <PanelButton
              title="Sign Transaction"
              onClick={onClick}
              isDisabled={signatureButtonIsDisabled}
              size={ElementSize.L}
            />
          </div>
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

  const isStatusSuccess = status === "Success";
  const isHighlighted = false; // Need to implement https://tppr.me/xkN4je
  const isStateDefault = !isStatusSuccess && !isHighlighted;

  return (
    <div className="w-full">
      <div
        onClick={onClick}
        className={classNames(
          "w-full self-stretch bg-white/opacity-0 justify-start items-start inline-flex cursor-pointer flex-wrap",
          isHighlighted ? "bg-emerald-950" : "bg-gray-950",
        )}
      >
        <div className="w-[46px] flex items-center justify-center self-stretch">
          <div
            className={classNames(
              "w-[20px] aspect-square border border-emerald-500 rounded-full flex items-center justify-center transition-colors hover:border-emerald-500",
              isStatusSuccess ? "border-emerald-500 bg-emerald-500" : "",
              isHighlighted ? "border-emerald-500" : "",
              isStateDefault ? "border-zinc-600" : "",
            )}
          >
            <CheckIcon
              className={classNames(
                "w-[16px] aspect-square transition-opacity",
                !isStatusSuccess ? "opacity-0" : "",
              )}
            />
          </div>
        </div>

        <div className="test grow shrink basis-0 self-stretch flex-col justify-center items-start inline-flex">
          <div className="self-stretch py-3.5 md:py-[18px] justify-start items-start inline-flex">
            <div
              className={classNames(
                "grow shrink basis-0 text-sm font-normal font-inter leading-[18.20px]",
                isStatusSuccess ? "text-emerald-620" : "",
                isHighlighted ? "text-emerald-500" : "",
                isStateDefault ? "text-stone-500" : "",
              )}
            >
              {description ? `${description} (${title})` : title}
            </div>
          </div>
        </div>

        {children}

        {/* The below gives us the rounded top right corner of the row*/}
        {/*<div
          className={classNames(
            "w-1 self-stretch bg-gray-950  flex-col justify-center items-start inline-flex",
            isFirst ? "rounded-tr" : isLast ? "rounded-br" : "",
          )}
        ></div>*/}
      </div>

      {subRow ? <ActionItemSubRow {...subRow} /> : undefined}

      {!isLast && <div className="border-b border-gray-800" />}
    </div>
  );
}
