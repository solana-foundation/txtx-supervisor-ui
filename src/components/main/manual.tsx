import React from "react";
import { Variable } from "./variable";
import { Output } from "./output";
import { GET_MANUAL } from "../../utils/queries";
import { useQuery } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  setManualData,
  selectActiveManual,
  ConstructDisplayType,
} from "../../reducers/manualsSlice";
import {
  StacksWalletInteraction,
  StacksWalletInteractionType,
} from "./stacks/stacks-wallet-interaction";
import { Disclosure, Transition } from "@headlessui/react";
import CommandSection, { CommandSectionType } from "./command-section";
import { CommandInputEvaluationResult } from "./types";

export default function Manual() {
  const dispatch = useAppDispatch();
  const { metadata, data, isDirty } = useAppSelector(selectActiveManual);
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

  // todo: move this whole indexing section to the manual slice
  type CommandSectionIndex = {
    type: CommandSectionType;
    items: React.JSX.Element[];
  };
  let commandSections: CommandSectionIndex[] = [];
  let currentSection: CommandSectionType | null = null;
  let cursor = -1;
  let manualUuid = metadata.uuid;
  for (let i = 0; i < data.length; i++) {
    const {
      readonly,
      constructUuid,
      commandInstance,
      commandInputsEvaluationResult,
      constructsExecutionResult,
    } = data[i];
    let spec_name = commandInstance.specification.name;
    if (spec_name === ConstructDisplayType.StacksWalletSign) {
      let inputs =
        (commandInputsEvaluationResult?.web_interact as unknown as CommandInputEvaluationResult) ||
        null;
      let interactionData = {
        name: commandInstance.name,
        inputs,
        uuid: constructUuid,
        manualUuid,
        interactionType: StacksWalletInteractionType.Sign,
      };
      let interactionNode = (
        <StacksWalletInteraction {...interactionData} key={constructUuid} />
      );

      if (currentSection === CommandSectionType.Action) {
        commandSections[cursor].items.push(interactionNode);
      } else {
        currentSection = CommandSectionType.Action;
        commandSections.push({
          type: currentSection,
          items: [interactionNode],
        });
        cursor++;
      }
    } else if (!readonly) {
      let inputData = {
        name: commandInstance.name,
        inputs: commandInputsEvaluationResult,
        outputs: constructsExecutionResult,
        uuid: constructUuid,
        manualUuid,
      };

      let inputNode = <Variable {...inputData} key={constructUuid} />;
      if (currentSection === CommandSectionType.Input) {
        commandSections[cursor].items.push(inputNode);
      } else {
        currentSection = CommandSectionType.Input;
        commandSections.push({ type: currentSection, items: [inputNode] });
        cursor++;
      }
    } else {
      let outputData = {
        name: commandInstance.name,
        inputs: commandInputsEvaluationResult,
        outputs: constructsExecutionResult,
        state: commandInstance.state,
        uuid: constructUuid,
        manualUuid,
      };

      let outputNode = <Output {...outputData} key={constructUuid} />;

      if (currentSection === CommandSectionType.Output) {
        commandSections[cursor].items.push(outputNode);
      } else {
        currentSection = CommandSectionType.Output;
        commandSections.push({ type: currentSection, items: [outputNode] });
        cursor++;
      }
    }
  }
  console.log("command sections", commandSections);

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
      {commandSections.map((commandSection) => {
        let panel = (
          <Disclosure.Panel as="div" className="ml-2">
            {...commandSection.items}
          </Disclosure.Panel>
        );

        return <CommandSection type={commandSection.type} panel={panel} />;
      })}
    </div>
  );
}
