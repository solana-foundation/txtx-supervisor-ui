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
  let deserializedPayload;
  if (!inputs?.transaction_payload_bytes) {
    deserializedPayload = {};
  } else {
    const bytesReader = new BytesReader(
      Buffer.from(inputs.transaction_payload_bytes.slice(2), "hex"),
    );
    deserializedPayload = deserializePayload(bytesReader);
  }
  const jsonPayload = JSON.stringify(
    deserializedPayload,
    (key, value) => (typeof value === "bigint" ? value.toString() : value),
    "\t",
  );
  return (
    <div className="w-full max-h-[500px] px-2 py-4 bg-neutral-900 border-neutral-800 rounded border  flex-col justify-start items-start gap-2.5 inline-flex">
      <div className="w-full max-h-[500px] overflow-y-auto bg-neutral-900 text-gray-400 rounded-sm text-sm font-medium font-['Inter'] scrollbar-thin scrollbar scrollbar-track-neutral-800 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
        <pre className="scrollbar-w-1 scrollbar-h-1 scrollbar  scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          {jsonPayload}
        </pre>
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
