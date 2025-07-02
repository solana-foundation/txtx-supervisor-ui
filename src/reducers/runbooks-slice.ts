import type { PayloadAction } from "@reduxjs/toolkit";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import {
  RunbookMetadata,
  deserializeBlock,
  UpdateActionItemEvent,
  BlockType,
  ActionBlock,
  ModalBlock,
  ProgressBlock,
  deserializeActionItemEvent,
  ProgressBarStatusUpdate,
  ProgressBarVisibilityUpdate,
  ErrorBlock,
  ActionItemRequest,
} from "../components/main/types";

export interface Runbook {
  metadata: RunbookMetadata;
  actionBlocks: ActionBlock[];
  modalBlocks: ModalBlock[];
  errorBlocks: ErrorBlock[];
  progressBlocks: ProgressBlock[];
  namespacedNetworks: { [key: string]: string[] };
  runbookComplete: boolean;
}
const initialState: Runbook = {
  metadata: {
    name: "",
    description: "",
    registeredAddons: [],
    uuid: "",
  },
  actionBlocks: [],
  modalBlocks: [],
  errorBlocks: [],
  progressBlocks: [],
  namespacedNetworks: {},
  runbookComplete: false,
};

const selectActivePanelActionId = createSelector(
  [(state: Runbook) => state.actionBlocks],
  (blocks: ActionBlock[]): string | null => {
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
  },
);
const selectActiveModalActionId = createSelector(
  [(state: Runbook) => state.modalBlocks],
  (modalBlocks: ModalBlock[]): string | null => {
    for (const { panel, visible } of modalBlocks) {
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
  },
);
const selectActiveErrorActionId = createSelector(
  [(state: Runbook) => state.errorBlocks],
  (errorBlocks: ErrorBlock[]): string | null => {
    for (const { panel, visible } of errorBlocks) {
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
  },
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
          actionBlocks.push(block);
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
    setProgressBlocks: create.reducer(
      (state, action: PayloadAction<ProgressBlock[]>) => {
        const newBlocks = action.payload;
        for (const newBlock of newBlocks) {
          const foundIdx = state.progressBlocks.findIndex(
            (existing) => existing.uuid === newBlock.uuid,
          );

          if (foundIdx === -1) {
            state.progressBlocks.push(newBlock);
          } else {
            if (newBlock.panel.length > 0) {
              state.progressBlocks[foundIdx] = newBlock;
            }
          }
        }
      },
    ),
    pushProgressBlockStatus: create.reducer(
      (state, action: PayloadAction<ProgressBarStatusUpdate>) => {
        const { progressBarUuid, constructDid, newStatus } = action.payload;

        const progressBarIdx = state.progressBlocks.findIndex(
          (bar) => bar.uuid === progressBarUuid,
        );
        if (progressBarIdx === -1) {
          state.progressBlocks.push({
            type: "ProgressBar",
            uuid: progressBarUuid,
            visible: false,
            panel: [
              {
                constructDid,
                statuses: [newStatus],
              },
            ],
          });
          return;
        }
        const progressBar = state.progressBlocks[progressBarIdx];
        const constructStatusesIdx = progressBar.panel.findIndex(
          (p) => p.constructDid === constructDid,
        );
        if (constructStatusesIdx === -1) {
          state.progressBlocks[progressBarIdx].panel.push({
            constructDid: constructDid,
            statuses: [newStatus],
          });
        } else {
          const constructStatuses = progressBar.panel[constructStatusesIdx];
          constructStatuses.statuses.push(newStatus);
          state.progressBlocks[progressBarIdx].panel[constructStatusesIdx] =
            constructStatuses;
        }
      },
    ),
    setProgressBlockVisibility: create.reducer(
      (state, action: PayloadAction<ProgressBarVisibilityUpdate>) => {
        const { progressBarUuid, visible } = action.payload;

        const progressBarIdx = state.progressBlocks.findIndex(
          (bar) => bar.uuid === progressBarUuid,
        );
        if (progressBarIdx === undefined) return;
        if (state.progressBlocks[progressBarIdx] === undefined) return;
        state.progressBlocks[progressBarIdx].visible = visible;
      },
    ),
    // appendBlock: create.reducer(
    //   (state, action: PayloadAction<Block<false>>) => {
    //     const block: Block = deserializeBlock(action.payload);
    //     if (block.type === "ActionPanel") {
    //       state.actionBlocks.push(block);
    //     } else if (block.type === "ModalPanel") {
    //       state.modalPanels.push(block);
    //     }
    //   },
    // ),
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
    // todo: this reducer could use some cleanup
    updateActionItems: create.reducer(
      (state, action: PayloadAction<UpdateActionItemEvent<false>[]>) => {
        const actionItemEvents: UpdateActionItemEvent[] = action.payload.map(
          deserializeActionItemEvent,
        );
        state.actionBlocks = state.actionBlocks.map((block) => ({
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
                      constructInstanceName: matchingUpdate.title || actionItem.constructInstanceName,
                      description:
                        matchingUpdate.description || actionItem.description,
                      actionStatus:
                        matchingUpdate.actionStatus || actionItem.actionStatus,
                      actionType:
                        matchingUpdate.actionType || actionItem.actionType,
                    };
                  } else {
                    return actionItem;
                  }
                }),
              })),
            })),
          },
        }));
        state.modalBlocks = state.modalBlocks.map((block) => ({
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
                      constructInstanceName: matchingUpdate.title || actionItem.constructInstanceName,
                      description:
                        matchingUpdate.description || actionItem.description,
                      actionStatus:
                        matchingUpdate.actionStatus || actionItem.actionStatus,
                      actionType:
                        matchingUpdate.actionType || actionItem.actionType,
                    };
                  } else {
                    return actionItem;
                  }
                }),
              })),
            })),
          },
        }));
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
      (state, action: PayloadAction<boolean>) => {
        state.runbookComplete = action.payload;
      },
    ),
  }),
  selectors: {
    selectRunbook: (state) => state,
    selectProgressBlocks: (state) => state.progressBlocks,
    selectVisibleProgressBlock: createSelector(
      [(state) => state.progressBlocks],
      (progressBlocks: ProgressBlock[]) =>
        progressBlocks.find((block) => block.visible),
    ),
    selectIsSomeProgressBlockVisible: createSelector(
      [(state) => state.progressBlocks],
      (progressBlocks: ProgressBlock[]) =>
        progressBlocks.some((block) => block.visible),
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
  setProgressBlocks,
  // appendBlock,
  setMetadata,
  clearBlocks,
  updateActionItems,
  setModalVisibility,
  pushProgressBlockStatus,
  setProgressBlockVisibility,
  setRunbookComplete,
} = runbooksSlice.actions;

export const {
  selectRunbook,
  selectVisibleProgressBlock,
  selectPanelValidationReady,
  selectModalValidationReady,
  selectIsSomeProgressBlockVisible,
  selectRunbookComplete,
  selectActiveActionId,
  selectProgressBlocks,
} = runbooksSlice.selectors;
