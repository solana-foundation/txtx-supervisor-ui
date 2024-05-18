import {
  ContractCallPayload,
  Payload,
} from "@stacks/transactions/dist/payload";
import {
  AddressVersion,
  AnchorMode,
  PayloadType,
  UnsignedContractCallOptions,
  UnsignedMultiSigContractCallOptions,
  addressToString,
  makeUnsignedContractCall,
} from "@stacks/transactions";
import { bytesToHex } from "@stacks/common";
import {
  StacksMainnet,
  StacksNetworkName,
  StacksTestnet,
} from "@stacks/network";
import { appDetails, userSession } from "./stacks";
import { openSignatureRequestPopup } from "@stacks/connect";
export const TXTX_LOCAL_STORAGE_KEY = "txtx_addresses";

export const getPublicKey = async (
  address,
  networkId: string,
): Promise<string | undefined> => {
  const addresses = localStorage.getItem(TXTX_LOCAL_STORAGE_KEY);
  let currentStorage = {};
  if (addresses) {
    const parsed = JSON.parse(addresses);
    if (parsed) {
      const pubKey = parsed[address];
      if (pubKey) {
        return pubKey;
      } else {
        currentStorage = parsed;
      }
    }
  }

  let pubKey;
  await openSignatureRequestPopup({
    message: "Test message.",
    network: networkId == "mainnet" ? new StacksMainnet() : new StacksTestnet(),
    appDetails: appDetails,
    onFinish(response) {
      currentStorage[address] = response.publicKey;
      localStorage.setItem(
        TXTX_LOCAL_STORAGE_KEY,
        JSON.stringify(currentStorage),
      );
      pubKey = response.publicKey;
      if (pubKey === undefined) {
        console.error(
          `Address mismatch between user session and selected wallet address.`,
        );
      }
    },
  });

  return pubKey;
};

export const payloadToUnsignedTxHex = async (
  payload: Payload,
  networkId: StacksNetworkName,
  public_keys?: string[],
): Promise<string | undefined> => {
  switch (payload.payloadType) {
    case PayloadType.ContractCall:
      const contractCallPayload = payload as ContractCallPayload;
      const contractAddress = contractCallPayload.contractAddress;

      let userData = userSession.loadUserData();
      let addresses = userData.profile.stxAddress;
      let address;
      if (
        contractAddress.version === AddressVersion.MainnetMultiSig ||
        contractAddress.version === AddressVersion.MainnetSingleSig
      ) {
        address = addresses.mainnet;
      } else {
        address = addresses.testnet;
      }
      let publicKey = await getPublicKey(address, networkId);
      if (!publicKey) {
        console.error(
          "Unable to sign transaction - could not acquire public key",
        );
        return;
      }
      let txOpts:
        | UnsignedContractCallOptions
        | UnsignedMultiSigContractCallOptions;
      if (public_keys) {
        txOpts = {
          numSignatures: public_keys.length || 0,
          publicKeys: public_keys,
          contractAddress: addressToString(contractAddress),
          contractName: contractCallPayload.contractName.content,
          functionName: contractCallPayload.functionName.content,
          functionArgs: contractCallPayload.functionArgs,
          network: networkId,
          anchorMode: AnchorMode.Any,
        };
      } else {
        txOpts = {
          publicKey: publicKey,
          contractAddress: addressToString(contractAddress),
          contractName: contractCallPayload.contractName.content,
          functionName: contractCallPayload.functionName.content,
          functionArgs: contractCallPayload.functionArgs,
          network: networkId,
          anchorMode: AnchorMode.Any,
        };
      }
      const tx = await makeUnsignedContractCall(txOpts);
      return bytesToHex(tx.serialize());
    default:
      throw new Error("Unimplemented payload type");
  }
};
