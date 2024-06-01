import { useMutation } from "@apollo/client";
import { ActionItemRequest, ActionItemResponse } from "../main/types";
import { UPDATE_ACTION_ITEM } from "../../utils/queries";
import React from "react";
import { ElementSize, PanelButton } from "../buttons/panel-button";

export interface ValidatePanelAction {
  actionItem: ActionItemRequest;
}
export function ValidatePanelAction({ actionItem }: ValidatePanelAction) {
  const { uuid, title, actionStatus } = actionItem;
  const { status } = actionStatus;
  const [updateActionItem, {}] = useMutation(UPDATE_ACTION_ITEM);

  const onClick = () => {
    const event: ActionItemResponse = {
      actionItemUuid: uuid,
      type: "ValidatePanel",
    };
    updateActionItem({ variables: { event: JSON.stringify(event) } });
  };

  let isDisabled = false;
  if (status === "Success") {
    isDisabled = true;
  }
  return (
    <div className="self-stretch flex-col justify-center items-start inline-flex">
      <div className="self-stretch py-2.5 justify-end items-start inline-flex">
        <PanelButton
          title={title}
          onClick={onClick}
          isDisabled={isDisabled}
          size={ElementSize.L}
        />
      </div>
    </div>
  );
}
