import { useMutation } from "@apollo/client/react";
import {
  ActionItemRequest,
  ActionItemResponse,
  InputOption,
} from "../../types/runbook";
import { ActionItemRow } from "./shared/action-item-row";
import { UPDATE_ACTION_ITEM } from "../../utils/queries";
import React from "react";
import PickInputOptionCell from "./shared/pick-input-option-cell";

export interface PickInputOptionAction {
  actionItem: ActionItemRequest;
  isFirst: boolean;
  isLast: boolean;
  isCurrent: boolean;
}
export function PickInputOptionAction({
  actionItem,
  isFirst,
  isLast,
  isCurrent
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
      isCurrent={isCurrent}
    >
      <PickInputOptionCell actionItem={actionItem} setSelected={setSelected} />
    </ActionItemRow>
  );
}
