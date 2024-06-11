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
} from "../components/main/types";

export interface Runbook {
  metadata: RunbookMetadata;
  actionBlocks: ActionBlock[];
  modalBlocks: ModalBlock[];
  errorBlocks: ErrorBlock[];
  progressBlocks: ProgressBlock[];
  namespacedNetworks: { [key: string]: string[] };
}
const initialState: Runbook = {
  metadata: {
    name: "",
    description: "",
    uuid: "",
  },
  actionBlocks: [],
  modalBlocks: [],
  errorBlocks: [],
  progressBlocks: [],
  namespacedNetworks: {},
};

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
            state.progressBlocks[foundIdx] = newBlock;
          }
        }
      },
    ),
    pushProgressBlockStatus: create.reducer(
      (state, action: PayloadAction<ProgressBarStatusUpdate>) => {
        const { progressBarUuid, constructUuid, newStatus } = action.payload;

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
                constructUuid: constructUuid,
                statuses: [newStatus],
              },
            ],
          });
        }
        const progressBar = state.progressBlocks[progressBarIdx];
        const constructStatusesIdx = progressBar?.panel.findIndex(
          (p) => p.constructUuid === constructUuid,
        );
        if (constructStatusesIdx === -1) {
          state.progressBlocks[progressBarIdx].panel.push({
            constructUuid: constructUuid,
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
          (bar) => (bar.uuid = progressBarUuid),
        );
        if (progressBarIdx === undefined) return;
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
                    (update) => update.uuid === actionItem.uuid,
                  );
                  if (matchingUpdate) {
                    return {
                      ...actionItem,
                      title: matchingUpdate.title || actionItem.title,
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
                    (update) => update.uuid === actionItem.uuid,
                  );
                  if (matchingUpdate) {
                    return {
                      ...actionItem,
                      title: matchingUpdate.title || actionItem.title,
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
        console.log("setting visibility", uuid, visibility);
        const modalIdx = state.modalBlocks.findIndex(
          (modal) => modal.uuid === uuid,
        );
        if (modalIdx === undefined) return;
        state.modalBlocks[modalIdx].visible = visibility;
        console.log(state.modalBlocks[modalIdx]);
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
  }),
  selectors: {
    selectRunbook: (state) => state,
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
      [(state) => state.modalBlocks, (_, buttonUuid: string) => buttonUuid],
      (modalBlocks: ModalBlock[], buttonUuid: string): boolean => {
        return checkValidationReady(modalBlocks, buttonUuid);
      },
    ),
  },
});

function checkValidationReady(
  blocks: ModalBlock[] | ActionBlock[],
  buttonUuid: string,
): boolean {
  const block = blocks.find((block) =>
    block.panel.groups.some((group) =>
      group.subGroups.some((subGroup) =>
        subGroup.actionItems.some(
          (actionItem) => actionItem.uuid == buttonUuid,
        ),
      ),
    ),
  );
  if (block === undefined) return false;
  return !block.panel.groups.some((group) =>
    group.subGroups.some((subGroup) =>
      subGroup.actionItems.some(
        (actionItem) =>
          actionItem.actionStatus.status !== "Success" &&
          actionItem.uuid !== buttonUuid,
      ),
    ),
  );
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
} = runbooksSlice.actions;

export const {
  selectRunbook,
  selectVisibleProgressBlock,
  selectPanelValidationReady,
  selectIsSomeProgressBlockVisible,
} = runbooksSlice.selectors;
