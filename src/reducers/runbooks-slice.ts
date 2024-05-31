import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  RunbookMetadata,
  Block,
  deserializeBlock,
  UpdateActionItemEvent,
} from "../components/main/types";

export interface Runbook {
  metadata: RunbookMetadata;
  blocks: Block[];
  namespacedNetworks: { [key: string]: string[] };
}
const initialState: Runbook = {
  metadata: {
    name: "",
    description: "",
    uuid: "",
  },
  blocks: [],
  namespacedNetworks: {},
};

export const runbooksSlice = createSlice({
  name: "runbooks",
  initialState,
  reducers: (create) => ({
    setBlocks: create.reducer(
      (state, action: PayloadAction<Block<false>[]>) => {
        const blocks: Block[] = action.payload.map(deserializeBlock);
        state = {
          ...state,
          blocks,
        };
        return state;
      },
    ),
    appendBlock: create.reducer(
      (state, action: PayloadAction<Block<false>>) => {
        const block: Block = deserializeBlock(action.payload);
        state.blocks.push(block);
      },
    ),
    clearBlocks: create.reducer((state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        return {
          ...state,
          blocks: [],
        };
      }
      return state;
    }),
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
        state.blocks = state.blocks.map((block) => ({
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
  },
});

export const {
  setBlocks,
  appendBlock,
  setMetadata,
  clearBlocks,
  updateActionItems,
} = runbooksSlice.actions;

export const { selectRunbook } = runbooksSlice.selectors;
