import { Addon, AddonError } from "../../../../utils/addons";
import {
  getStorageKey,
  storePublicKeyInLocalStorage,
} from "../../../../utils/helpers";
import { createAppKit, type AppKit } from "@reown/appkit";
import type { AppKitNetwork } from "@reown/appkit-common";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {
  Config,
  getAccount,
  getChainId,
  sendTransaction,
  signMessage,
  switchChain,
} from "@wagmi/core";
import NonceManager from "./nonce";
import {
  Chain,
  parseTransaction,
  SendTransactionParameters,
  TransactionSerializable,
} from "viem";
import supportedChains from "./chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { createElement } from "react";

const projectId =
  process.env.WALLETCONNECT_PROJECT_ID || "a750324b860cf7867328c96408bc03ac";
const metadata = {
  name: "Txtx",
  description: "Build confidence with smart contract Runbooks",
  url: "http://localhost:1234",
  icons: [],
};

// const allChainsAsConst: AsConst<typeof allChains> = allChains;
// Cast to mutable array for AppKit compatibility
const networks = [...supportedChains] as [AppKitNetwork, ...AppKitNetwork[]];
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
});
const wagmiConfig = wagmiAdapter.wagmiConfig;

export default class EvmAddon implements Addon {
  private modal: AppKit;
  constructor() {
    this.modal = createAppKit({
      adapters: [wagmiAdapter],
      networks,
      metadata,
      projectId,
      features: {
        analytics: false,
        onramp: false,
      },
      allowUnsupportedChain: true,
    });
  }
  public injectProvider(inner: React.ReactNode): React.ReactElement {
    const queryClient = new QueryClient();
    const withQueryClient = createElement(
      QueryClientProvider,
      { client: queryClient },
      inner,
    );
    const withWagmi = createElement(
      WagmiProvider,
      { config: wagmiConfig },
      withQueryClient,
    );
    return withWagmi;
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
    let expectedChainId = parseInt(networkId);
    let foundChain = wagmiConfig.chains.find(
      (chain) => chain.id === expectedChainId,
    );
    if (foundChain == null) {
      addUnknownChain(expectedChainId);
    }

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
      account: address as `0x${string}`,
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
      account: address as `0x${string}`,
      message,
    });
    return result;
  }

  public async sendTransaction(
    txHex: string,
    signerAddress: string,
    networkId: string,
  ): Promise<string | AddonError> {
    const expectedChainId = parseInt(networkId);
    const connectedChainId = getCurrentlyConnectedChainId(wagmiConfig);
    if (expectedChainId !== connectedChainId) {
      let expectedChain = wagmiConfig.chains.find(
        (chain) => chain.id === expectedChainId,
      );
      try {
        let chain = await switchChain(wagmiConfig, {
          chainId: expectedChainId,
        });
        if (chain?.id !== expectedChainId) {
          throw new Error("Chain switch failed");
        }
      } catch (e) {
        return {
          error: `Network id does not match connected network. Change your connected network to '${expectedChain?.name || expectedChainId}' sending the transaction.`,
        };
      }
    }
    const parsedTransaction = parseTransaction(toHexPrefixed(txHex));
    let chain = wagmiConfig.chains.find(
      (chain) => chain.id === parsedTransaction.chainId,
    );
    if (!chain) {
      return { error: `Chain id ${parsedTransaction.chainId} not supported.` };
    }

    const nonce = await NonceManager.getInstance().getNonce(
      signerAddress,
      wagmiConfig, 
      chain.id,
    );

    let sendTransactionParams = toSendTransactionParams(
      parsedTransaction,
      signerAddress,
      chain,
      nonce,
    );

    const txHash = await sendTransaction(wagmiConfig, sendTransactionParams);
    return txHash;
  }

  public async signTransaction(
    _txHash: string,
    _signerAddress: string,
    _networkId: string,
  ): Promise<string | AddonError> {
    return { error: "Sign Transaction not supported for EVM" };
  }
}

function toSendTransactionParams(
  tx: TransactionSerializable,
  signerAddress: string,
  chain: Chain,
  nonce: number,
): SendTransactionParameters {
  return {
    account: toHexPrefixed(signerAddress),
    chain: chain,
    data: tx.data,
    gas: tx.gas,
    gasPrice: tx.gasPrice,
    nonce: nonce,
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

function getCurrentlyConnectedChainId(config: Config): number {
  if (config.state.current != null) {
    let connection = config.state.connections.get(config.state.current);
    if (connection != null) {
      return connection.chainId;
    }
  }
  return getChainId(config);
}

function addUnknownChain(chainId: number) {
  // @ts-ignore no particularly graceful here, but if this
  //  is some custom unknown chain id, we need to force wagmi to accept it
  // since we're not providing an rpc url, it will use the one set in the wallet
  wagmiConfig.chains.push({
    id: chainId,
    name: "Unknown Chain",
    rpcUrls: {
      default: "",
    },
    nativeCurrency: {
      name: "Unknown Chain",
      symbol: "Unknown",
      decimals: 18,
    },
  });
}
