import React from "react";
import { ActionItemRow } from "./components/action-item-row";
import { ActionItemRequest } from "../main/types";
import { ElementSize, PanelButton } from "../buttons/panel-button";
import { useAppDispatch } from "../../hooks";
import { setModalVisibility } from "../../reducers/runbooks-slice";
import { ReviewInputCell } from "./components/review-input-cell";

export interface OpenModalAction {
  actionItem: ActionItemRequest;
  isFirst: boolean;
  isLast: boolean;
}
export function OpenModalAction({
  actionItem,
  isFirst,
  isLast,
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

  let subRow;
  if (actionStatus.status !== "Success") {
    subRow = {
      text: description,
      children: (
        <PanelButton
          title={title}
          onClick={onClick}
          isDisabled={false}
          size={ElementSize.M}
        />
      ),
    };
  }

  const el =
    actionStatus.status === "Success" ? (
      <ReviewInputCell value={actionStatus.data} actionStatus={actionStatus} />
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
      isCurrent={false}
    >
      {el}
    </ActionItemRow>
  );
}
