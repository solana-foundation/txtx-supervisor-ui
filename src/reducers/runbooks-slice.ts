import type { PayloadAction } from "@reduxjs/toolkit";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import {
  RunbookMetadata,
  deserializeBlock,
  UpdateActionItemEvent,
  BlockType,
  ActionBlock,
  ModalBlock,
  deserializeActionItemEvent,
  ErrorBlock,
  ActionItemRequest,
  LogEvent,
  RunbookCompletedEvent,
} from "../types/runbook";

export interface Runbook {
  metadata: RunbookMetadata;
  actionBlocks: ActionBlock[];
  modalBlocks: ModalBlock[];
  errorBlocks: ErrorBlock[];
  logEvents: LogEvent[];
  namespacedNetworks: { [key: string]: string[] };
  runbookComplete: boolean;
  runbookCleanupInfo?: RunbookCompletedEvent[];
}
const initialState: Runbook = {
  metadata: {
    name: "",
    description: "",
    addonData: [],
    uuid: "",
  },
  actionBlocks: [],
  modalBlocks: [],
  errorBlocks: [],
  logEvents: [],
  namespacedNetworks: {},
  runbookComplete: false,
};

type BlockWithPanel = ActionBlock | ModalBlock | ErrorBlock;

function applyActionItemUpdates<T extends BlockWithPanel>(
  blocks: T[],
  actionItemEvents: UpdateActionItemEvent[],
): T[] {
  return blocks.map((block) => ({
    ...block,
    panel: {
      ...block.panel,
      groups: block.panel.groups.map((group) => ({
        ...group,
        subGroups: group.subGroups.map((subGroup) => ({
          ...subGroup,
          actionItems: subGroup.actionItems.map((actionItem) => {
            const matchingUpdate = actionItemEvents.find(
              (update) => update.id === actionItem.id,
            );
            if (matchingUpdate) {
              return {
                ...actionItem,
                constructInstanceName:
                  matchingUpdate.title || actionItem.constructInstanceName,
                description:
                  matchingUpdate.description || actionItem.description,
                actionStatus:
                  matchingUpdate.actionStatus || actionItem.actionStatus,
                actionType: matchingUpdate.actionType || actionItem.actionType,
              };
            }
            return actionItem;
          }),
        })),
      })),
    },
  }));
}

function findFirstIncompleteActionId(blocks: BlockWithPanel[]): string | null {
  for (const { panel, visible } of blocks) {
    if (!visible) continue;
    for (const group of panel.groups) {
      for (const subGroup of group.subGroups) {
        for (const action of subGroup.actionItems) {
          if (isActionItemIncomplete(action)) {
            return action.id;
          }
        }
      }
    }
  }
  return null;
}

const selectActivePanelActionId = createSelector(
  [(state: Runbook) => state.actionBlocks],
  findFirstIncompleteActionId,
);
const selectActiveModalActionId = createSelector(
  [(state: Runbook) => state.modalBlocks],
  findFirstIncompleteActionId,
);
const selectActiveErrorActionId = createSelector(
  [(state: Runbook) => state.errorBlocks],
  findFirstIncompleteActionId,
);

