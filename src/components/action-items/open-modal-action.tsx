import React from "react";
import { ActionItemRow } from "./components/action-item-row";
import { ActionItemRequest } from "../main/types";
import { ElementSize, PanelButton } from "../buttons/panel-button";
import { useAppDispatch } from "../../hooks";
import { setModalVisibility } from "../../reducers/runbooks-slice";

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
  const { actionType, description } = actionItem;

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
  return (
    <ActionItemRow
      actionItem={actionItem}
      isFirst={isFirst}
      isLast={isLast}
      onClick={() => {}}
      subRow={{
        text: description,
        children: (
          <PanelButton
            title={title}
            onClick={onClick}
            isDisabled={false}
            size={ElementSize.S}
          />
        ),
      }}
    >
      <div></div>
    </ActionItemRow>
  );
}
