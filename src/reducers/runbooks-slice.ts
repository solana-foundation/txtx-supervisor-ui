import type { PayloadAction } from "@reduxjs/toolkit";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import {
  RunbookMetadata,
  Block,
  deserializeBlock,
  UpdateActionItemEvent,
  ActionPanel,
  ModalPanel,
  BlockType,
} from "../components/main/types";

export interface Runbook {
  metadata: RunbookMetadata;
  actionPanels: ActionPanel[];
  modalPanels: ModalPanel[];
  namespacedNetworks: { [key: string]: string[] };
}
const initialState: Runbook = {
  metadata: {
    name: "",
    description: "",
    uuid: "",
  },
  actionPanels: [],
  modalPanels: [],
  namespacedNetworks: {},
};

export const runbooksSlice = createSlice({
  name: "runbooks",
  initialState,
  reducers: (create) => ({
    setBlocks: create.reducer(
      (state, action: PayloadAction<Block<false>[]>) => {
        let actionPanels: ActionPanel[] = state.actionPanels;
        let modalPanels: ModalPanel[] = state.modalPanels;
        action.payload.forEach((serializedBlock) => {
          const block = deserializeBlock(serializedBlock);
          if (block.type === "ActionPanel") {
            actionPanels.push(block);
          } else if (block.type === "ModalPanel") {
            modalPanels.push(block);
          }
        });
      },
    ),
    appendBlock: create.reducer(
      (state, action: PayloadAction<Block<false>>) => {
        const block: Block = deserializeBlock(action.payload);
        if (block.type === "ActionPanel") {
          state.actionPanels.push(block);
        } else if (block.type === "ModalPanel") {
          state.modalPanels.push(block);
        }
      },
    ),
    clearBlocks: create.reducer((state, action: PayloadAction<BlockType>) => {
      if (action.payload === "ActionPanel") {
        return {
          ...state,
          actionPanels: [],
        };
      } else if (action.payload === "ModalPanel") {
        return {
          ...state,
          modalPanels: [],
        };
      }
      return state;
    }),
    // todo: this reducer could use some cleanup
    updateActionItems: create.reducer(
      (state, action: PayloadAction<UpdateActionItemEvent<false>[]>) => {
        const actionItemEvents: UpdateActionItemEvent[] = action.payload.map(
          (update) => {
            return {
              actionItemUuid: update.actionItemUuid,
              newStatus: JSON.parse(update.newStatus),
            };
          },
        );
        state.actionPanels = state.actionPanels.map((block) => ({
          ...block,
          groups: block.groups.map((group) => ({
            ...group,
            subGroups: group.subGroups.map((subGroup) => ({
              ...subGroup,
              actionItems: subGroup.actionItems.map((actionItem) => {
                const matchingUpdate = actionItemEvents.find(
                  (update) => update.actionItemUuid === actionItem.uuid,
                );
                if (matchingUpdate) {
                  return {
                    ...actionItem,
                    actionStatus: matchingUpdate.newStatus,
                  };
                } else {
                  return actionItem;
                }
              }),
            })),
          })),
        }));
        state.modalPanels = state.modalPanels.map((block) => ({
          ...block,
          groups: block.groups.map((group) => ({
            ...group,
            subGroups: group.subGroups.map((subGroup) => ({
              ...subGroup,
              actionItems: subGroup.actionItems.map((actionItem) => {
                const matchingUpdate = actionItemEvents.find(
                  (update) => update.actionItemUuid === actionItem.uuid,
                );
                if (matchingUpdate) {
                  return {
                    ...actionItem,
                    actionStatus: matchingUpdate.newStatus,
                  };
                } else {
                  return actionItem;
                }
              }),
            })),
          })),
        }));
      },
    ),
    setModalVisibility: create.reducer(
      (state, action: PayloadAction<[uuid: string, visibility: boolean]>) => {
        const [uuid, visibility] = action.payload;
        console.log("setting visibility", uuid, visibility);
        const modalIdx = state.modalPanels.findIndex(
          (modal) => modal.uuid === uuid,
        );
        if (modalIdx === undefined) return;
        state.modalPanels[modalIdx].visible = visibility;
        console.log(state.modalPanels[modalIdx]);
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
        (state: Runbook) => state.modalPanels,
        // next sector forwards the uuid arg
        (state: Runbook, uuid: string) => uuid,
      ],
      // output selector can actually use those params
      (modalPanels: Block[], uuid: string): boolean =>
        modalPanels.find((panel) => panel.uuid === uuid)?.visible || false,
    ),
  },
});

export const {
  setBlocks,
  appendBlock,
  setMetadata,
  clearBlocks,
  updateActionItems,
  setModalVisibility,
} = runbooksSlice.actions;

export const { selectRunbook, selectModalVisibility } = runbooksSlice.selectors;
