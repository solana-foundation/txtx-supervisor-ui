import { useMutation } from "@apollo/client/react";
import { ActionItemRequest, ActionItemResponse } from "../main/types";
import { UPDATE_ACTION_ITEM } from "../../utils/queries";
import React from "react";
import { Button } from "../ui-kit";
import classnames from "../ui-kit/classnames";
import { useAppDispatch } from "../../hooks";
import {
  selectModalValidationReady,
  setModalVisibility,
} from "../../reducers/runbooks-slice";
import { useSelector } from "react-redux";

export interface ValidateModalAction {
  actionItem: ActionItemRequest;
  index: number;
  modalUuid: string;
}
export function ValidateModalAction({
  actionItem,
  index,
  modalUuid,
}: ValidateModalAction) {
  const { id, constructInstanceName, actionStatus } = actionItem;
  const { status } = actionStatus;
  const validationReady = useSelector((state: any) =>
    selectModalValidationReady(state, id),
  );
  const [updateActionItem, {}] = useMutation(UPDATE_ACTION_ITEM);
  const dispatch = useAppDispatch();

  const onClick = () => {
    const event: ActionItemResponse = {
      actionItemId: id,
      type: "ValidateModal",
    };
    updateActionItem({ variables: { event: JSON.stringify(event) } });
    dispatch(setModalVisibility([modalUuid, false]));
  };

  let isDisabled = !validationReady;
  if (status === "Success") {
    isDisabled = true;
  }

  const orderClass =
    index === 0
      ? "order-last ml-8 "
      : index === 1
        ? ""
        : "grow clear-left float-left order-first";
  return (
    <div className={classnames(" ", orderClass)}>
      <Button
        disabled={isDisabled}
        onClick={onClick}
        className="uppercase w-full"
        size={Button.ButtonSizes.l}
        variant={
          index === 1
            ? Button.ButtonVariants.secondary
            : Button.ButtonVariants.primary
        }
      >
        {constructInstanceName}
      </Button>
    </div>
  );
}
