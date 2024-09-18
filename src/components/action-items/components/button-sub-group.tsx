import React from "react";
import { ValidateModalAction } from "../validate-modal-action";
import { ActionSubGroup } from "../../main/types";
import { ValidateBlockAction } from "../validate-block-action";
import { CloseModalAction } from "../clost-modal-action";

interface ButtonSubGroup {
  subGroup: ActionSubGroup;
  modalUuid?: string;
}

export function ButtonSubGroup({ subGroup, modalUuid }: ButtonSubGroup) {
  const { actionItems, allowBatchCompletion } = subGroup;
  const isValidateModal = actionItems[0].actionType.type === "ValidateModal";
  const isValidateBlock = actionItems[0].actionType.type === "ValidateBlock";
  if (!isValidateModal && !isValidateBlock) {
    throw new Error(
      `ButtonSubGroups must have a ValidateModal or ValidateBlock action item first`,
    );
  }
  if (isValidateModal && !modalUuid) {
    throw new Error(
      `ButtonSubGroups with ValidateModal action items must have a modalUuid`,
    );
  }

  const uiActionItems = actionItems.reduce((accumulator, actionItem, i) => {
    const { actionType, id } = actionItem;
    const { type } = actionType;
    console.log("button subgroup item: ", type);
    if (type === "ValidateModal") {
      if (!modalUuid) {
        throw new Error(
          `ButtonSubGroups with ValidateModal action items must have a modalUuid`,
        );
      }
      accumulator.push(
        <ValidateModalAction
          actionItem={actionItem}
          modalUuid={modalUuid}
          key={id}
          index={i}
        />,
      );
      accumulator.push(
        <CloseModalAction modalUuid={modalUuid} key={`${id}-close`} />,
      );
    } else if (type === "ValidateBlock") {
      accumulator.push(
        <ValidateBlockAction actionItem={actionItem} key={id} index={i} />,
      );
    }
    return accumulator;
  }, [] as JSX.Element[]);
  return (
    <div className="self-stretch py-2.5 justify-end items-start inline-flex">
      {uiActionItems}
    </div>
  );
}
