import { useMutation } from "@apollo/client";
import {
  ActionItemRequest,
  ActionItemResponse,
  InputOption,
} from "../main/types";
import { ActionItemRow } from "./components/action-item-row";
import { UPDATE_ACTION_ITEM } from "../../utils/queries";
import React from "react";
import PickInputOptionCell from "./components/pick-input-option-cell";

export interface PickInputOptionAction {
  actionItem: ActionItemRequest;
  isFirst: boolean;
  isLast: boolean;
}
export function PickInputOptionAction({
  actionItem,
  isFirst,
  isLast,
}: PickInputOptionAction) {
  const { id } = actionItem;
  const [updateActionItem, {}] = useMutation(UPDATE_ACTION_ITEM);

  const onClick = () => {};
  const setSelected = (option: InputOption) => {
    const event: ActionItemResponse = {
      actionItemId: id,
      type: "PickInputOption",
      data: option.value,
    };
    updateActionItem({ variables: { event: JSON.stringify(event) } });
  };
  return (
    <ActionItemRow
      actionItem={actionItem}
      isFirst={isFirst}
      isLast={isLast}
      onClick={onClick}
    >
      <PickInputOptionCell actionItem={actionItem} setSelected={setSelected} />
    </ActionItemRow>
  );
}
