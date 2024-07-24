import { useMutation } from "@apollo/client";
import { ActionItemRequest, ActionItemResponse } from "../main/types";
import { UPDATE_ACTION_ITEM } from "../../utils/queries";
import React from "react";
import { ButtonColor, ElementSize, PanelButton } from "../buttons/panel-button";
import { classNames } from "../../utils/helpers";
import { selectPanelValidationReady } from "../../reducers/runbooks-slice";
import { selectIsOperator } from "../../reducers/participant-auth-slice";
import { useAppSelector } from "../../hooks";

export interface ValidateBlockAction {
  actionItem: ActionItemRequest;
  index: number;
}
export function ValidateBlockAction({
  actionItem,
  index,
}: ValidateBlockAction) {
  const { id, title, actionStatus } = actionItem;
  const { status } = actionStatus;
  const clientIsOperator = useAppSelector(selectIsOperator);
  const validationReady = useAppSelector((state: any) =>
    selectPanelValidationReady(state, id),
  );
  const [updateActionItem, {}] = useMutation(UPDATE_ACTION_ITEM);

  const onClick = () => {
    const event: ActionItemResponse = {
      actionItemId: id,
      type: "ValidateBlock",
    };
    updateActionItem({ variables: { event: JSON.stringify(event) } });
  };
  let isDisabled = !validationReady;
  if (status === "Success") {
    isDisabled = true;
  }
  if (!clientIsOperator) {
    isDisabled = true;
  }

  const color =
    index === 0
      ? ButtonColor.EmeraldSecondary
      : index === 1
        ? ButtonColor.Black
        : ButtonColor.Amber;

  const orderClass =
    index === 0
      ? "order-last ml-8 grow md:grow-0 only:ml-0"
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
