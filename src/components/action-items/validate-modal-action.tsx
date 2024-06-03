import { useMutation } from "@apollo/client";
import { ActionItemRequest, ActionItemResponse } from "../main/types";
import { UPDATE_ACTION_ITEM } from "../../utils/queries";
import React from "react";
import { ButtonColor, ElementSize, PanelButton } from "../buttons/panel-button";
import { classNames } from "../../utils/helpers";

export interface ValidateModalAction {
  actionItem: ActionItemRequest;
  index: number;
}
export function ValidateModalAction({
  actionItem,
  index,
}: ValidateModalAction) {
  const { uuid, title, actionStatus } = actionItem;
  const { status } = actionStatus;
  const [updateActionItem, {}] = useMutation(UPDATE_ACTION_ITEM);

  const onClick = () => {
    const event: ActionItemResponse = {
      actionItemUuid: uuid,
      type: "ValidateModal",
    };
    updateActionItem({ variables: { event: JSON.stringify(event) } });
  };

  let isDisabled = false;
  if (status === "Success") {
    isDisabled = true;
  }

  const color =
    index === 0
      ? ButtonColor.Emerald
      : index === 1
        ? ButtonColor.Black
        : ButtonColor.Amber;

  const orderClass =
    index === 0
      ? "order-last ml-8 "
      : index === 1
        ? ""
        : "grow clear-left float-left order-first";
  return (
    <div className={classNames(" ", orderClass)}>
      <PanelButton
        title={title}
        onClick={onClick}
        isDisabled={isDisabled}
        size={ElementSize.L}
        color={color}
      />
    </div>
  );
}
