import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { ClientDiscoveryResponse } from "../components/main/types";

export interface ParticipantAuth {
  participantTokenNeeded?: boolean;
  participantToken?: string;
}
export interface ParticipantMetadata {
  type: "Participant";
  participantTokenNeeded?: boolean;
  participantToken?: string;
}
export interface OperatorMetadata {
  type: "Operator";
  participantTokenNeeded?: boolean;
}
type ClientMetadata = ParticipantMetadata | OperatorMetadata;

const initialState: ClientMetadata = { type: "Participant" } as ClientMetadata;

export const participantAuthSlice = createSlice({
  name: "participantAuth",
  initialState,
  reducers: (create) => ({
    initializeClient: create.reducer(
      (_, action: PayloadAction<ClientDiscoveryResponse>) => {
        const res = action.payload;
        return {
          type: res.clientType,
          participantTokenNeeded: res.needsCredentials,
        };
      },
    ),
    setParticipantToken: create.reducer(
      (state, action: PayloadAction<string>) => {
        if (state.type !== "Participant") return;
        state.participantToken = action.payload;
      },
    ),
    clearParticipantToken: create.reducer((state) => {
      if (state.type !== "Participant") return;
      state.participantToken = undefined;
    }),
  }),
  selectors: {
    selectParticipantTokenNeeded: (state) => state.participantTokenNeeded,
    selectParticipantToken: (state) =>
      state.type === "Participant" ? state.participantToken : undefined,
    selectIsOperator: (state) => state.type === "Operator",
  },
});

export const { initializeClient, setParticipantToken, clearParticipantToken } =
  participantAuthSlice.actions;

export const {
  selectParticipantTokenNeeded,
  selectParticipantToken,
  selectIsOperator,
} = participantAuthSlice.selectors;
