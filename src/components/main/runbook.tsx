import React, { createRef, useRef } from "react";
import { GET_MANUAL } from "../../utils/queries";
import { useQuery } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  setRunbookData,
  selectActiveRunbook,
} from "../../reducers/runbooks-slice";
import RunbookStatusBar from "./runbook-status-bar";
import { PanelWithTable, Panel, TableForPanelProps } from "./panel";
import {
  Action,
  CommandSectionIndex,
  CommandSectionType,
  Input,
  Prompt,
} from "./types";
import addonManager from "../../utils/addons-initializer";
import { InputFieldSet } from "./input-field";
import { RunbookReviewPanel } from "./runbook-review-panel";
import { OutputReviewPanel } from "./output-review-panel";

export default function Runbook() {
  const dispatch = useAppDispatch();
  const panelRefs = useRef<any[]>([]);
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

  panelRefs.current = Array.from(Array(commandSections.length + 2).keys()).map(
    (_, i) => {
      return panelRefs.current[i] ?? createRef();
    },
  );
  console.log(panelRefs);
  const scrollPanelIntoViewHandler = (index) => {
    console.log("scrolling");
    // when we select a new panel, the panels resize some, which makes the
    // location of the ref change. set a timeout to give the css resizing a
    // head start, so this scroll into view has the correct position to scroll to
    setTimeout(() => {
      panelRefs.current[index].current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    }, 5);
  };
  return (
    <div className="w-2/3 min-h-full px-6 pt-6 justify-center flex flex-col gap-8 inline-flex">
      <div className="self-stretch h-[69px] px-8 flex-col gap-2 flex">
        <div className="self-stretch text-emerald-300 text-4xl font-bold font-['Inter']">
          {metadata.name}
        </div>
        <div className="self-stretch text-white text-sm font-normal font-['Inter']">
          {metadata.description}
        </div>
      </div>
      {
        <RunbookStatusBar
          steps={commandSections.length + 2}
          scrollHandler={scrollPanelIntoViewHandler}
        />
      }
      {
        <RunbookReviewPanel
          ref={panelRefs.current[0]}
          scrollHandler={scrollPanelIntoViewHandler}
        />
      }
      {commandSections.reduce((sectionPanels, commandSection, i) => {
        const content = commandSectionToContent(
          commandSection,
          scrollPanelIntoViewHandler,
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
        scrollHandler={scrollPanelIntoViewHandler}
      />
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
          title="inputs"
          description=""
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
          content={element}
          title={action.name}
          description={"todo description"}
          panelIndex={i + 1}
          scrollHandler={scrollHandler}
          primaryButton={addon.getActionPrimaryButton(action)}
          secondaryButton={addon.getActionSecondaryButton(action)}
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
          content={element}
          title={prompt.name}
          description={"todo description"}
          panelIndex={i + 1}
          scrollHandler={scrollHandler}
          primaryButton={addon.getPromptPrimaryButton(prompt)}
          secondaryButton={addon.getPromptSecondaryButton(prompt)}
        />
      );
    } else return;
  }
}
