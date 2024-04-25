import {
  ContractCallPayload,
  Payload,
} from "@stacks/transactions/dist/payload";
import { StacksWalletInteractionType } from "./sign-transaction";
import {
  AnchorMode,
  PayloadType,
  UnsignedContractCallOptions,
  addressToString,
  makeUnsignedContractCall,
} from "@stacks/transactions";
import { bytesToHex } from "@stacks/common";
import { getAddress } from "sats-connect";
import { StacksNetworkName } from "@stacks/network";

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
  networkId: StacksNetworkName,
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
        network: networkId,
        anchorMode: AnchorMode.Any,
      };
      const tx = await makeUnsignedContractCall(txOpts);
      return bytesToHex(tx.serialize());
    default:
      throw new Error("Unimplemented payload type");
  }
};
