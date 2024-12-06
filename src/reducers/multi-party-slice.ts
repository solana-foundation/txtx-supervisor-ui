import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import useCookie, { AUTH_COOKIE_KEY } from "../hooks/useCookie";
import type { AuthResult } from "@txtxrun/txtx-ui-kit";

export interface MultiPartySharing {
  totp: string;
  httpEndpointUrl: string;
  wsEndpointUrl: string;
  slug: string;
}
export interface MultiPartyMode {
  enabled: boolean;
  auth?: AuthResult;
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
      (state, action: PayloadAction<AuthResult>) => {
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
    auth: (state) => state.auth,
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
  auth,
  isMultiPartyAuthenticated,
  isMultiPartyInstantiated,
  selectMultiPartySharing,
} = multiPartySlice.selectors;
