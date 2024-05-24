import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type ActiveStep = number;
const initialState: ActiveStep = 0;

export const runbookStepSlice = createSlice({
  name: "activeStep",
  initialState,
  reducers: (create) => ({
    setRunbookActiveStep: create.reducer((_, action: PayloadAction<number>) => {
      return action.payload;
    }),
  }),
  selectors: {
    selectRunbookActiveStep: (state) => state,
  },
});

export const { setRunbookActiveStep } = runbookStepSlice.actions;

export const { selectRunbookActiveStep } = runbookStepSlice.selectors;
