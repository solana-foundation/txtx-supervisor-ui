import { Addon, AddonError } from "../../../../utils/addons";
import { ConnectionContext } from "@solana/wallet-adapter-react";

import { createElement } from "react";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { Adapter, WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { SolanaConnect } from "solana-connect";
import {
  getStorageKey,
  storePublicKeyInLocalStorage,
} from "../../../../utils/helpers";
import { RustSolanaTransaction } from "./codec";

const SOLANA_WALLET_STORAGE_KEY = "txtx_solana_wallet";
const NAMESPACE = "svm";
const mainnet = WalletAdapterNetwork.Mainnet;
const mainnetEndpoint = clusterApiUrl(mainnet);

const storeSelectedSolanaWallet = (wallet: Adapter | null) => {
  if (!wallet) {
    localStorage.removeItem(SOLANA_WALLET_STORAGE_KEY);
  } else {
    localStorage.setItem(SOLANA_WALLET_STORAGE_KEY, wallet.name);
  }
};

export default class SolanaAddon implements Addon {
  private solConnect: SolanaConnect;
  private connection: Connection;

  constructor(rpcApiUrl: string) {
    this.solConnect = new SolanaConnect();

    this.solConnect.onWalletChange(storeSelectedSolanaWallet);

    let wallet = localStorage.getItem(SOLANA_WALLET_STORAGE_KEY);
    if (wallet) {
      this.solConnect.activeWallet = wallet;
      this.solConnect.getWallet()?.connect();
    }
    this.connection = new Connection(rpcApiUrl);
  }

  public injectProvider(inner: any): React.FunctionComponentElement<any> {
    const connectionProvider = createElement(ConnectionContext.Provider, {
      children: inner,
      value: { connection: this.connection },
    });
    return connectionProvider;
  }

  public connectWallet(): void {
    const wallet = this.solConnect.getWallet();

    if (wallet) {
      if (wallet.connected) {
        return;
      }
    }
    this.solConnect.openMenu();
  }

  public disconnectWallet(): void {
    this.solConnect.getWallet()?.disconnect();
  }

  public isWalletConnected(): boolean {
    const isConnected = this.solConnect.getWallet()?.connected ?? false;
    if (isConnected) {
      return isConnected;
    }
    this.solConnect.getWallet()?.connect();
    return this.solConnect.getWallet()?.connected ?? false;
  }

  public getAddress(networkId: string): string | AddonError {
    let wallet = this.solConnect.getWallet();
    if (!wallet) {
      return { error: "cannot get address; wallet not connected" };
    }
    let pubKey = wallet.publicKey?.toString();
    if (!pubKey) {
      wallet.connect();
      wallet = this.solConnect.getWallet();
      pubKey = wallet?.publicKey?.toString();
      if (!pubKey) {
        return { error: "cannot get address; wallet had not public key" };
      }
    }

    return pubKey;
  }

  public async getPublicKey(
    networkId: string,
    address: string,
    message: string,
  ): Promise<string | AddonError> {
    const wallet = this.solConnect.getWallet();

    if (!wallet) {
      return { error: "cannot get address; wallet not connected" };
    }
    const pubKey = wallet.publicKey?.toString();
    if (!pubKey) {
      return { error: "wallet had not public key" };
    }

    storePublicKeyInLocalStorage(getStorageKey(NAMESPACE), address, pubKey);
    return pubKey;
  }

  public signMessage(
    networkId: string,
    address: string,
    message: string,
  ): Promise<string | AddonError> {
    throw new Error("Method not implemented.");
  }

  public async signTransaction(
    txHex: string,
    signerAddress: string,
    networkId: string,
  ): Promise<string | AddonError> {
    const wallet = this.solConnect.getWallet();
    if (!wallet) {
      return { error: "cannot get address; wallet not connected" };
    }
    if ("signTransaction" in wallet) {
      const rustTx = RustSolanaTransaction.from_hex(txHex);
      console.log("rustTx", rustTx);

      const connection = this.connection;

      let recentBlockhash;
      try {
        recentBlockhash = await connection.getLatestBlockhash();
      } catch (error) {
        const normalizedMainnetEndpoint = mainnetEndpoint.endsWith("/")
          ? mainnetEndpoint.slice(0, -1)
          : mainnetEndpoint;

        const normalizedRpcEndpoint = this.connection.rpcEndpoint.endsWith("/")
          ? this.connection.rpcEndpoint.slice(0, -1)
          : this.connection.rpcEndpoint;

        if (normalizedRpcEndpoint === normalizedMainnetEndpoint) {
          return {
            error: `Failed to get latest blockhash. The default RPC endpoint (${mainnetEndpoint}) does not allow requests from localhost. Configure your runbook manifest (txtx.yml) with an alternate RPC endpoint for mainnet deployments.`,
          };
        } else {
          return {
            error: "Failed to get latest blockhash; RPC error: " + error,
          };
        }
      }
      let unsignedTx = rustTx.toTransaction(recentBlockhash);
      console.log("unsignedTx", unsignedTx);

      let signed;
      try {
        signed = await wallet.signTransaction(unsignedTx);
      } catch (error) {
        return { error: "Failed to sign transaction: " + error };
      }
      console.log("signed", signed);

      const signedRustTx = RustSolanaTransaction.fromTransaction(signed);
      console.log("signedRustTx", signedRustTx);
      return signedRustTx.toHex();
    }
    return {
      error: `signTransaction not implemented by ${wallet.name} wallet`,
    };
  }

  public sendTransaction(
    txHex: string,
    signerAddress: string,
    _networkId: string,
  ): Promise<string | AddonError> {
    throw new Error("Method not implemented.");
  }
}
