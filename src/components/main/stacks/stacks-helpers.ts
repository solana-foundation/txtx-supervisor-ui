import {
  ContractCallPayload,
  Payload,
} from "@stacks/transactions/dist/payload";
import { StacksWalletInteractionType } from "./sign-transaction";
import {
  AddressVersion,
  AnchorMode,
  PayloadType,
  UnsignedContractCallOptions,
  addressToString,
  makeUnsignedContractCall,
} from "@stacks/transactions";
import { bytesToHex } from "@stacks/common";
import { getAddress } from "sats-connect";
import { StacksNetworkName } from "@stacks/network";
import { userSession } from "./stacks";
export const TXTX_LOCAL_STORAGE_KEY = "txtx_addresses";

export const getPublicKey = async (address): Promise<string | undefined> => {
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

  const network = address.substr(0, 2) === "SP" ? "Mainnet" : "Testnet";
  let pubKey;
  const getAddressOptions = {
    payload: {
      purposes: ["stacks"],
      message: "Address for signing the transaction.",
      network: {
        type: network,
      },
    },
    onFinish: (response) => {
      const accounts = response.addresses;
      for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        if (address === account.address) {
          currentStorage[address] = account.publicKey;
          localStorage.setItem(
            TXTX_LOCAL_STORAGE_KEY,
            JSON.stringify(currentStorage),
          );
          pubKey = account.publicKey;
        }
      }
      if (pubKey === undefined) {
        console.error(
          `Address mismatch between user session and selected wallet address.`,
        );
      }
    },
  };

  // @ts-ignore
  await getAddress(getAddressOptions);
  return pubKey;
};

export const payloadToUnsignedTxHex = async (
  payload: Payload,
  networkId: StacksNetworkName,
): Promise<string | undefined> => {
  switch (payload.payloadType) {
    case PayloadType.ContractCall:
      const contractCallPayload = payload as ContractCallPayload;
      const contractAddress = contractCallPayload.contractAddress;
      console.log(userSession);
      let userData = userSession.loadUserData();
      console.log(userData);
      // todo, we're only returning mainnet address
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
      let publicKey = await getPublicKey(address);
      if (!publicKey) {
        console.error(
          "Unable to sign transaction - could not acquire public key",
        );
        return;
      }
      const txOpts: UnsignedContractCallOptions = {
        publicKey: publicKey,
        contractAddress: addressToString(contractAddress),
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
