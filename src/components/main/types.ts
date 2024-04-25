export interface CommandOutput {
  name: string;
  documentation: string;
  typing: string;
}

export interface CommandInput {
  name: string;
  documentation: string;
  typing: string;
  optional: boolean;
}

export interface CommandSpecification {
  documentation: string;
  name: string;
  inputs: CommandInput[];
  outputs: CommandOutput[];
}

export type CommandInstanceType = CommandSectionTypeString;
export interface CommandInstance {
  name: string;
  packageUuid: string;
  specification: CommandSpecification;
  state: CommandInstanceState;
  namespace: string | null;
  typing: CommandInstanceType;
}

export interface ConstructExecutionResult {
  [key: string]: string;
}

export interface CommandInputEvaluationResult {
  [key: string]: string;
}

export enum CommandInstanceState {
  New = "New",
  Evaluated = "Evaluated",
  AwaitingUserInput = "AwaitingUserInput",
  AwaitingAsyncRequest = "AwaitingAsyncRequest",
  Aborted = "Aborted",
  Failed = "Failed",
}

export interface CommandData {
  index: number;
  constructUuid: string;
  commandInstance: CommandInstance;
  constructsExecutionResult: ConstructExecutionResult;
  commandInputsEvaluationResult: CommandInputEvaluationResult;
}
export enum CommandSectionType {
  Input,
  Action,
  Prompt,
  Output,
}
export type CommandSectionTypeString =
  | "Input"
  | "Action"
  | "Prompt"
  | "Output"
  | "Module";

export interface Protocol {
  name: string;
  runbooks: Array<RunbookMetadata>;
}
export interface RunbookMetadata {
  name: string;
  description: string;
  uuid: string;
  constructUuids: string[];
}

export interface Prompt {
  name: string;
  instanceName: string;
  inputs: CommandInputEvaluationResult | null;
  uuid: string;
  runbookUuid: string;
  namespace: string;
}

export interface Action {
  name: string;
  instanceName: string;
  inputs: CommandInputEvaluationResult | null;
  uuid: string;
  runbookUuid: string;
  namespace: string;
}

export interface Input {
  value?: string | boolean | number;
  default?: string | boolean | number;
  description?: string;
  commandUuid: string;
}

export interface Output {
  value?: string | boolean | number;
  description?: string;
  commandUuid: string;
}

export interface SerializedRunbookData {
  uuid: string;
  data: string;
}

export type CommandSectionIndex = {
  type: CommandSectionType;
  items: (Input | Prompt | Action)[];
};
