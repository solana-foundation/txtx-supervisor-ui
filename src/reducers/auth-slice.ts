import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface Auth {
  tokenNeeded?: boolean;
  token?: string;
}
const initialState: Auth = {};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: (create) => ({
    setTokenNeeded: create.reducer((state, action: PayloadAction<boolean>) => {
      state.tokenNeeded = action.payload;
    }),
    setToken: create.reducer((state, action: PayloadAction<string>) => {
      state.token = action.payload;
    }),
    clearToken: create.reducer((state) => {
      state.token = undefined;
    }),
  }),
  selectors: {
    selectTokenNeeded: (state) => state.tokenNeeded,
    selectIsTokenSet: (state) => state.token !== undefined,
    selectToken: (state) => state.token,
  },
});

export const { setTokenNeeded, setToken, clearToken } = authSlice.actions;

export const { selectTokenNeeded, selectIsTokenSet, selectToken } =
  authSlice.selectors;
