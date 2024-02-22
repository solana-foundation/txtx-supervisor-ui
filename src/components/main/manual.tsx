import React from "react";
import { Variable } from "./variable";
import { Output } from "./output";
import { GET_MANUAL } from "../../utils/queries";
import { useQuery } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { addManualData, selectActiveManual } from "../../reducers/manualsSlice";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Manual() {
  const dispatch = useAppDispatch();
  const { metadata, data, variables, outputs, isDirty } =
    useAppSelector(selectActiveManual);

  const { loading, error } = useQuery(GET_MANUAL, {
    variables: {
      manualName: metadata?.uuid,
    },
    skip: !metadata?.uuid || isDirty,
    onCompleted: (result) => {
      dispatch(addManualData(result.manual));
    },
  });

  if (loading || !data) {
    return <div>Loading...</div>;
  }
  return (
    <div className="max-w-3xl">
      <div className="px-4 sm:px-0">
        <h1 className={isDirty ? "" : "hidden"}>Dirty boi</h1>
        <h1 className="text-3xl font-medium leading-7 dark:text-emerald-400">
          {metadata.name}
        </h1>
        <p className="mt-1 max-w-2xl font-medium leading-6 dark:text-white/90">
          {metadata.description}
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
