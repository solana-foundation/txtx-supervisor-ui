import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import useCookie, { AUTH_COOKIE_KEY } from "../hooks/useCookie";

export interface MultiPartyAuth {
  userId: string;
}
export interface MultiPartySharing {
  totp: string;
  httpEndpointUrl: string;
  wsEndpointUrl: string;
  slug: string;
}
export interface MultiPartyMode {
  enabled: boolean;
  auth?: MultiPartyAuth;
  sharing?: MultiPartySharing;
}
const initialState: MultiPartyMode = {
  enabled: false,
};

export const multiPartySlice = createSlice({
  name: "multiPartyMode",
  initialState,
  reducers: (create) => ({
    setMultiPartyEnabled: create.reducer(
      (state, action: PayloadAction<boolean>) => {
        state.enabled = action.payload;
      },
    ),
    setMultiPartyAuth: create.reducer(
      (state, action: PayloadAction<MultiPartyAuth>) => {
        state.auth = action.payload;
      },
    ),
    clearMultiPartyAuth: create.reducer((state) => {
      state.auth = undefined;
    }),
    setMultiPartySharing: create.reducer(
      (state, action: PayloadAction<MultiPartySharing>) => {
        state.sharing = action.payload;
      },
    ),
    clearMultiPartySharing: create.reducer((state) => {
      state.sharing = undefined;
    }),
  }),
  selectors: {
    isMultiPartyEnabled: (state) => state.enabled,
    isMultiPartyAuthenticated: (state) =>
      state.auth !== undefined && useCookie(AUTH_COOKIE_KEY) !== undefined,
    isMultiPartyInstantiated: (state) => state.sharing !== undefined,
    selectMultiPartySharing: (state) => state.sharing,
  },
});

export const {
  setMultiPartyEnabled,
  setMultiPartyAuth,
  clearMultiPartyAuth,
  setMultiPartySharing,
  clearMultiPartySharing,
} = multiPartySlice.actions;

export const {
  isMultiPartyEnabled,
  isMultiPartyAuthenticated,
  isMultiPartyInstantiated,
  selectMultiPartySharing,
} = multiPartySlice.selectors;
