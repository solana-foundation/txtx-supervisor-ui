import React from "react";
import { useAppSelector } from "../../hooks";
import { selectRunbook } from "../../reducers/runbooks-slice";
import { Panel } from "./panel";
import ProgressOutput from "./progress-output";
import { ErrorPanel } from "./error";
import RunbookComplete from "./runbook-complete";
import { RunbookLogs } from "./runbook-logs";
import { BeginFlow } from "./begin-flow";
import {
  ActionBlock,
  ActionGroup,
  ActionItemRequest,
  BeginFlowActionItemRequest,
} from "../../types/runbook";

function isIncompleteActionItem(actionItem: ActionItemRequest): boolean {
  return (
    actionItem.actionStatus.status !== "Success" &&
    actionItem.actionType.type !== "DisplayOutput"
  );
}

function blockHasIncompleteActionItems(block: ActionBlock): boolean {
  return block.panel.groups.some((group) =>
    group.subGroups.some((subGroup) =>
      subGroup.actionItems.some(isIncompleteActionItem),
    ),
  );
}

export default function Runbook() {
  const { actionBlocks, errorBlocks, runbookComplete } =
    useAppSelector(selectRunbook);

  const incompleteBlockUuids = actionBlocks
    .filter(blockHasIncompleteActionItems)
    .map((block) => block.uuid);
  const firstIncompleteBlockUuid = incompleteBlockUuids[0];

  return (
    <div className="w-full justify-center flex flex-col items-center">
      <div className="mx-auto w-[1024px] max-w-full min-h-full px-6 pt-6 justify-center flex flex-col inline-flex gap-8">
        {actionBlocks.map((block, i) => {
          const beginFlowActions = extractBeginFlowActions(block);
          if (beginFlowActions.length > 0) {
            const beginFlowActionItem = beginFlowActions[0].subGroups[0]
              .actionItems[0].actionType as BeginFlowActionItemRequest;
            const isMoreThanOneActionAfterBlock =
              actionBlocks[i + 2] !== undefined;
            return (
              <BeginFlow
                key={block.uuid}
                title={beginFlowActionItem.data.name}
                description={beginFlowActionItem.data.description}
                index={beginFlowActionItem.data.index}
                totalFlows={beginFlowActionItem.data.totalFlows}
                uuid={block.uuid}
                doScrollIntoView={
                  !isMoreThanOneActionAfterBlock && !runbookComplete
                }
              />
            );
          } else {
            const isFirstIncompletePanel =
              firstIncompleteBlockUuid === block.uuid;
            const wasPreviousBlockFlow = actionBlocks[i - 1]
              ? extractBeginFlowActions(actionBlocks[i - 1]).length > 0
              : false;
            const doScrollIntoView =
              isFirstIncompletePanel &&
              !wasPreviousBlockFlow &&
              !runbookComplete;
            return (
              <Panel
                key={block.uuid}
                block={block}
                panelIndex={i}
                isLast={i === actionBlocks.length - 1}
                doScrollIntoView={doScrollIntoView}
              />
            );
          }
        })}
        {errorBlocks.map((block, i) => {
          return (
            <ErrorPanel
              key={block.uuid}
              block={block}
              panelIndex={i}
              isLast={i === errorBlocks.length - 1}
            />
          );
        })}
        <ProgressOutput />
        <RunbookComplete />
      </div>
      <RunbookLogs />
    </div>
  );
}

function extractBeginFlowActions(
  actionBlock: ActionBlock<true>,
): ActionGroup<true>[] {
  return actionBlock.panel.groups.filter((group) =>
    group.subGroups.some((subGroup) =>
      subGroup.actionItems.some(
        (actionItem) => actionItem.actionType.type === "BeginFlow",
      ),
    ),
  );
}
