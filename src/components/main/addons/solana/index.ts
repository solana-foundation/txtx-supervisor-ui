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
const NAMESPACE = "solana";

const localhostEndpoint = "http://127.0.0.1:8899";
const devnet = WalletAdapterNetwork.Devnet;
const devnetEndpoint = clusterApiUrl(devnet);
const testnet = WalletAdapterNetwork.Testnet;
const testnetEndpoint = clusterApiUrl(testnet);
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
  private testnetConnection: Connection;
  private devnetConnection: Connection;
  private localhostConnection: Connection;

  constructor() {
    this.solConnect = new SolanaConnect();

    this.solConnect.onWalletChange(storeSelectedSolanaWallet);

    let wallet = localStorage.getItem(SOLANA_WALLET_STORAGE_KEY);
    if (wallet) {
      this.solConnect.activeWallet = wallet;
      this.solConnect.getWallet()?.connect();
    }

    this.connection = new Connection(mainnetEndpoint);
    this.testnetConnection = new Connection(testnetEndpoint);
    this.devnetConnection = new Connection(devnetEndpoint);
    this.localhostConnection = new Connection(localhostEndpoint);
  }

  public injectProvider(inner: any): React.FunctionComponentElement<any> {
    const withMainnetConnectionProvider = createElement(
      ConnectionContext.Provider,
      {
        children: inner,
        value: { connection: this.connection },
      },
    );
    const withTestnetConnection = createElement(ConnectionContext.Provider, {
      children: withMainnetConnectionProvider,
      value: { connection: this.testnetConnection },
    });
    const withDevnetConnection = createElement(ConnectionContext.Provider, {
      children: withTestnetConnection,
      value: { connection: this.devnetConnection },
    });
    const withLocalhostConnection = createElement(ConnectionContext.Provider, {
      children: withDevnetConnection,
      value: { connection: this.localhostConnection },
    });
    return withMainnetConnectionProvider;
  }

  public connectWallet(): void {
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
  ): Promise<string | AddonError> {
    const wallet = this.solConnect.getWallet();
    if (!wallet) {
      return { error: "cannot get address; wallet not connected" };
    }
    if ("signTransaction" in wallet) {
      const rustTx = RustSolanaTransaction.from_hex(txHex);
      const signed = await wallet.signTransaction(rustTx.toTransaction());
      const signedRustTx = RustSolanaTransaction.fromTransaction(signed);
      return signedRustTx.toHex();
    }
    return {
      error: `signTransaction not implemented by ${wallet.name} wallet`,
    };
  }

  public sendTransaction(
    txHex: string,
    signerAddress: string,
  ): Promise<string | AddonError> {
    throw new Error("Method not implemented.");
  }
}
