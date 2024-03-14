import {
  ContractCallPayload,
  Payload,
} from "@stacks/transactions/dist/payload";
import {
  StacksWalletInteractionType,
  userSession,
} from "./stacks-wallet-interaction";
import {
  AnchorMode,
  PayloadType,
  UnsignedContractCallOptions,
  addressToString,
  makeUnsignedContractCall,
} from "@stacks/transactions";
import { getKeys } from "@stacks/connect";
import { bytesToHex } from "@stacks/common";

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

export const payloadToUnsignedTxHex = async (
  payload: Payload,
): Promise<string> => {
  switch (payload.payloadType) {
    case PayloadType.ContractCall:
      const contractCallPayload = payload as ContractCallPayload;
      const txOpts: UnsignedContractCallOptions = {
        publicKey: getKeys(userSession).publicKey,
        contractAddress: addressToString(contractCallPayload.contractAddress),
        contractName: contractCallPayload.contractName.content,
        functionName: contractCallPayload.functionName.content,
        functionArgs: contractCallPayload.functionArgs,
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
        null,
        "\t",
      );
    default:
      throw new Error("Unimplemented payload type");
  }
};
