import React from "react";
import {
  ActionItemRow,
  ErrorActionItemRow,
} from "./components/action-item-row";
import { ActionItemRequest, ActionItemResponse, toValue } from "../main/types";
import { DisplayValue, ReviewInputCell } from "./components/review-input-cell";
import { Button } from "../ui-kit";
import { UPDATE_ACTION_ITEM } from "../../utils/queries";
import { useMutation } from "@apollo/client/react";
import {
  getPublicKeyFromLocalStorage,
  getStorageKey,
} from "../../utils/helpers";
import classnames from "../ui-kit/classnames";

export interface VerifyThirdPartySignatureAction {
  actionItem: ActionItemRequest;
  isFirst: boolean;
  isLast: boolean;
  isCurrent: boolean;
}
export function VerifyThirdPartySignatureAction({
  actionItem,
  isFirst,
  isLast,
  isCurrent,
}: VerifyThirdPartySignatureAction) {
  let [linkOpened, setLinkOpened] = React.useState(false);
  const [updateActionItem, {}] = useMutation(UPDATE_ACTION_ITEM);
  const { id, actionStatus, actionType } = actionItem;

  if (actionType.type !== "VerifyThirdPartySignature") {
    throw new Error(
      "VerifyThirdPartySignatureAction component requires ProvidePublicKey action type.",
    );
  }

  const { formattedPayload, payload, url, thirdPartyName, signerUuid } =
    actionType.data;
  const { status } = actionStatus;

  const openLinkOnClick = () => {
    window.open(url, "_blank");
    setLinkOpened(true);
  };

  const verifySignatureOnClick = () => {
    const event: ActionItemResponse = {
      actionItemId: id,
      type: "VerifyThirdPartySignature",
      data: {
        signerUuid,
        signatureComplete: true,
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
      isCurrent={isCurrent}
      subRow={{
        content: (
          <DisplayValue
            input={formattedPayload || payload}
            isCurrent={isCurrent}
          />
        ),
        footer: (
          <div className="grow shrink self-stretch flex-col justify-center items-start inline-flex basis-full md:basis-0">
            <div className="self-stretch pr-3 pb-3 pl-3 md:pt-3 justify-end items-start inline-flex">
              <div className="mr-6 order-first">
                <Button
                  onClick={verifySignatureOnClick}
                  disabled={false}
                  size={Button.ButtonSizes.m}
                  variant={Button.ButtonVariants.primary}
                  className={classnames(
                    "uppercase",
                    linkOpened ? "brightness-125" : "brightness-75",
                  )}
                >
                  Check Signature Completion
                </Button>
              </div>
              <Button
                onClick={openLinkOnClick}
                disabled={false}
                size={Button.ButtonSizes.m}
                variant={Button.ButtonVariants.primary}
                className={classnames(
                  "uppercase",
                  linkOpened ? "brightness-75" : "brightness-125",
                )}
              >{`Open ${thirdPartyName}`}</Button>
              <div></div>
            </div>
          </div>
        ),
      }}
    >
      <div></div>
    </ActionItemRow>
  );
}
