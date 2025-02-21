import React from "react";
import { ActionItemRow, ActionItemSubRow } from "./components/action-item-row";
import { ActionItemRequest, toValue } from "../main/types";
import { Button } from "@txtxrun/txtx-ui-kit";
import { useAppDispatch } from "../../hooks";
import { setModalVisibility } from "../../reducers/runbooks-slice";
import { ReviewInputCell } from "./components/review-input-cell";

export interface OpenModalAction {
  actionItem: ActionItemRequest;
  isFirst: boolean;
  isLast: boolean;
  isCurrent: boolean;
}
export function OpenModalAction({
  actionItem,
  isFirst,
  isLast,
  isCurrent,
}: OpenModalAction) {
  const dispatch = useAppDispatch();
  const { actionType, description, actionStatus } = actionItem;

  if (actionType.type !== "OpenModal") {
    throw new Error(
      "OpenModalAction component requires OpenModal action type.",
    );
  }

  const {
    data: { modalUuid, title },
  } = actionType;
  const onClick = () => {
    dispatch(setModalVisibility([modalUuid, true]));
  };

  let subRow: ActionItemSubRow | undefined = undefined;
  if (actionStatus.status !== "Success") {
    subRow = {
      content: <div>{description || ""}</div>,
      footer: (
        <Button
          onClick={onClick}
          className="uppercase w-full"
          size={Button.ButtonSizes.m}
          variant={Button.ButtonVariants.primary}
        >
          {title}
        </Button>
      ),
    };
  }

  const el =
    actionStatus.status === "Success" ? (
      <ReviewInputCell
        value={toValue(actionStatus.data, "string")}
        actionStatus={actionStatus}
        isCurrent={isCurrent}
      />
    ) : (
      <div></div>
    );

  return (
    <ActionItemRow
      actionItem={actionItem}
      isFirst={isFirst}
      isLast={isLast}
      onClick={() => {}}
      subRow={subRow}
      isCurrent={isCurrent}
    >
      {el}
    </ActionItemRow>
  );
}
