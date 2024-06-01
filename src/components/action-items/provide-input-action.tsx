import { useMutation } from "@apollo/client";
import { ActionItemRequest, ActionItemResponse, toValue } from "../main/types";
import { ActionItemRow } from "./components/action-item-row";
import { UPDATE_ACTION_ITEM } from "../../utils/queries";
import React from "react";
import { ProvideInputCell } from "./components/provide-input-cell";

export interface ProvideInputAction {
  actionItem: ActionItemRequest;
  isFirst: boolean;
  isLast: boolean;
}
export function ProvideInputAction({
  actionItem,
  isFirst,
  isLast,
}: ProvideInputAction) {
  const { uuid, actionType } = actionItem;
  const [updateActionItem, {}] = useMutation(UPDATE_ACTION_ITEM);

  if (actionType.type !== "ProvideInput") {
    throw new Error(
      "ProvideInputAction component requires ProvideInput action type.",
    );
  }

  const onClick = () => {
    const event: ActionItemResponse = {
      actionItemUuid: uuid,
      type: "ReviewInput",
      data: {
        inputName: actionItem.title,
        valueChecked: status === "Todo",
      },
    };
    updateActionItem({ variables: { event: JSON.stringify(event) } });
  };
  const onChange = (e: any) => {
    const { inputName, typing } = actionType.data;
    const event: ActionItemResponse = {
      actionItemUuid: uuid,
      type: "ProvideInput",
      data: {
        inputName,
        updatedValue: toValue(e.target.value, typing),
      },
    };
    updateActionItem({ variables: { event: JSON.stringify(event) } });
  };

  return (
    <ActionItemRow
      actionItem={actionItem}
      isFirst={isFirst}
      isLast={isLast}
      onClick={onClick}
      key={uuid}
    >
      <ProvideInputCell actionItem={actionItem} onChange={onChange} />
    </ActionItemRow>
  );
}
