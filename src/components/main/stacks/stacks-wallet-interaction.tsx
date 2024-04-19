import React from "react";
import { CommandInputEvaluationResult } from "../types";
import { Connect } from "@stacks/connect-react";
import {
  showConnect,
  AppConfig,
  UserSession,
  openContractCall,
} from "@stacks/connect";
import {
  BytesReader,
  PayloadType,
  addressToString,
} from "@stacks/transactions";
import {
  ContractCallPayload,
  Payload,
  deserializePayload,
} from "@stacks/transactions/dist/payload";
import { NetworkBadge } from "../network-badge";
import {
  interactionTypeToButtonTitle,
  payloadToDisplayString,
  payloadToUnsignedTxHex,
} from "./stacks-helpers";
import { CodeBlock } from "../code-block";
import { useMutation } from "@apollo/client";
import { GET_MANUAL, UPDATE_COMMAND_INPUT } from "../../../utils/queries";
import { setRunbookData } from "../../../reducers/runbooksSlice";
import { useAppDispatch } from "../../../hooks";
import { StacksNetworkName } from "@stacks/network";

export enum StacksWalletInteractionType {
  Sign,
  Send,
}
export interface StacksWalletInteraction {
  name: string;
  inputs: CommandInputEvaluationResult | null;
  uuid: string;
  runbookUuid: string;
  interactionType: StacksWalletInteractionType;
}
export function StacksWalletInteraction({
  name,
  inputs,
  uuid,
  runbookUuid,
  interactionType,
}: StacksWalletInteraction) {
  let deserializedPayload;
  if (inputs !== null) {
    const bytesReader = new BytesReader(
      Buffer.from(inputs.transaction_payload_bytes.slice(2), "hex"),
    );
    deserializedPayload = deserializePayload(bytesReader);
  }
  let networkId: StacksNetworkName =
    (inputs?.network_id as StacksNetworkName) || "testnet";

  const codeBlockFieldName = `${interactionTypeToButtonTitle(
    interactionType,
  )}-Transaction`;
  const codeBlockDataKey = `${codeBlockFieldName}-${uuid}`;

  const auth = {
    manifestPath: "/static/manifest.json",
    redirectTo: "/",
    finished: console.log,

    appDetails: {
      name: "txtx",
      icon: "url",
    },
  };
  return (
    <div className="mt-4">
      <p className="text-sm font-medium dark:text-white/90 leading-6">{name}</p>
      <p className="text-sm font-medium dark:text-slate-500 leading-6">
        {inputs?.description || "No description provided"}
      </p>

      <NetworkBadge network="Stacks" />

      <CodeBlock
        code={
          deserializedPayload
            ? payloadToDisplayString(deserializedPayload)
            : `"Waiting on user input to compute payload."`
        }
        dataKey={codeBlockDataKey}
        fieldName={codeBlockFieldName}
        runbookUuid={runbookUuid}
        constructUuid={uuid}
        readonly={true}
      />
      <div className="flex mt-4 py-3 justify-end ">
        <button
          type="button"
          className="rounded-md dark:bg-white/10 px-3 py-2 mx-4 text-sm font-semibold dark:text-white shadow-sm hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
        >
          Create txtx.link
        </button>
        <Connect authOptions={auth}>
          <StacksInteractButton
            payload={deserializedPayload}
            interactionType={interactionType}
            uuid={uuid}
            runbookUuid={runbookUuid}
            networkId={networkId}
          />
        </Connect>
      </div>
    </div>
  );
}

const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSession = new UserSession({ appConfig });
export const authOptions = {
  appDetails: {
    name: "txtx",
    icon: window.location.origin, // todo
  },
  redirectTo: "/",
  onFinish: () => {
    window.location.reload();
  },
  userSession,
};
function authenticate() {
  showConnect(authOptions);
}

interface StacksInteractionButton {
  payload: Payload | null;
  interactionType: StacksWalletInteractionType;
  uuid: string;
  runbookUuid: string;
  networkId: StacksNetworkName;
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function StacksInteractButton({
  payload,
  interactionType,
  uuid,
  runbookUuid,
  networkId,
}: StacksInteractionButton) {
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

  const onClick = async () => {
    if (!payload) return;
    if (interactionType === StacksWalletInteractionType.Send) {
      switch (payload.payloadType) {
        case PayloadType.ContractCall:
          const contractCallPayload = payload as ContractCallPayload;
          openContractCall({
            onFinish: console.log,
            contractAddress: addressToString(
              contractCallPayload.contractAddress,
            ),
            contractName: contractCallPayload.contractName.content,
            functionName: contractCallPayload.functionName.content,
            functionArgs: contractCallPayload.functionArgs,
          });
        default:
          throw new Error("Unimplemented payload type");
      }
    } else if (interactionType === StacksWalletInteractionType.Sign) {
      const txHex = await payloadToUnsignedTxHex(payload, networkId);

      // @ts-ignore
      const { result } = await window.LeatherProvider.request(
        "stx_signTransaction",
        { txHex },
      );
      const value = {
        signed_transaction_bytes: result.txHex,
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
      throw new Error("Unimplemented wallet interaction type");
    }
  };

  const buttonTitle = interactionTypeToButtonTitle(interactionType);

  if (userSession.isUserSignedIn()) {
    return (
      <button
        onClick={onClick}
        type="button"
        disabled={payload === null}
        className="rounded-md dark:bg-emerald-400/80 mx-2 px-3 py-2 text-sm font-semibold dark:text-white shadow-sm hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400/90 "
      >
        {buttonTitle} Transaction
      </button>
    );
  } else {
    return (
      <button
        onClick={authenticate}
        type="button"
        className="rounded-md dark:bg-emerald-400/80 mx-2 px-3 py-2 text-sm font-semibold dark:text-white shadow-sm hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400/90"
      >
        Connect Wallet
      </button>
    );
  }
}
function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
