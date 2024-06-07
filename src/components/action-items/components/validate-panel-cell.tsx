import React from "react";
import { ActionItemRequest } from "../main/types";
import { ElementSize, PanelButton } from "../buttons/panel-button";

export interface ValidatePanelCell {
  actionItem: ActionItemRequest;
  onClick: any;
}
export function ValidatePanelCell({ actionItem, onClick }: ValidatePanelCell) {
  const { title, actionStatus } = actionItem;
  const { status } = actionStatus;

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
          size={ElementSize.XXXL}
        />
      </div>
    </div>
  );
}
