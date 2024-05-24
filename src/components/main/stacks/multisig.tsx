import React from "react";
import { BytesReader, deserializeTransaction } from "@stacks/transactions";
import { GET_MANUAL, UPDATE_COMMAND_INPUT } from "../../../utils/queries";
import { setRunbookData } from "../../../reducers/runbooks-slice";
import posthog from "posthog-js";
import { PrimaryPanelButton } from "../panel";
import { useAppDispatch } from "../../../hooks";
import { useMutation } from "@apollo/client";
import { AddonButtonProps, AddonPanelProps } from "./sign-transaction";

export function MultisigPanel({ prompt }: AddonPanelProps) {
  let inputs = prompt.inputs;
  let deserializedTransaction;
  if (!inputs?.transaction_payload_bytes) {
    deserializedTransaction = {};
  } else {
    const bytesReader = new BytesReader(
      Buffer.from(inputs.transaction_payload_bytes.slice(2), "hex"),
    );
    deserializedTransaction = deserializeTransaction(bytesReader);
  }
  const jsonPayload = JSON.stringify(
    deserializedTransaction,
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

export function MultisigTransactionPrimaryButton({
  prompt,
  panelIndex,
  scrollHandler,
}: AddonButtonProps) {
  const dispatch = useAppDispatch();
  const [updateCommandInput, { data, loading, error }] = useMutation(
    UPDATE_COMMAND_INPUT,
    {
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
        dispatch(setRunbookData(runbookData));
      },
    },
  );

  const { inputs, uuid, runbookUuid } = prompt;
  let txHex;
  if (inputs !== null) {
    if (inputs.transaction_payload_bytes) {
      txHex = inputs.transaction_payload_bytes;
    }
  }

  const onClick = async (_) => {
    if (!txHex) return;
    try {
      // @ts-ignore
      const response = await LeatherProvider.request("stx_signTransaction", {
        txHex,
      });
      if (response.result?.txHex) {
        console.log(response.result.txHex);
        posthog.capture("onchain_success");
        const value = {
          signed_transaction_bytes: response.result.txHex,
          nonce: 0, // todo
        };
        updateCommandInput({
          variables: {
            runbookName: runbookUuid,
            commandUuid: uuid.replace("local:", ""),
            inputName: "",
            value: JSON.stringify(value),
          },
        });
      } else {
        console.error(response.error);
        posthog.capture("onchain_error", {
          addon: "stacks",
          action: "sign_transaction",
          message: response.error.message,
          code: response.error.code,
          data: response.error.data,
        });
      }
    } catch (error) {
      posthog.capture("onchain_failure", {
        addon: "stacks",
        action: "sign_transaction",
        message: error,
      });
      console.error(error);
    }
  };
  return (
    <PrimaryPanelButton
      button={{
        title: "Sign Transaction",
        onClick: onClick,
      }}
      panelIndex={panelIndex}
      scrollHandler={scrollHandler}
    />
  );
}