export const runbooksSlice = createSlice({
  name: "runbooks",
  initialState,
  reducers: (create) => ({
    setActionBlocks: create.reducer(
      (state, action: PayloadAction<ActionBlock<false>[]>) => {
        let actionBlocks: ActionBlock[] = state.actionBlocks;
        action.payload.forEach((serializedBlock) => {
          const block = deserializeBlock(serializedBlock);
          let blockExists = false;
          // loop over all existing action blocks to see if a block with all of the same actions+action ids exists
          for (const existingBlock of actionBlocks) {
            if (existingBlock.type !== block.type) continue;
            if (existingBlock.panel.groups.length !== block.panel.groups.length)
              continue;
            let allGroupsMatch = true;
            for (let i = 0; i < existingBlock.panel.groups.length; i++) {
              const existingGroup = existingBlock.panel.groups[i];
              const newGroup = block.panel.groups[i];
              if (
                existingGroup.subGroups.length !== newGroup.subGroups.length
              ) {
                allGroupsMatch = false;
                break;
              }

              let allSubGroupsMatch = true;
              for (let j = 0; j < existingGroup.subGroups.length; j++) {
                const existingSubGroup = existingGroup.subGroups[j];
                const newSubGroup = newGroup.subGroups[j];
                if (
                  existingSubGroup.actionItems.length !==
                  newSubGroup.actionItems.length
                ) {
                  allSubGroupsMatch = false;
                  allGroupsMatch = false;
                  break;
                }

                let allItemsMatch = true;
                for (let k = 0; k < existingSubGroup.actionItems.length; k++) {
                  if (
                    existingSubGroup.actionItems[k].id !==
                    newSubGroup.actionItems[k].id
                  ) {
                    allItemsMatch = false;
                    break;
                  }
                }
                if (!allItemsMatch) {
                  allSubGroupsMatch = false;
                  allGroupsMatch = false;
                  break;
                }
              }
            }
            if (!allGroupsMatch) continue;
            blockExists = true;
            break;
          }
          if (blockExists) {
            console.warn(
              `Action block with uuid ${block.uuid} already exists, replacing it.`,
            );
            // if the block already exists, replace it
            actionBlocks = actionBlocks.map((b) =>
              b.uuid === block.uuid ? block : b,
            );
          } else {
            actionBlocks.push(block);
          }
        });
      },
    ),
    setModalBlocks: create.reducer(
      (state, action: PayloadAction<ModalBlock<false>[]>) => {
        let modalBlocks: ModalBlock[] = state.modalBlocks;
        action.payload.forEach((serializedBlock) => {
          const block = deserializeBlock(serializedBlock);
          modalBlocks.push(block);
        });
      },
    ),
    setErrorBlocks: create.reducer(
      (state, action: PayloadAction<ErrorBlock<false>[]>) => {
        let errorBlocks: ErrorBlock[] = state.errorBlocks;
        action.payload.forEach((serializedBlock) => {
          const block = deserializeBlock(serializedBlock);
          errorBlocks.push(block);
        });
      },
    ),
    setLogEvents: create.reducer((state, action: PayloadAction<LogEvent[]>) => {
      state.logEvents = action.payload || [];
    }),
    pushLogEvent: create.reducer((state, action: PayloadAction<LogEvent>) => {
      state.logEvents.push(action.payload);
    }),
    clearBlocks: create.reducer((state, action: PayloadAction<BlockType>) => {
      if (action.payload === "ActionPanel") {
        return {
          ...state,
          actionBlocks: [],
        };
      } else if (action.payload === "ModalPanel") {
        return {
          ...state,
          modalBlocks: [],
        };
      }
      return state;
    }),
    updateActionItems: create.reducer(
      (state, action: PayloadAction<UpdateActionItemEvent<false>[]>) => {
        const actionItemEvents: UpdateActionItemEvent[] = action.payload.map(
          deserializeActionItemEvent,
        );
        state.actionBlocks = applyActionItemUpdates(
          state.actionBlocks,
          actionItemEvents,
        );
        state.modalBlocks = applyActionItemUpdates(
          state.modalBlocks,
          actionItemEvents,
        );
      },
    ),
    setModalVisibility: create.reducer(
      (state, action: PayloadAction<[uuid: string, visibility: boolean]>) => {
        const [uuid, visibility] = action.payload;
        const modalIdx = state.modalBlocks.findIndex(
          (modal) => modal.uuid === uuid,
        );
        if (modalIdx === undefined || modalIdx === -1) return;
        state.modalBlocks[modalIdx].visible = visibility;
      },
    ),
    setMetadata: create.reducer(
      (state, action: PayloadAction<RunbookMetadata>) => {
        const metadata = action.payload;
        state = {
          ...state,
          metadata,
        };
        return state;
      },
    ),
    setRunbookComplete: create.reducer(
      (state, action: PayloadAction<RunbookCompletedEvent[]>) => {
        state.runbookComplete = true;
        state.runbookCleanupInfo = action.payload;
      },
    ),
  }),
  selectors: {
    selectRunbook: (state) => state,
    selectActiveFlowData: (state: Runbook) => state.metadata.addonData,
    selectLogs: (state: Runbook) => state.logEvents,
    selectActiveTransientLogs: createSelector(
      [(state) => state.logEvents],
      (logEvents: LogEvent[]) => {
        if (logEvents.length === 0) return [];
        // Get the Uuid of all LogEvents that are transient and pending
        // For each of those Uuids, check to see if the latest log event
        // associated with it is Pending, Successful, or Failure
        // if Pending - it is "active" (aka spinner still spinning, map still showing)
        // if other status - is is inactive
        const transientPendingEventUuids = logEvents
          .filter(
            (event) => event.type === "Transient" && event.status === "Pending",
          )
          .map((event) => event.uuid);
        const uniqueTransientPendingEventUuids = Array.from(
          new Set(transientPendingEventUuids),
        );
        let activeTransientLogs = [];
        for (let uuid of uniqueTransientPendingEventUuids) {
          const eventsForUuid = logEvents.filter(
            (event) => event.uuid === uuid,
          );
          const latestEventForUuid = eventsForUuid[eventsForUuid.length - 1];
          if (latestEventForUuid.status === "Pending") {
            activeTransientLogs.push(latestEventForUuid);
          }
        }
        return activeTransientLogs;
      },
    ),
    selectPanelValidationReady: createSelector(
      [(state) => state.actionBlocks, (_, buttonUuid: string) => buttonUuid],
      (actionBlocks: ActionBlock[], buttonUuid: string): boolean => {
        return checkValidationReady(actionBlocks, buttonUuid);
      },
    ),
    selectModalValidationReady: createSelector(
      [
        (state: Runbook) => state.modalBlocks,
        (_, buttonUuid: string) => buttonUuid,
      ],
      (modalBlocks: ModalBlock[], buttonUuid: string): boolean => {
        return checkValidationReady(modalBlocks, buttonUuid);
      },
    ),
    selectRunbookComplete: (state) => state.runbookComplete,
    selectRunbookCleanupInfo: (state) => state.runbookCleanupInfo,
    selectActiveActionId: createSelector(
      [
        selectActiveErrorActionId,
        selectActiveModalActionId,
        selectActivePanelActionId,
      ],
      (
        activeErrorActionId: string | null,
        activeModalActionId: string | null,
        activePanelActionId: string | null,
      ) => {
        return (
          activeErrorActionId || activeModalActionId || activePanelActionId
        );
      },
    ),
  },
});

