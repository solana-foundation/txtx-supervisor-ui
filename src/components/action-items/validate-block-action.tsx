import { useMutation } from "@apollo/client/react";
import { ActionItemRequest, ActionItemResponse } from "../../types/runbook";
import { UPDATE_ACTION_ITEM } from "../../utils/queries";
import React from "react";
import classNames from "../ui/class-names";
import { selectPanelValidationReady } from "../../reducers/runbooks-slice";
import { useAppSelector } from "../../hooks";
import { Button } from "../ui";

export interface ValidateBlockAction {
  actionItem: ActionItemRequest;
  index: number;
}
export function ValidateBlockAction({
  actionItem,
  index,
}: ValidateBlockAction) {
  const { id, constructInstanceName, actionStatus } = actionItem;
  const { status } = actionStatus;
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

  const orderClass =
    index === 0
      ? "order-last ml-8 grow md:grow-0 only:ml-0"
      : index === 1
        ? ""
        : "grow clear-left float-left order-first";
  return (
    <div className={classNames(" ", orderClass)}>
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
