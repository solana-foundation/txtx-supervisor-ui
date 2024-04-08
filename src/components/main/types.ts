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

export interface CommandInstance {
  name: string;
  packageUuid: string;
  specification: CommandSpecification;
  state: CommandInstanceState;
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

export interface ManualData {
  constructUuid: string;
  commandInstance: CommandInstance;
  constructsExecutionResult: ConstructExecutionResult;
  commandInputsEvaluationResult: CommandInputEvaluationResult;
}

export interface Protocol {
  name: string;
  manuals: Array<ManualMetadata>;
}
export interface ManualMetadata {
  name: string;
  description: string;
  uuid: string;
  constructUuids: string[];
}
