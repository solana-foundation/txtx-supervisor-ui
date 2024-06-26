import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface ParticipantAuth {
  participantTokenNeeded?: boolean;
  participantToken?: string;
}
const initialState: ParticipantAuth = {};

export const participantAuthSlice = createSlice({
  name: "participantAuth",
  initialState,
  reducers: (create) => ({
    setParticipantTokenNeeded: create.reducer(
      (state, action: PayloadAction<boolean>) => {
        state.participantTokenNeeded = action.payload;
      },
    ),
    setParticipantToken: create.reducer(
      (state, action: PayloadAction<string>) => {
        state.participantToken = action.payload;
      },
    ),
    clearParticipantToken: create.reducer((state) => {
      state.participantToken = undefined;
    }),
  }),
  selectors: {
    selectParticipantTokenNeeded: (state) => state.participantTokenNeeded,
    selectParticipantToken: (state) => state.participantToken,
  },
});

export const {
  setParticipantTokenNeeded,
  setParticipantToken,
  clearParticipantToken,
} = participantAuthSlice.actions;

export const { selectParticipantTokenNeeded, selectParticipantToken } =
  participantAuthSlice.selectors;
