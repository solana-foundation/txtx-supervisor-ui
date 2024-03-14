import React from "react";
import {
  CommandInputEvaluationResult,
  ConstructExecutionResult,
} from "./types";
import { LabeledCodeBlock } from "./labeled-code-block";

export interface Output {
  name: string;
  inputs: CommandInputEvaluationResult;
  outputs: ConstructExecutionResult;
  uuid: string;
  manualUuid: string;
}
export function Output({ name, inputs, outputs, uuid, manualUuid }: Output) {
  let outputsToDisplay =
    outputs && Object.keys(outputs).length ? outputs : { value: "" };
  return (
    <div className="mt-4">
      <p className="text-sm font-medium dark:text-white/90 leading-6">{name}</p>
      <p className="text-sm font-medium dark:text-slate-500 leading-6">
        {inputs?.description || "No description provided"}
      </p>
      <LabeledCodeBlock
        data={outputsToDisplay}
        uuid={uuid}
        manualUuid={manualUuid}
        readonly={true}
      />
    </div>
  );
}
