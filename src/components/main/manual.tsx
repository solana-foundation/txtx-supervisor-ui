import React from "react";
import { Variable } from "./variable";
import { Output } from "./output";
import { GET_MANUAL } from "../../utils/queries";
import { useQuery } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setManualData, selectActiveManual } from "../../reducers/manualsSlice";
import { StacksWalletInteraction } from "./stacks/stacks-wallet-interaction";
import { Disclosure, Transition } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Manual() {
  const dispatch = useAppDispatch();
  const {
    metadata,
    data,
    variables,
    outputs,
    stacksWalletInteractions,
    isDirty,
  } = useAppSelector(selectActiveManual);
  const { loading, error } = useQuery(GET_MANUAL, {
    variables: {
      manualName: metadata?.uuid,
    },
    skip: !metadata?.uuid || isDirty,
    onCompleted: (result) => {
      dispatch(setManualData(result.manual));
    },
  });

  if (loading || !data) {
    return <div>Loading...</div>;
  }
  return (
    <div className="max-w-3xl">
      <div className="px-4 sm:px-0">
        <div className={isDirty ? "w-full flex justify-center" : "hidden"}>
          <div className="text-center w-10/12 py-1 mb-10   rounded-xl dark:bg-orange-500/20 dark:text-orange-500">
            Preview Mode: Some notice to user communicating information.
          </div>
        </div>
        <h1 className="text-3xl font-medium leading-7 dark:text-emerald-400">
          {metadata.name}
        </h1>
        <p className="mt-1 max-w-2xl font-medium leading-6 dark:text-white/90">
          {metadata.description}
        </p>
      </div>
      <Disclosure
        as="div"
        defaultOpen={true}
        className={classNames(
          variables.length ? "" : "hidden",
          "mt-6 cursor-pointer",
        )}
      >
        <Disclosure.Button
          as="h2"
          className="uppercase border-b dark:border-slate-500/20 text-md font-medium dark:text-orange-500 dark:bg-orange-500/20 p-6 rounded"
        >
          Inputs Review
        </Disclosure.Button>
        <Transition
          enter="transition duration-200 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-100 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Disclosure.Panel as="div" className="ml-2">
            {variables.map((variable) => (
              <Variable {...variable} key={variable.uuid} />
            ))}
          </Disclosure.Panel>
        </Transition>
      </Disclosure>

      <Disclosure
        as="div"
        defaultOpen={false}
        className={classNames(
          variables.length ? "" : "hidden",
          "mt-6 cursor-pointer",
        )}
      >
        <Disclosure.Button
          as="h2"
          className="mt-6 uppercase border-b dark:border-slate-500/20 text-md font-medium dark:text-purple-500 dark:bg-purple-500/20 p-6 rounded"
        >
          Execution Plan Review Review
        </Disclosure.Button>
        <Transition
          enter="transition duration-200 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-100 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Disclosure.Panel as="div" className="ml-2">
            <div className={classNames(outputs.length ? "" : "hidden", "mt-6")}>
              {outputs.map((output) => (
                <Output {...output} key={output.uuid} />
              ))}
            </div>
            <div
              className={classNames(
                stacksWalletInteractions.length ? "" : "hidden",
                "mt-6",
              )}
            >
              {stacksWalletInteractions.map((interaction) => (
                <StacksWalletInteraction
                  {...interaction}
                  key={interaction.uuid}
                />
              ))}
            </div>
          </Disclosure.Panel>
        </Transition>
      </Disclosure>
    </div>
  );
}
