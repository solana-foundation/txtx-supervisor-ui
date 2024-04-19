import React from "react";
import {
  CommandInputEvaluationResult,
  CommandInstanceState,
  ConstructExecutionResult,
} from "./types";
import { LabeledCodeBlock } from "./labeled-code-block";
import { useQuery } from "@apollo/client";
import { GET_COMMAND_INSTANCE_STATE } from "../../utils/queries";
import { useAppDispatch } from "../../hooks";
import { setRunbookData } from "../../reducers/runbooksSlice";

export interface Output {
  name: string;
  inputs: CommandInputEvaluationResult;
  outputs: ConstructExecutionResult;
  uuid: string;
  runbookUuid: string;
  state: CommandInstanceState;
}

export function Output({
  name,
  inputs,
  outputs,
  uuid,
  runbookUuid,
  state,
}: Output) {
  const dispatch = useAppDispatch();
  let outputsToDisplay =
    outputs && Object.keys(outputs).length ? outputs : { value: "" };

  const { loading, error, refetch } = useQuery(GET_COMMAND_INSTANCE_STATE, {
    variables: {
      runbookName: runbookUuid,
      constructUuid: uuid,
    },
    onCompleted: (result) => {
      const state = JSON.parse(result.runbook.commandInstanceState).state;
      if (state != CommandInstanceState.AwaitingAsyncRequest) {
        dispatch(setRunbookData(result.runbook));
      }
    },
    notifyOnNetworkStatusChange: true,
    pollInterval: state == CommandInstanceState.AwaitingAsyncRequest ? 500 : 0,
    skip: state !== CommandInstanceState.AwaitingAsyncRequest,
  });
  const content = outputsToDisplay["error"] ? (
    <p className="text-sm font-medium dark:text-red-600 leading-6">
      {
        // @ts-ignore
        outputsToDisplay["error"].message
      }
    </p>
  ) : (
    <LabeledCodeBlock
      data={outputsToDisplay}
      uuid={uuid}
      runbookUuid={runbookUuid}
      readonly={true}
    />
  );

  return (
    <div className="mt-4">
      <p className="text-sm font-medium dark:text-white/90 leading-6">{name}</p>
      <p className="text-sm font-medium dark:text-slate-500 leading-6">
        {inputs?.description || "No description provided"}
      </p>
      {content}
    </div>
  );
}
