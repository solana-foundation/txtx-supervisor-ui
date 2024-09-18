import { Addon, AddonError } from "../../../../utils/addons";
import {
  getStorageKey,
  storePublicKeyInLocalStorage,
} from "../../../../utils/helpers";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi";
import { getAccount, sendTransaction, signMessage } from "@wagmi/core";
import {
  Chain,
  parseTransaction,
  SendTransactionParameters,
  TransactionSerializable,
} from "viem";
import supportedChains from "./chains";

const projectId = "a750324b860cf7867328c96408bc03ac";
const metadata = {
  name: "Txtx",
  description: "Build confidence with smart contract Runbooks",
  url: "http://localhost:1234",
  icons: [],
};

// const allChainsAsConst: AsConst<typeof allChains> = allChains;
export const wagmiConfig = defaultWagmiConfig({
  chains: supportedChains,
  projectId,
  metadata,
});

export class EvmAddon implements Addon {
  private modal: any;
  constructor() {
    this.modal = createWeb3Modal({
      wagmiConfig,
      projectId,
      enableAnalytics: false,
      enableOnramp: false,
    });
  }
  public async connectWallet() {
    if (this.modal.getIsConnectedState()) {
      console.warn(
        "unnecessary call of walletConnection when user is signed in",
      );
      return;
    }
    this.modal.open();
  }

  public disconnectWallet() {
    this.modal.disconnect();
  }

  public getAddress(networkId: string): string | AddonError {
    const account = getAccount(wagmiConfig);
    if (account.address) {
      return account.address;
    }
    return { error: "failed to get evm address" };
  }

  public async getPublicKey(
    networkId: string,
    address: string,
    message: string,
  ): Promise<string | AddonError> {
    const result = await signMessage(wagmiConfig, {
      account: address as any,
      message,
    });
    storePublicKeyInLocalStorage(getStorageKey("evm"), address, result);
    return result;
  }

  public isWalletConnected(): boolean {
    const account = getAccount(wagmiConfig);
    let isConnected = account.isConnected;
    return isConnected;
  }

  public async signMessage(
    networkId: string,
    address: string,
    message: string,
  ): Promise<string | AddonError> {
    const result = await signMessage(wagmiConfig, {
      account: address as any,
      message,
    });
    return result;
  }

  public async sendTransaction(
    txHex: string,
    signerAddress: string,
  ): Promise<string | AddonError> {
    const parsedTransaction = parseTransaction(toHexPrefixed(txHex));

    let chain = wagmiConfig.chains.find(
      (chain) => chain.id === parsedTransaction.chainId,
    );
    if (!chain) {
      return { error: `Chain id ${parsedTransaction.chainId} not supported.` };
    }
    let sendTransactionParams = toSendTransactionParams(
      parsedTransaction,
      signerAddress,
      chain,
    );

    const txHash = await sendTransaction(wagmiConfig, sendTransactionParams);
    return txHash;
  }

  public async signTransaction(
    _txHash: string,
    _signerAddress: string,
  ): Promise<string | AddonError> {
    return { error: "Sign Transaction not supported for Stacks" };
  }
}

function toSendTransactionParams(
  tx: TransactionSerializable,
  signerAddress: string,
  chain: Chain,
): SendTransactionParameters {
  return {
    account: toHexPrefixed(signerAddress),
    chain: chain,
    data: tx.data,
    gas: tx.gas,
    gasPrice: tx.gasPrice,
    nonce: tx.nonce,
    to: tx.to,
    value: tx.value,
  };
}
type HexString = `0x${string}`;
function toHexPrefixed(address: string): HexString {
  if (!address.startsWith("0x")) {
    address = `0x${address}`;
  }
  return address as HexString;
}
