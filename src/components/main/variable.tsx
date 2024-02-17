import React from "react";
import { CodeBlock } from "./code-block";
import {
  CommandInputEvaluationResult,
  ConstructExecutionResult,
} from "./types";

export interface Variable {
  name: string;
  inputs: CommandInputEvaluationResult;
  outputs: ConstructExecutionResult;
  uuid: string;
}
export function Variable({ name, inputs, outputs }: Variable) {
  return (
    <div className="mt-4">
      <p className="text-sm font-medium dark:text-white/90 leading-6">{name}</p>
      <p className="text-sm font-medium dark:text-slate-500 leading-6">
        {inputs.description}
      </p>
      <CodeBlock data={outputs} />
    </div>
  );
}
