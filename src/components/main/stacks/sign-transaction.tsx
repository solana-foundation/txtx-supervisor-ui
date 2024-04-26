import React from "react";
import { BytesReader } from "@stacks/transactions";
import { deserializePayload } from "@stacks/transactions/dist/payload";
import { payloadToUnsignedTxHex } from "./stacks-helpers";
import { GET_MANUAL, UPDATE_COMMAND_INPUT } from "../../../utils/queries";
import { setRunbookData } from "../../../reducers/runbooks-slice";
import { StacksNetworkName } from "@stacks/network";
import { store } from "../../../store";
import { apolloClient } from "../../..";
import { Prompt } from "../types";

export enum StacksWalletInteractionType {
  Sign,
  Send,
}

export interface AddonPanelProps {
  prompt: Prompt;
}

export function SignTransactionPanel({ prompt }: AddonPanelProps) {
  let inputs = prompt.inputs;
  let hex;
  if (!inputs?.transaction_payload_bytes) {
    hex = "empty";
  } else {
    // I couldn't get the css to work to break the long line of hex, so I'm injecting
    // some invisible whitespace
    hex = inputs?.transaction_payload_bytes.split("").reduce((hex, char, i) => {
      if (i % 5 === 0) {
        hex += "​" + char;
      } else {
        hex += char;
      }
      return hex;
    }, "");
  }
  return (
    <div className="w-full px-2 py-4 bg-zinc-950 rounded border border-zinc-600 flex-col justify-start items-start gap-2.5 inline-flex">
      <div className="w-full block self-stretch bg-zinc-950 break-all text-wrap text-zinc-300 rounded-sm text-sm font-medium font-['Inter']">
        {hex}
      </div>
    </div>
  );
}

export function SignTransactionPrimaryButton({ prompt }: AddonPanelProps) {
  const { inputs, uuid, runbookUuid } = prompt;
  let deserializedPayload;
  if (inputs !== null) {
    const bytesReader = new BytesReader(
      Buffer.from(inputs.transaction_payload_bytes.slice(2), "hex"),
    );
    deserializedPayload = deserializePayload(bytesReader);
  }
  let networkId: StacksNetworkName =
    (inputs?.network_id as StacksNetworkName) || "testnet";

  const onClick = async (_) => {
    if (!deserializedPayload) return;
    const txHex = await payloadToUnsignedTxHex(deserializedPayload, networkId);

    // @ts-ignore
    const { result } = await window.LeatherProvider.request(
      "stx_signTransaction",
      { txHex },
    );
    const value = {
      signed_transaction_bytes: result.txHex,
      nonce: 0, // todo
    };
    await apolloClient.mutate({
      mutation: UPDATE_COMMAND_INPUT,
      update(cache, { data: { updateCommandInput } }) {
        const runbookData = {
          uuid: runbookUuid,
          data: updateCommandInput,
        };
        cache.writeQuery({
          query: GET_MANUAL,
          data: {
            runbook: runbookData,
          },
        });
        store.dispatch(setRunbookData(runbookData));
      },
      variables: {
        runbookName: runbookUuid,
        commandUuid: uuid.replace("local:", ""),
        inputName: "",
        value: JSON.stringify(value),
      },
    });
  };
  return onClick;
}