function checkValidationReady(
  blocks: ModalBlock[] | ActionBlock[],
  buttonId: string,
): boolean {
  const block = blocks.find((block) =>
    block.panel.groups.some((group) =>
      group.subGroups.some((subGroup) =>
        subGroup.actionItems.some((actionItem) => actionItem.id == buttonId),
      ),
    ),
  );
  if (block === undefined) return false;
  return !block.panel.groups.some((group) =>
    group.subGroups.some((subGroup) =>
      subGroup.actionItems.some(
        (actionItem) =>
          actionItem.actionStatus.status !== "Success" &&
          actionItem.id !== buttonId,
      ),
    ),
  );
}
function isActionItemIncomplete(actionItem: ActionItemRequest) {
  return actionItem.actionStatus.status !== "Success";
}

export const {
  setActionBlocks,
  setModalBlocks,
  setErrorBlocks,
  setLogEvents,
  pushLogEvent,
  setMetadata,
  clearBlocks,
  updateActionItems,
  setModalVisibility,
  setRunbookComplete,
} = runbooksSlice.actions;

export const {
  selectRunbook,
  selectPanelValidationReady,
  selectModalValidationReady,
  selectRunbookComplete,
  selectRunbookCleanupInfo,
  selectActiveActionId,
  selectActiveFlowData,
  selectLogs,
  selectActiveTransientLogs,
} = runbooksSlice.selectors;
