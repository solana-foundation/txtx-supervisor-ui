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

export interface ProvideSignedTransactionAction {
  actionItem: ActionItemRequest;
  isFirst: boolean;
  isLast: boolean;
  isCurrent: boolean;
}
export function ProvideSignedTransactionAction({
  actionItem,
  isFirst,
  isLast,
  isCurrent,
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
      formattedPayload,
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
  const displayedValue =
    formattedPayload || transaction.match(/(.{1})/g)?.join("​") || transaction;

  const alreadySigned = actionStatus.status === "Success";
  const signatureBlocked = actionStatus.status === "Blocked";
  let skippableButtonIsDisabled = !skippable || alreadySigned;

  const onSkipSignature = () => {
    const event: ActionItemResponse = {
      actionItemId: id,
      type: "ProvideSignedTransaction",
      data: {
        signedTransactionResult: null,
        signerUuid: signerUuid,
        signatureApproved: null,
      },
    };
    updateActionItem({ variables: { event: JSON.stringify(event) } });
  };

  let onClick;
  let primaryButtonTitle;
  let primaryButtonIsDisabled;
  if (onlyApprovalNeeded) {
    onClick = () => {
      const event: ActionItemResponse = {
        actionItemId: id,
        type: "ProvideSignedTransaction",
        data: {
          signedTransactionResult: null,
          signerUuid: signerUuid,
          signatureApproved: true,
        },
      };
      updateActionItem({ variables: { event: JSON.stringify(event) } });
    };
    primaryButtonTitle = "Approve Transaction";
    primaryButtonIsDisabled = alreadySigned || signatureBlocked;
  } else {
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
        />
      );
    }
    const isWalletConnected = isWalletConnectedResult.unwrap();

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
          />
        );
      }
      const address = addressResult.unwrap();

      onClick = async () => {
        console.log(transaction);
        const signTxResult = await addonManager.signTransaction(
          namespace,
          networkId,
          address,
          transaction,
        );
        if (addressResult.is_err()) {
          // todo: we need a way to set an error state that can be displayed on the page
        } else {
          const result = signTxResult.unwrap();
          const event: ActionItemResponse = {
            actionItemId: id,
            type: "ProvideSignedTransaction",
            data: {
              signedTransactionResult: result,
              signerUuid: signerUuid,
              signatureApproved: null,
            },
          };
          updateActionItem({ variables: { event: JSON.stringify(event) } });
        }
      };
      primaryButtonTitle = "Sign Transaction";
      const isIncorrectSigner =
        expectedSignerAddress != null && address != expectedSignerAddress;
      primaryButtonIsDisabled =
        alreadySigned || signatureBlocked || isIncorrectSigner;
    }
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
          <div className="justify-end items-end gap-2.5 inline-flex">
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
              title={primaryButtonTitle}
              onClick={onClick}
              isDisabled={primaryButtonIsDisabled}
              size={ElementSize.L}
            />
          </div>
        ),
      }}
      isCurrent={isCurrent}
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
  isCurrent: boolean;
}
function SignTransactionRow({
  actionItem,
  isFirst,
  isLast,
  children,
  onClick,
  subRow,
  isCurrent,
}: SignTransactionRow & { children: React.ReactNode }) {
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
  const isStateDefault = !isStatusSuccess && !isCurrent;

  return (
    <div className="w-full relative">
      {/* Header Row */}
      <div
        onClick={onClick}
        className={classNames(
          "w-full self-stretch bg-white/opacity-0 justify-start items-start inline-flex cursor-pointer flex-wrap",
          isCurrent ? "bg-emerald-950" : "bg-gray-950",
        )}
      >
        <div className="w-[46px] flex items-center justify-center self-stretch">
          <div
            className={classNames(
              "w-[20px] aspect-square border border-emerald-500 rounded-full flex items-center justify-center transition-colors hover:border-emerald-500",
              isStatusSuccess ? "border-emerald-500 bg-emerald-500" : "",
              isCurrent ? "border-emerald-500" : "",
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

        <div className="grow shrink basis-0 self-stretch flex-col justify-center items-start inline-flex">
          <div className="self-stretch py-3.5 md:py-[18px] justify-start items-start inline-flex">
            <div
              className={classNames(
                "grow shrink basis-0 text-sm font-normal font-inter leading-[18.20px]",
                isStatusSuccess ? "text-emerald-620" : "",
                isCurrent ? "text-emerald-500" : "",
                isStateDefault ? "text-stone-500" : "",
              )}
            >
              {description ? `${description} (${title})` : title}
            </div>
          </div>
        </div>
      </div>

      {/* Sub Row */}
      {subRow ? <ActionItemSubRow {...subRow} /> : undefined}
      {/* Border */}
      {!isLast && <div className="border-b border-gray-800" />}
    </div>
  );
}
