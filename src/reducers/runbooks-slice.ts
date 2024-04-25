import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, createSelector } from "@reduxjs/toolkit";
import {
  CommandData,
  CommandSectionIndex,
  CommandSectionType,
  Input,
  Output,
  Prompt,
  Action,
  RunbookMetadata,
  SerializedRunbookData,
} from "../components/main/types";
import { sortCommands } from "../utils/helpers";

export interface IndexedRunbook {
  metadata: RunbookMetadata;
  data?: CommandData[]; // todo: see if we can remove
  commandSections: CommandSectionIndex[];
  isDirty: boolean;
  fieldDirtinessMap: { [key: string]: boolean };
  isActive: boolean;
  activeStep: number;
}
export type RunbookState = IndexedRunbook[];
const EMPTY_MANUAL = {} as IndexedRunbook;
const initialState: RunbookState = [];

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
          activeStep: 0,
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
        let outputs: Output[] = [];

        for (const {
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

          const type = commandInstance.typing;
          if (type === "Prompt") {
            if (commandInstance.namespace === null) {
              console.error("prompt must have namespace");
              continue;
            }
            let promptData: Prompt = {
              name: commandInstance.specification.name,
              instanceName: commandInstance.name,
              inputs: commandInputsEvaluationResult,
              uuid: constructUuid,
              runbookUuid: uuid,
              namespace: commandInstance.namespace,
            };

            if (currentSection === CommandSectionType.Prompt) {
              commandSections[cursor].items.push(promptData);
            } else {
              currentSection = CommandSectionType.Prompt;
              commandSections.push({
                type: currentSection,
                items: [promptData],
              });
              cursor++;
            }
          } else if (type === "Action") {
            if (commandInstance.namespace === null) {
              console.error("action must have namespace");
              continue;
            }
            let actionData: Action = {
              name: commandInstance.specification.name,
              instanceName: commandInstance.name,
              inputs: commandInputsEvaluationResult,
              uuid: constructUuid,
              runbookUuid: uuid,
              namespace: commandInstance.namespace,
            };
            // todo
            if (currentSection === CommandSectionType.Action) {
              commandSections[cursor].items.push(actionData);
            } else {
              currentSection = CommandSectionType.Action;
              commandSections.push({
                type: currentSection,
                items: [actionData],
              });
              cursor++;
            }
          } else if (type === "Input") {
            let input: Input = {
              commandUuid: constructUuid,
              value: commandInputsEvaluationResult.value,
              default: commandInputsEvaluationResult.default,
              description: commandInputsEvaluationResult.description,
            };

            if (currentSection === CommandSectionType.Input) {
              commandSections[cursor].items.push(input);
            } else {
              currentSection = CommandSectionType.Input;
              commandSections.push({
                type: currentSection,
                items: [input],
              });
              cursor++;
            }
          } else if (type === "Output") {
            outputs.push({
              commandUuid: constructUuid,
              value: commandInputsEvaluationResult.value,
              description: commandInputsEvaluationResult.description,
            });
          } else {
            console.error(
              `invalid command type ${type} for command ${constructUuid}`,
            );
            continue;
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
    setActiveRunbookActiveStep: create.reducer(
      (state, action: PayloadAction<number>) => {
        const activeRunbook = findActiveRunbook(state);
        const idx = findRunbookIdx(state, activeRunbook.metadata.uuid);
        state[idx] = { ...state[idx], activeStep: action.payload };
      },
    ),
  }),
  selectors: {
    selectActiveRunbook: findActiveRunbook,
    selectRunbook: findRunbook,
    selectIsDirty:
      createSelector([findRunbook], (runbook) => runbook.isDirty) || false,
    selectActiveRunbookActiveStep:
      createSelector([findActiveRunbook], (runbook) => runbook.activeStep) || 0,
  },
});

export const {
  addRunbook,
  setRunbookData,
  updateFieldDirtinessMap,
  setActiveRunbook,
  setActiveRunbookActiveStep,
} = runbooksSlice.actions;

export const {
  selectRunbook,
  selectActiveRunbook,
  selectIsDirty,
  selectActiveRunbookActiveStep,
} = runbooksSlice.selectors;
