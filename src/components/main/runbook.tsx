import React, {
  MutableRefObject,
  createRef,
  forwardRef,
  useEffect,
  useRef,
} from "react";
import { GET_MANUAL } from "../../utils/queries";
import { useQuery } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  setRunbookData,
  selectActiveRunbook,
} from "../../reducers/runbooks-slice";
import { PanelWithTable, Panel, TableForPanelProps } from "./panel";
import {
  Action,
  CommandSectionIndex,
  CommandSectionType,
  Input,
  Prompt,
} from "./types";
import addonManager from "../../utils/addons-initializer";
import { RunbookReviewPanel } from "./runbook-review-panel";
import { OutputReviewPanel } from "./output-review-panel";
import { selectRunbookActiveStep } from "../../reducers/runbook-step-slice";

export interface RunbookProps {
  panelScrollHandler: any;
  panelRefs: MutableRefObject<any[]>;
}
export default function Runbook({
  panelScrollHandler,
  panelRefs,
}: RunbookProps) {
  const dispatch = useAppDispatch();
  const { metadata, data, isDirty, commandSections, outputs } =
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
    <div className="w-full justify-center flex flex-col items-center">
      <div className="min-w-[1024px] max-w-[1280px] min-h-full px-6 pt-6 justify-center flex flex-col inline-flex gap-8">
        <RunbookReviewPanel
          ref={panelRefs?.current[0]}
          scrollHandler={panelScrollHandler}
        />

        {commandSections.reduce((sectionPanels, commandSection, i) => {
          const content = commandSectionToContent(
            commandSection,
            panelScrollHandler,
            panelRefs.current[i + 1],
            i,
          );
          if (content) {
            sectionPanels.push(content);
          }
          return sectionPanels;
        }, [] as any[])}

        <OutputReviewPanel
          outputs={outputs}
          panelIndex={commandSections.length + 1}
          ref={panelRefs.current[commandSections.length + 1]}
          scrollHandler={panelScrollHandler}
        />
      </div>
    </div>
  );
}

function commandSectionToContent(
  commandSection: CommandSectionIndex,
  scrollHandler: any,
  ref: any,
  i: number,
): JSX.Element | undefined {
  if (commandSection.type === CommandSectionType.Input) {
    let [mutableChildren, immutableChildren] = commandSection.items.reduce(
      (children, item, idx) => {
        let [mutableChildren, immutableChildren] = children;
        let input = item as Input;
        if (input.value === undefined) {
          mutableChildren.push({
            title: input.description || "Input",
            index: idx,
            cell: {
              value: input.value,
              default: input.default,
              commandUuid: input.commandUuid,
              runbookUuid: input.runbookUuid,
            },
          });
        } else {
          immutableChildren.push({
            title: input.description || "Input",
            index: idx,
            cell: {
              value: input.value,
              default: input.default,
              commandUuid: input.commandUuid,
              runbookUuid: input.runbookUuid,
            },
          });
        }
        return [mutableChildren, immutableChildren];
      },
      [[] as TableForPanelProps[], [] as TableForPanelProps[]],
    );
    if (mutableChildren.length) {
      return (
        <PanelWithTable
          key={`command-section-${i}-${commandSection.type}`}
          panelIndex={i + 1}
          title="runbook inputs"
          description="Review and check items from the list below"
          primaryButton={{ title: "Confirm" }}
          secondaryButton={{ title: "todo" }}
          readonly={false}
          rows={mutableChildren}
          scrollHandler={scrollHandler}
          ref={ref}
        />
      );
    } else return;
  } else if (commandSection.type === CommandSectionType.Output) {
    throw new Error("todo");
  } else if (commandSection.type === CommandSectionType.Action) {
    const action = commandSection.items[0] as Action;
    const namespace = action.namespace;
    const addon = addonManager.getAddonFromNamespace(namespace);
    const element = addon.getActionElement(action);
    if (element) {
      return (
        <Panel
          key={`command-section-${i}-${commandSection.type}`}
          content={element}
          title={action.name}
          description={""}
          panelIndex={i + 1}
          scrollHandler={scrollHandler}
          primaryButton={addon.getActionPrimaryButton(
            action,
            i + 1,
            scrollHandler,
          )}
          secondaryButton={addon.getActionSecondaryButton(action)}
          ref={ref}
        />
      );
    } else return;
  } else {
    const prompt = commandSection.items[0] as Prompt;
    const namespace = prompt.namespace;
    const addon = addonManager.getAddonFromNamespace(namespace);
    const element = addon.getPromptElement(prompt);
    if (element) {
      return (
        <Panel
          key={`command-section-${i}-${commandSection.type}`}
          content={element}
          title={prompt.name}
          description={""}
          panelIndex={i + 1}
          scrollHandler={scrollHandler}
          primaryButton={addon.getPromptPrimaryButton(
            prompt,
            i + 1,
            scrollHandler,
          )}
          secondaryButton={addon.getPromptSecondaryButton(prompt)}
          ref={ref}
        />
      );
    } else return;
  }
}
