import { useMutation } from "@apollo/client";
import {
  ActionItemRequest,
  ActionItemResponse,
  InputOption,
} from "../main/types";
import { UPDATE_ACTION_ITEM } from "../../utils/queries";
import React, { useEffect } from "react";
import { SelectOptionActionContainer } from "txtx-component-lib";


export interface SelectOptionActionI {
  actionItem: ActionItemRequest;
  isFirst: boolean;
  isLast: boolean;
  isCurrent: boolean;
}
export function SelectOptionAction({
  actionItem,
  isFirst,
  isLast,
  isCurrent
}: SelectOptionActionI) {
  const { id } = actionItem;
  const [updateActionItem, {}] = useMutation(UPDATE_ACTION_ITEM);

  const onClick = () => {};
  const setSelected = (option: InputOption) => {
    const event: ActionItemResponse = {
      actionItemId: id,
      type: "PickInputOption",
      data: option.value,
    };
    //updateActionItem({ variables: { event: JSON.stringify(event) } });
  };

  useEffect(() => {
    const handleOptionChange = (event: Event) => {
      const customEvent = event as CustomEvent;  // Type assertion here
      setSelected(customEvent.detail.value);
    };

    window.addEventListener("optionChange", handleOptionChange as EventListener);

    return () => {
      window.removeEventListener("optionChange", handleOptionChange as EventListener);
    };
  }, []);

  return (
    <SelectOptionActionContainer
      actionItem={actionItem}
      isFirst={isFirst}
      isLast={isLast}
      isCurrent={isCurrent}
    />
    // <ActionItemRow
    //   actionItem={actionItem}
    //   isFirst={isFirst}
    //   isLast={isLast}
    //   onClick={onClick}
    //   isCurrent={isCurrent}
    // >
    //   <SelectOptionCellSimple actionItem={actionItem}/>
    // </ActionItemRow>
  );
}
