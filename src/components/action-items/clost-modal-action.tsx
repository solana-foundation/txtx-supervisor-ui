import React from "react";
import { useAppDispatch } from "../../hooks";
import { setModalVisibility } from "../../reducers/runbooks-slice";
import { ButtonColor, ElementSize, PanelButton } from "../buttons/panel-button";

export interface CloseModalAction {
  modalUuid: string;
}
export function CloseModalAction({ modalUuid }: CloseModalAction) {
  const dispatch = useAppDispatch();
  const onClick = () => {
    dispatch(setModalVisibility([modalUuid, false]));
  };

  let isDisabled = false;
  if (status === "Success") {
    isDisabled = true;
  }

  const color = ButtonColor.Black;

  return (
    <div>
      <PanelButton
        title="Cancel"
        onClick={onClick}
        isDisabled={isDisabled}
        size={ElementSize.L}
        color={color}
      />
    </div>
  );
}
