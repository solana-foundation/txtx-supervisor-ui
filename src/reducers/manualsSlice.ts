import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, createSelector } from "@reduxjs/toolkit";
import {
  CommandInputEvaluationResult,
  CommandData,
  ManualMetadata,
} from "../components/main/types";
import { Output } from "../components/main/output";
import { Variable } from "../components/main/variable";
import {
  StacksWalletInteraction,
  StacksWalletInteractionType,
} from "../components/main/stacks/stacks-wallet-interaction";
import { sortCommands } from "../utils/helpers";
import { CommandSectionType } from "../components/main/command-section";

export interface IndexedManual {
  metadata: ManualMetadata;
  data?: CommandData[];
  commandSections: CommandSectionIndex[];
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

export type CommandSectionIndex = {
  type: CommandSectionType;
  items: (Variable | StacksWalletInteraction | Output)[];
};

// todo: move away from hard-coded strings (use state?)
export namespace ConstructDisplayType {
  export const Input = new Set(["Variable"]);
  export const Readonly = new Set([
    "Output",
    "Stacks Contract Call",
    "Decode Stacks Contract Call",
    "Send Stacks Transaction",
    "Broadcast Stacks Transaction",
  ]);
  export const StacksWalletSign = "Sign Stacks Transaction";
  export const StacksWalletInteraction = new Set(["Sign Stacks Transaction"]);
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
          isDirty: false,
          commandSections: [],
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
        let manualData: CommandData[] = JSON.parse(data);
        manualData.sort(sortCommands);
        const fieldDirtinessMap: { [key: string]: boolean } = {};
        let commandSections: CommandSectionIndex[] = [];
        let currentSection: CommandSectionType | null = null;
        let cursor = -1;

        for (const {
          readonly,
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
          let spec_name = commandInstance.specification.name;

          if (spec_name === ConstructDisplayType.StacksWalletSign) {
            let inputs =
              (commandInputsEvaluationResult?.web_interact as unknown as CommandInputEvaluationResult) ||
              null;
            let interactionData = {
              name: commandInstance.name,
              inputs,
              uuid: constructUuid,
              manualUuid: uuid,
              interactionType: StacksWalletInteractionType.Sign,
            };

            if (currentSection === CommandSectionType.Action) {
              commandSections[cursor].items.push(interactionData);
            } else {
              currentSection = CommandSectionType.Action;
              commandSections.push({
                type: currentSection,
                items: [interactionData],
              });
              cursor++;
            }
          } else if (!readonly) {
            let inputData = {
              name: commandInstance.name,
              inputs: commandInputsEvaluationResult,
              outputs: constructsExecutionResult,
              uuid: constructUuid,
              manualUuid: uuid,
            };

            if (currentSection === CommandSectionType.Input) {
              commandSections[cursor].items.push(inputData);
            } else {
              currentSection = CommandSectionType.Input;
              commandSections.push({
                type: currentSection,
                items: [inputData],
              });
              cursor++;
            }
          } else {
            let outputData = {
              name: commandInstance.name,
              inputs: commandInputsEvaluationResult,
              outputs: constructsExecutionResult,
              state: commandInstance.state,
              uuid: constructUuid,
              manualUuid: uuid,
            };

            if (currentSection === CommandSectionType.Output) {
              commandSections[cursor].items.push(outputData);
            } else {
              currentSection = CommandSectionType.Output;
              commandSections.push({
                type: currentSection,
                items: [outputData],
              });
              cursor++;
            }
          }
        }
        state[manualIdx] = {
          ...state[manualIdx],
          data: manualData,
          commandSections,
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
