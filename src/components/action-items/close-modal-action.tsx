import React from "react";
import { useAppDispatch } from "../../hooks";
import { setModalVisibility } from "../../reducers/runbooks-slice";
import { Button } from "../ui";

export interface CloseModalAction {
  modalUuid: string;
}
export function CloseModalAction({ modalUuid }: CloseModalAction) {
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(setModalVisibility([modalUuid, false]));
  };

  return (
    <div>
      <Button
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
