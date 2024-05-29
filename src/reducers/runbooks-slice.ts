import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  RunbookMetadata,
  Block,
  deserializeBlock,
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
        console.log("setting state with blocks ", blocks);
        state = {
          ...state,
          blocks,
        };
        return state;
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

export const { setBlocks, setMetadata } = runbooksSlice.actions;

export const { selectRunbook } = runbooksSlice.selectors;
