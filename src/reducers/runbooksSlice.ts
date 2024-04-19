import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, createSelector } from "@reduxjs/toolkit";
import { CommandData, RunbookMetadata } from "../components/main/types";
import { Output } from "../components/main/output";
import { Variable } from "../components/main/variable";
import {
  StacksWalletInteraction,
  StacksWalletInteractionType,
} from "../components/main/stacks/stacks-wallet-interaction";
import { sortCommands } from "../utils/helpers";
import { CommandSectionType } from "../components/main/command-section";

export interface IndexedRunbook {
  metadata: RunbookMetadata;
  data?: CommandData[];
  commandSections: CommandSectionIndex[];
  isDirty: boolean;
  fieldDirtinessMap: { [key: string]: boolean };
  isActive: boolean;
}
export type RunbookState = IndexedRunbook[];
const EMPTY_MANUAL = {} as IndexedRunbook;
const initialState: RunbookState = [];

export interface SerializedRunbookData {
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

function findRunbookIdx(runbooks: IndexedRunbook[], uuid: string): number {
  return runbooks.findIndex((runbook) => runbook.metadata.uuid === uuid);
}

const findRunbook = (
  runbooks: IndexedRunbook[],
  uuid: string,
): IndexedRunbook => {
  return (
    runbooks.find((runbook) => runbook.metadata.uuid === uuid) || EMPTY_MANUAL
  );
};

const findActiveRunbook = (runbooks: IndexedRunbook[]): IndexedRunbook => {
  return runbooks.find((runbook) => runbook.isActive === true) || EMPTY_MANUAL;
};

export const runbooksSlice = createSlice({
  name: "runbooks",
  initialState,
  reducers: (create) => ({
    addRunbook: create.reducer(
      (state, action: PayloadAction<[RunbookMetadata, boolean]>) => {
        const [metadata, isActive] = action.payload;
        const { uuid } = metadata;
        if (findRunbookIdx(state, uuid) !== -1) {
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
    setRunbookData: create.reducer(
      (state, action: PayloadAction<SerializedRunbookData>) => {
        const { data, uuid } = action.payload;
        const runbookIdx = findRunbookIdx(state, uuid);
        if (runbookIdx === -1) {
          console.error(`runbook has not been initialized: ${uuid}`);
          return;
        }
        let runbookData: CommandData[] = JSON.parse(data);
        runbookData.sort(sortCommands);
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
        } of runbookData) {
          for (const key in commandInputsEvaluationResult) {
            fieldDirtinessMap[`${key}-${constructUuid}`] = false;
          }
          for (const key in constructsExecutionResult) {
            fieldDirtinessMap[`${key}-${constructUuid}`] = false;
          }
          let spec_name = commandInstance.specification.name;

          if (spec_name === ConstructDisplayType.StacksWalletSign) {
            let interactionData = {
              name: commandInstance.name,
              inputs: commandInputsEvaluationResult,
              uuid: constructUuid,
              runbookUuid: uuid,
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
              runbookUuid: uuid,
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
              runbookUuid: uuid,
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
        state[runbookIdx] = {
          ...state[runbookIdx],
          data: runbookData,
          commandSections,
          fieldDirtinessMap,
        };
      },
    ),
    updateFieldDirtinessMap: create.reducer(
      (
        state,
        action: PayloadAction<{
          runbookUuid: string;
          mapKey: string;
          fieldIsDirty: boolean;
        }>,
      ) => {
        const { runbookUuid, mapKey, fieldIsDirty } = action.payload;
        const runbookIdx = findRunbookIdx(state, runbookUuid);
        if (runbookIdx === -1) {
          console.error(`runbook has not been initialized: ${runbookUuid}`);
          return;
        }

        const { fieldDirtinessMap } = state[runbookIdx];
        fieldDirtinessMap[mapKey] = fieldIsDirty;
        const isDirty = Object.keys(fieldDirtinessMap).some(
          (key) => fieldDirtinessMap[key],
        );
        state[runbookIdx] = {
          ...state[runbookIdx],
          isDirty,
          fieldDirtinessMap,
        };
      },
    ),
    setActiveRunbook: create.reducer((state, action: PayloadAction<string>) => {
      const newActiveUuid = action.payload;
      const newActiveIdx = findRunbookIdx(state, newActiveUuid);
      if (newActiveIdx === -1) {
        console.error(`runbook has not been initialized: ${newActiveUuid}`);
        return;
      }
      const currentActiveIdx = state.findIndex(
        (runbook) => runbook.isActive === true,
      );
      state[currentActiveIdx] = { ...state[currentActiveIdx], isActive: false };
      state[newActiveIdx] = { ...state[newActiveIdx], isActive: true };
    }),
  }),
  selectors: {
    selectActiveRunbook: findActiveRunbook,
    selectRunbook: findRunbook,
    selectIsDirty:
      createSelector([findRunbook], (runbook) => runbook.isDirty) || false,
  },
});

export const {
  addRunbook,
  setRunbookData,
  updateFieldDirtinessMap,
  setActiveRunbook,
} = runbooksSlice.actions;

export const { selectRunbook, selectActiveRunbook, selectIsDirty } =
  runbooksSlice.selectors;
