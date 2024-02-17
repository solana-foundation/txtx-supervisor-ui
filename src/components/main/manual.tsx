import React, { useContext, useState } from "react";
import { Variable } from "./variable";
import { Output } from "./output";
import { ActiveManualContext } from "../../App";
import { GET_MANUAL } from "../../utils/queries";
import { useQuery } from "@apollo/client";
import { Manual, ManualData } from "./types";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

interface SerializedManualData {
  name: string;
  description: string;
  data: string;
}
enum Construct {
  Variable = "Variable",
  Output = "Output",
}

export default function Manual() {
  const { activeManualId } = useContext(ActiveManualContext);
  const [activeManualData, setActiveManualData] = useState<Manual>();
  const [variables, setVariables] = useState<Variable[]>([]);
  const [outputs, setOutputs] = useState<Output[]>([]);
  const { loading, error } = useQuery(GET_MANUAL, {
    variables: {
      manualName: activeManualId,
    },
    skip: !activeManualId,
    onCompleted: (result) => {
      const { data, name, description }: SerializedManualData = result.manual;
      const manualData: ManualData[] = JSON.parse(data);
      const manual: Manual = { name, data: manualData, description };
      const variables: Variable[] = [];
      const outputs: Output[] = [];
      for (const construct of manualData) {
        switch (construct.commandInstance.specification.name) {
          case Construct.Variable:
            variables.push({
              name: construct.commandInstance.name,
              inputs: construct.commandInputsEvaluationResult,
              outputs: construct.constructsExecutionResult,
              uuid: construct.constructUuid,
            });
            break;
          case Construct.Output:
            outputs.push({
              name: construct.commandInstance.name,
              inputs: construct.commandInputsEvaluationResult,
              outputs: construct.constructsExecutionResult,
              uuid: construct.constructUuid,
            });
            break;
        }
      }
      setVariables(variables);
      setOutputs(outputs);
      setActiveManualData(manual);
    },
  });

  if (loading || !activeManualData) {
    return <div>Loading...</div>;
  }
  return (
    <div className="max-w-3xl">
      <div className="px-4 sm:px-0">
        <h1 className="text-3xl font-medium leading-7 dark:text-emerald-400">
          {activeManualData.name}
        </h1>
        <p className="mt-1 max-w-2xl font-medium leading-6 dark:text-white/90">
          {activeManualData.description}
        </p>
      </div>
      {/* Inputs */}
      <div className={classNames(variables.length ? "" : "hidden", "mt-6")}>
        <h2 className="uppercase border-b dark:border-slate-500/20 text-md font-medium dark:text-slate-500">
          Variables
        </h2>
        {variables.map((variable) => (
          <Variable {...variable} key={variable.uuid} />
        ))}
      </div>
      <div className={classNames(outputs.length ? "" : "hidden", "mt-6")}>
        <h2 className="uppercase border-b dark:border-slate-500/20 text-md font-medium dark:text-slate-500">
          Outputs
        </h2>
        {outputs.map((output) => (
          <Output {...output} key={output.uuid} />
        ))}
      </div>
    </div>
  );
}
