import {
  ContractCallPayload,
  Payload,
} from "@stacks/transactions/dist/payload";
import { StacksWalletInteractionType } from "./stacks-wallet-interaction";
import {
  AnchorMode,
  PayloadType,
  UnsignedContractCallOptions,
  addressToString,
  makeUnsignedContractCall,
} from "@stacks/transactions";
import { bytesToHex } from "@stacks/common";
import { getAddress } from "sats-connect";

export const interactionTypeToButtonTitle = (
  type: StacksWalletInteractionType,
) => {
  switch (type) {
    case StacksWalletInteractionType.Send:
      return "Send";
    case StacksWalletInteractionType.Sign:
      return "Sign";
  }
};

export const getPublicKey = async () => {
  let publicKey;
  const getAddressOptions = {
    payload: {
      purposes: ["stacks"],
      message: "Address for signing the transaction.",
      network: {
        type: "Testnet",
      },
    },
    onFinish: (response) => {
      publicKey = response.addresses[0].publicKey;
    },
  };
  // @ts-ignore
  await getAddress(getAddressOptions);
  return publicKey;
};

export const payloadToUnsignedTxHex = async (
  payload: Payload,
): Promise<string> => {
  switch (payload.payloadType) {
    case PayloadType.ContractCall:
      const contractCallPayload = payload as ContractCallPayload;
      let publicKey = await getPublicKey();
      const txOpts: UnsignedContractCallOptions = {
        publicKey: publicKey,
        contractAddress: addressToString(contractCallPayload.contractAddress),
        contractName: contractCallPayload.contractName.content,
        functionName: contractCallPayload.functionName.content,
        functionArgs: contractCallPayload.functionArgs,
        network: "testnet",
        anchorMode: AnchorMode.Any,
      };
      const tx = await makeUnsignedContractCall(txOpts);
      return bytesToHex(tx.serialize());
    default:
      throw new Error("Unimplemented payload type");
  }
};

export const payloadToDisplayString = (payload: Payload): string => {
  switch (payload.payloadType) {
    case PayloadType.ContractCall:
      const contractCallPayload = payload as ContractCallPayload;
      return JSON.stringify(
        {
          contractAddress: addressToString(contractCallPayload.contractAddress),
          contractName: contractCallPayload.contractName.content,
          functionName: contractCallPayload.functionName.content,
          functionArgs: contractCallPayload.functionArgs,
        },
        (key, value) => (typeof value === "bigint" ? value.toString() : value), // return everything else unchanged
        "\t",
      );
    default:
      throw new Error("Unimplemented payload type");
  }
};
