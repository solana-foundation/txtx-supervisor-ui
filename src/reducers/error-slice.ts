import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ErrorQueue = string[];
let initialState: ErrorQueue = [];

export const errorSlice = createSlice({
  name: "errors",
  initialState,
  reducers: (create) => ({
    pushError: create.reducer((state, action: PayloadAction<string>) => {
      state.push(action.payload);
    }),
    removeFirstError: create.reducer((state) => {
      state.shift();
    }),
  }),
  selectors: {
    selectErrors: (state) => state,
    selectFirstError: (state) => (state.length > 0 ? state[0] : undefined),
  },
});

export const { pushError, removeFirstError } = errorSlice.actions;
export const { selectErrors, selectFirstError } = errorSlice.selectors;
