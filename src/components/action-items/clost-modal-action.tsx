import React from "react";
import { useAppDispatch } from "../../hooks";
import { setModalVisibility } from "../../reducers/runbooks-slice";
import { Button } from "../ui-kit";

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

  return (
    <div>
      <Button
        disabled={isDisabled}
        onClick={onClick}
        className="uppercase w-full"
        size={Button.ButtonSizes.l}
        variant={Button.ButtonVariants.secondary}
      >
        CANCEL
      </Button>
    </div>
  );
}
