import React from "react";
import {
  ActionItemSubRow,
  ActionItemTitle,
  ErrorActionItemRow,
} from "./shared/action-item-row";
import { ActionItemRequest, ActionItemResponse, Value } from "../../types/runbook";
import { Button } from "../ui";
import { UPDATE_ACTION_ITEM } from "../../utils/queries";
import { useMutation } from "@apollo/client/react";
import addonManager from "../../utils/addons-initializer";
import classNames from "../ui/class-names";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useAppDispatch } from "../../hooks";
import { pushError } from "../../reducers/error-slice";
import { DisplayValue } from "./shared/review-input-cell";

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
  const { id, actionStatus, actionType } = actionItem;
  const [updateActionItem, {}] = useMutation(UPDATE_ACTION_ITEM);
  const dispatch = useAppDispatch();

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

  let onClick;
  let primaryButtonTitle;
  let primaryButtonIsDisabled;
  if (onlyApprovalNeeded) {
    onClick = () => {
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
          isCurrent={isCurrent}
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
        dispatch(pushError(addressResult.unwrap_err()));
        return;
      }
      const address = addressResult.unwrap();

      onClick = async () => {
        const signTxResult = await addonManager.signTransaction(
          namespace,
          networkId,
          address,
          valueToStringForSignature(payload),
        );
        if (signTxResult.is_err()) {
          dispatch(pushError(signTxResult.unwrap_err()));
        } else {
          const result = signTxResult.unwrap();
          const event: ActionItemResponse = {
            actionItemId: id,
            type: "ProvideSignedTransaction",
            data: {
              signedTransactionBytes: result,
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
        content: (
          <DisplayValue
            input={formattedPayload || payload}
            isCurrent={isCurrent}
          />
        ),
        footer: (
          <div className="justify-end items-end gap-2.5 inline-flex">
            {skippable ? (
              <Button
                onClick={onSkipSignature}
                className="uppercase w-full"
                size={Button.ButtonSizes.l}
                disabled={skippableButtonIsDisabled}
                variant={Button.ButtonVariants.secondary}
              >
                Skip Signature
              </Button>
            ) : undefined}
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
export function SignTransactionRow({
  actionItem,
  isFirst,
  isLast,
  children,
  onClick,
  subRow,
  isCurrent,
}: SignTransactionRow & { children: React.ReactNode }) {
  const {
    constructInstanceName,
    description,
    actionStatus,
    metaDescription,
    internalKey,
    markdown,
  } = actionItem;
  const { status } = actionStatus;

  const isStatusSuccess = status === "Success";
  const isStatusError = status === "Error";
  const isStateDefault = !isStatusSuccess && !isCurrent;
  subRow = isStatusError
    ? { content: <div>{actionStatus.data.message}</div> }
    : subRow;

  return (
    <div className="w-full relative">
      {/* Header Row */}
      <div
        onClick={onClick}
        className={classNames(
          "w-full self-stretch bg-white/opacity-0 justify-start items-start inline-flex cursor-pointer flex-wrap rounded-t",
          isCurrent ? "bg-emerald-950" : "bg-gray-950",
        )}
      >
        <div className="w-full self-stretch justify-start items-start inline-flex">
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
                <ActionItemTitle
                  constructInstanceName={constructInstanceName}
                  description={description}
                  metaDescription={metaDescription}
                  internalKey={internalKey}
                  isCurrent={isCurrent}
                  markdown={markdown}
                />
              </div>
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

export function valueToStringForSignature(input: Value): string {
  const { type, value } = input;
  if (value == null) {
    throw new Error("Null values are not supported for signing");
  }
  if (type === "buffer" || type === "string") {
    return value;
  } else if (type === "bool") {
    throw new Error("Boolean values are not supported for signing");
  } else if (type === "integer") {
    throw new Error("Integer values are not supported for signing");
  } else if (type === "null") {
    throw new Error("Null values are not supported for signing");
  } else if (type === "array" && Array.isArray(value)) {
    throw new Error("Array values are not supported for signing");
  } else if (type === "object" && typeof value === "object") {
    throw new Error("Object values are not supported for signing");
  } else {
    return value.toString();
  }
}
