import React from "react";
import {
  CommandInputEvaluationResult,
  ConstructExecutionResult,
} from "./types";
import { LabeledCodeBlock } from "./labeled-code-block";
import { filterKeysFromObject } from "../../utils/helpers";

export interface Variable {
  name: string;
  inputs: CommandInputEvaluationResult;
  outputs: ConstructExecutionResult;
  uuid: string;
  manualUuid: string;
}

// todo: this is definitely not how we want to decide what inputs to display
const EDITABLE_INPUTS = [
  "value",
  "default",
  "nonce",
  "contract_id",
  "function_name",
  "args",
];

export function Variable({ name, inputs, uuid, manualUuid }: Variable) {
  let filteredInputs = filterKeysFromObject(inputs, EDITABLE_INPUTS);
  return (
    <div className="mt-4">
      <p className="text-sm font-medium dark:text-white/90 leading-6">{name}</p>
      <p className="text-sm font-medium dark:text-slate-500 leading-6">
        {inputs?.description || "No description provided"}
      </p>
      <LabeledCodeBlock
        data={filteredInputs}
        uuid={uuid}
        manualUuid={manualUuid}
      />
    </div>
  );
}
