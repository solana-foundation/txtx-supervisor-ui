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
}

export interface ConstructExecutionResult {
  [key: string]: string;
}

export interface CommandInputEvaluationResult {
  [key: string]: string;
}

export interface ManualData {
  constructUuid: string;
  commandInstance: CommandInstance;
  constructsExecutionResult: ConstructExecutionResult;
  commandInputsEvaluationResult: CommandInputEvaluationResult;
}

export interface Manual {
  name: string;
  description: string;
  data: ManualData[];
}

export interface ManualDescription {
  name: string;
  description: string;
  id: string;
  constructUuids: string[];
}
