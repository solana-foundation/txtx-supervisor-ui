import React from "react";
import { GET_MANUAL } from "../../utils/queries";
import { useQuery } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  setRunbookData,
  selectActiveRunbook,
} from "../../reducers/runbooks-slice";
import RunbookStatusBar from "./runbook-status-bar";
import { Panel, PanelButton, PanelColor, PanelContent } from "./panel";
import {
  Action,
  CommandSectionIndex,
  CommandSectionType,
  Input,
  Prompt,
} from "./types";
import addonManager from "../../utils/addons-initializer";
import { InputFieldSet } from "./input-field";
import RunbookReviewPanel from "./runbook-review-panel";

export default function Runbook() {
  const dispatch = useAppDispatch();
  const { metadata, data, isDirty, commandSections } =
    useAppSelector(selectActiveRunbook);
  const { loading, error } = useQuery(GET_MANUAL, {
    variables: {
      runbookName: metadata?.uuid,
    },
    skip: !metadata?.uuid || isDirty,
    onCompleted: (result) => {
      dispatch(setRunbookData(result.runbook));
    },
  });

  if (loading || !data) {
    return <div>Loading...</div>;
  }
  return (
    <div className="w-full min-h-full px-6 pt-6 flex-col justify-start items-start gap-8 inline-flex">
      <div className="self-stretch h-[69px] px-8 flex-col justify-start items-start gap-2 flex">
        <div className="self-stretch text-emerald-300 text-4xl font-bold font-['Inter']">
          {metadata.name}
        </div>
        <div className="self-stretch text-white text-sm font-normal font-['Inter']">
          {metadata.description}
        </div>
      </div>
      {<RunbookStatusBar steps={commandSections.length + 1} />}
      {<RunbookReviewPanel />}
      {commandSections.reduce((sectionPanels, commandSection, i) => {
        const content = commandSectionToContent(commandSection);
        if (content) {
          sectionPanels.push(
            <Panel
              key={`command-section-${i}-${commandSection.type}`}
              panelIndex={i + 1}
              color={PanelColor.Yellow}
              title={commandSectionToTitle(commandSection)}
              primaryButton={commandSectionToPrimaryButton(commandSection)}
              secondaryButton={commandSectionToSecondaryButton(commandSection)}
              content={content}
            />,
          );
        }
        return sectionPanels;
      }, [] as any[])}
    </div>
  );
}

function commandSectionToTitle(commandSection: CommandSectionIndex): string {
  if (commandSection.type === CommandSectionType.Input) return "inputs review";
  else if (commandSection.type === CommandSectionType.Output) {
    throw new Error("todo");
  } else if (commandSection.type === CommandSectionType.Action) {
    let action = commandSection.items[0] as Action;
    return action.name;
  } else {
    let prompt = commandSection.items[0] as Prompt;
    return prompt.name;
  }
}

function commandSectionToContent(
  commandSection: CommandSectionIndex,
): JSX.Element | undefined {
  if (commandSection.type === CommandSectionType.Input) {
    return (
      <PanelContent
        children={commandSection.items.map((item, j) => {
          let input = item as Input;
          return <InputFieldSet {...input} />;
        })}
      />
    );
  } else if (commandSection.type === CommandSectionType.Output) {
    throw new Error("todo");
  } else if (commandSection.type === CommandSectionType.Action) {
    let action = commandSection.items[0] as Action;
    let namespace = action.namespace;
    let addon = addonManager.getAddonFromNamespace(namespace);

    return addon.getActionElement(action);
  } else {
    let prompt = commandSection.items[0] as Prompt;
    let namespace = prompt.namespace;
    let addon = addonManager.getAddonFromNamespace(namespace);

    return addon.getPromptElement(prompt);
  }
}

function commandSectionToPrimaryButton(
  commandSection: CommandSectionIndex,
): PanelButton | undefined {
  if (commandSection.type === CommandSectionType.Input) {
    return {
      title: "Confirm",
    };
  } else if (commandSection.type === CommandSectionType.Output) {
    throw new Error("todo");
  } else if (commandSection.type === CommandSectionType.Action) {
    let action = commandSection.items[0] as Action;
    let namespace = action.namespace;
    let addon = addonManager.getAddonFromNamespace(namespace);

    return addon.getActionPrimaryButton(action);
  } else {
    let prompt = commandSection.items[0] as Prompt;
    let namespace = prompt.namespace;
    let addon = addonManager.getAddonFromNamespace(namespace);

    return addon.getPromptPrimaryButton(prompt);
  }
}

function commandSectionToSecondaryButton(
  commandSection: CommandSectionIndex,
): PanelButton | undefined {
  if (commandSection.type === CommandSectionType.Input) {
    return {
      title: "Confirm",
    };
  } else if (commandSection.type === CommandSectionType.Output) {
    throw new Error("todo");
  } else if (commandSection.type === CommandSectionType.Action) {
    let action = commandSection.items[0] as Action;
    let namespace = action.namespace;
    let addon = addonManager.getAddonFromNamespace(namespace);

    return addon.getActionSecondaryButton(action);
  } else {
    let prompt = commandSection.items[0] as Prompt;
    let namespace = prompt.namespace;
    let addon = addonManager.getAddonFromNamespace(namespace);

    return addon.getPromptSecondaryButton(prompt);
  }
}
