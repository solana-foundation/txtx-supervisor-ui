import React from "react";
import { classNames } from "../../../utils/helpers";
import { ActionGroup } from "../../main/types";
import { ButtonSubGroup } from "./button-sub-group";
import { SubGroup } from "./sub-group";

export enum GroupAccent {
  None,
  Red,
  Blue,
  Amber,
}

export interface Group {
  group: ActionGroup;
  modalUuid?: string;
  accent?: GroupAccent;
}

export function Group({ group, accent = GroupAccent.None, modalUuid }: Group) {
  const { subGroups, title } = group;
  return (
    <div className="w-full flex-col justify-center items-start gap-2.5 inline-flex">
      <div
        className={classNames(
          "px-2 text-sm font-normal font-inter rounded",
          accent !== GroupAccent.None && title ? "border" : "",
          accent === GroupAccent.None ? "text-gray-400" : "",
          accent === GroupAccent.Red ? "border-red-600 text-red-600" : "",
          accent === GroupAccent.Blue ? "border-blue-600 text-blue-600" : "",
          accent === GroupAccent.Amber ? "border-amber-400 text-amber-400" : "",
        )}
      >
        {title}
      </div>
      {subGroups.map((subGroup, i) => {
        const firstActionType = subGroup.actionItems[0].actionType.type;
        // we're assuming that if any action item in this subgroup is a button (ValidateModal),
        // then all actions in this subGroup are buttons
        return firstActionType === "ValidateModal" ||
          firstActionType === "ValidateBlock" ? (
          <ButtonSubGroup subGroup={subGroup} modalUuid={modalUuid} key={i} />
        ) : (
          <SubGroup subGroup={subGroup} key={i} />
        );
      })}
    </div>
  );
}
