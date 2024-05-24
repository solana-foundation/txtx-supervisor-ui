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
import addonManager from "../utils/addons-initializer";

export interface IndexedRunbook {
  metadata: RunbookMetadata;
  data?: CommandData[]; // todo: see if we can remove
  commandSections: CommandSectionIndex[];
  namespacedNetworks: { [key: string]: string[] };
  outputs: Output[];
  isDirty: boolean;
  fieldDirtinessMap: { [key: string]: boolean };
  isActive: boolean;
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
          namespacedNetworks: {},
          outputs: [],
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
        let namespacedNetworks = {};
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
            const namespace = commandInstance.namespace;
            if (namespace === null) {
              console.error("prompt must have namespace");
              continue;
            }
            let prompt: Prompt = {
              name: commandInstance.specification.name,
              instanceName: commandInstance.name,
              inputs: commandInputsEvaluationResult,
              uuid: constructUuid,
              runbookUuid: uuid,
              namespace: namespace,
            };

            const networkId = commandInputsEvaluationResult
              ? commandInputsEvaluationResult["network_id"]
              : undefined; // todo
            if (networkId !== undefined) {
              addonManager.addNetworkInstance(namespace, networkId);
            }

            currentSection = CommandSectionType.Prompt;
            commandSections.push({
              type: currentSection,
              items: [prompt],
            });
            cursor++;
          } else if (type === "Action") {
            if (commandInstance.namespace === null) {
              console.error("action must have namespace");
              continue;
            }
            let action: Action = {
              name: commandInstance.specification.name,
              instanceName: commandInstance.name,
              inputs: commandInputsEvaluationResult,
              uuid: constructUuid,
              runbookUuid: uuid,
              namespace: commandInstance.namespace,
            };
            // TODO: our addons need to provide onclick handlers that perform a
            // dispatch. However, you can only perform a dispatch from inside of
            // a react component. We can directly call store.dispatch(), and this
            // was working before, but once we import the addonManager here,
            // which has dependencies that import the store, we create weird
            // circular dependency issues. Apparently it's a big no-no with redux.
            // So we need to find a workaround. One idea I don't like is to
            // have the addon return a button rather than the onclick handler
            // I don't like this because we can't enforce properties of that
            // component with types. When just providing the onclick handler,
            // we can enable/disable and style all buttons without giving
            // addons any control

            // let namespace = action.namespace;
            // let addon = addonManager.getAddonFromNamespace(namespace);

            // let actionContent = addon.getActionElement(action);

            // if (actionContent !== undefined) {
            if (false) {
              if (currentSection === CommandSectionType.Action) {
                commandSections[cursor].items.push(action);
              } else {
                currentSection = CommandSectionType.Action;
                commandSections.push({
                  //@ts-ignore
                  type: currentSection,
                  items: [action],
                });
                cursor++;
              }
            }
          } else if (type === "Input") {
            let input: Input = {
              commandUuid: constructUuid,
              runbookUuid: uuid,
              value: commandInputsEvaluationResult.value,
              default: commandInputsEvaluationResult.default,
              description: commandInputsEvaluationResult.description,
            };
            if (input.value === undefined) {
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
            }
          } else if (type === "Output") {
            outputs.push({
              commandUuid: constructUuid,
              value: commandInputsEvaluationResult.value,
              name: commandInstance.name,
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
          namespacedNetworks,
          fieldDirtinessMap,
          outputs,
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
