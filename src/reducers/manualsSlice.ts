import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, createSelector } from "@reduxjs/toolkit";
import { ManualData, ManualMetadata } from "../components/main/types";
import { Output } from "../components/main/output";
import { Variable } from "../components/main/variable";

export interface IndexedManual {
  metadata: ManualMetadata;
  data?: ManualData[];
  variables: Variable[];
  outputs: Output[];
  isDirty: boolean;
  fieldDirtinessMap: { [key: string]: boolean };
  isActive: boolean;
}
export type ManualState = IndexedManual[];
const EMPTY_MANUAL = {} as IndexedManual;
const initialState: ManualState = [];

export interface SerializedManualData {
  uuid: string;
  data: string;
}
export enum Construct {
  Variable = "Variable",
  Output = "Output",
}

function findManualIdx(manuals: IndexedManual[], uuid: string): number {
  return manuals.findIndex((manual) => manual.metadata.uuid === uuid);
}

const findManual = (manuals: IndexedManual[], uuid: string): IndexedManual => {
  return (
    manuals.find((manual) => manual.metadata.uuid === uuid) || EMPTY_MANUAL
  );
};

const findActiveManual = (manuals: IndexedManual[]): IndexedManual => {
  return manuals.find((manual) => manual.isActive === true) || EMPTY_MANUAL;
};

export const manualsSlice = createSlice({
  name: "manuals",
  initialState,
  reducers: (create) => ({
    addManual: create.reducer(
      (state, action: PayloadAction<[ManualMetadata, boolean]>) => {
        const [metadata, isActive] = action.payload;
        const { uuid } = metadata;
        if (findManualIdx(state, uuid) !== -1) {
          console.error("uuid collision", uuid);
          return;
        }
        state.push({
          metadata,
          variables: [],
          outputs: [],
          isDirty: false,
          fieldDirtinessMap: {},
          isActive,
        });
      },
    ),
    setManualData: create.reducer(
      (state, action: PayloadAction<SerializedManualData>) => {
        const { data, uuid } = action.payload;
        const manualIdx = findManualIdx(state, uuid);
        if (manualIdx === -1) {
          console.error(`manual has not been initialized: ${uuid}`);
          return;
        }
        const manualData: ManualData[] = JSON.parse(data);
        const variables: Variable[] = [];
        const outputs: Output[] = [];
        const fieldDirtinessMap: { [key: string]: boolean } = {};

        for (const {
          constructUuid,
          commandInstance,
          commandInputsEvaluationResult,
          constructsExecutionResult,
        } of manualData) {
          for (const key in commandInputsEvaluationResult) {
            fieldDirtinessMap[`${key}-${constructUuid}`] = false;
          }
          for (const key in constructsExecutionResult) {
            fieldDirtinessMap[`${key}-${constructUuid}`] = false;
          }
          switch (commandInstance.specification.name) {
            case Construct.Variable:
              variables.push({
                name: commandInstance.name,
                inputs: commandInputsEvaluationResult,
                outputs: constructsExecutionResult,
                uuid: constructUuid,
                manualUuid: uuid,
              });
              break;
            case Construct.Output:
              outputs.push({
                name: commandInstance.name,
                inputs: commandInputsEvaluationResult,
                outputs: constructsExecutionResult,
                uuid: constructUuid,
                manualUuid: uuid,
              });
              break;
          }
        }
        state[manualIdx] = {
          ...state[manualIdx],
          outputs,
          variables,
          data: manualData,
          fieldDirtinessMap,
        };
      },
    ),
    updateFieldDirtinessMap: create.reducer(
      (
        state,
        action: PayloadAction<{
          manualUuid: string;
          mapKey: string;
          fieldIsDirty: boolean;
        }>,
      ) => {
        const { manualUuid, mapKey, fieldIsDirty } = action.payload;
        const manualIdx = findManualIdx(state, manualUuid);
        if (manualIdx === -1) {
          console.error(`manual has not been initialized: ${manualUuid}`);
          return;
        }

        const { fieldDirtinessMap } = state[manualIdx];
        fieldDirtinessMap[mapKey] = fieldIsDirty;
        const isDirty = Object.keys(fieldDirtinessMap).some(
          (key) => fieldDirtinessMap[key],
        );
        state[manualIdx] = { ...state[manualIdx], isDirty, fieldDirtinessMap };
      },
    ),
    setActiveManual: create.reducer((state, action: PayloadAction<string>) => {
      const newActiveUuid = action.payload;
      const newActiveIdx = findManualIdx(state, newActiveUuid);
      if (newActiveIdx === -1) {
        console.error(`manual has not been initialized: ${newActiveUuid}`);
        return;
      }
      const currentActiveIdx = state.findIndex(
        (manual) => manual.isActive === true,
      );
      state[currentActiveIdx] = { ...state[currentActiveIdx], isActive: false };
      state[newActiveIdx] = { ...state[newActiveIdx], isActive: true };
    }),
  }),
  selectors: {
    selectActiveManual: findActiveManual,
    selectManual: findManual,
    selectIsDirty:
      createSelector([findManual], (manual) => manual.isDirty) || false,
  },
});

export const {
  addManual,
  setManualData,
  updateFieldDirtinessMap,
  setActiveManual,
} = manualsSlice.actions;

export const { selectManual, selectActiveManual, selectIsDirty } =
  manualsSlice.selectors;
