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
} from "../components/main/types";

export interface Runbook {
  metadata: RunbookMetadata;
  actionBlocks: ActionBlock[];
  modalBlocks: ModalBlock[];
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
    setProgressBlocks: create.reducer(
      (state, action: PayloadAction<ProgressBlock[]>) => {
        let progressBlocks: ProgressBlock[] = state.progressBlocks;
        action.payload.forEach((block) => {
          progressBlocks.push(block);
        });
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
    selectModalVisibility: createSelector(
      [
        // first selector gets the modals
        (state: Runbook) => state.modalBlocks,
        // next sector forwards the uuid arg
        (state: Runbook, uuid: string) => uuid,
      ],
      // output selector can actually use those params
      (modalPanels: ModalBlock[], uuid: string): boolean =>
        modalPanels.find((panel) => panel.uuid === uuid)?.visible || false,
    ),
  },
});

export const {
  setActionBlocks,
  setModalBlocks,
  setProgressBlocks,
  // appendBlock,
  setMetadata,
  clearBlocks,
  updateActionItems,
  setModalVisibility,
} = runbooksSlice.actions;

export const { selectRunbook, selectModalVisibility } = runbooksSlice.selectors;
