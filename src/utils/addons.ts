import { phLogOnChainError, phLogOnChainSuccess } from "../posthog";

const PH_GET_ADDRESS = "get_address";
const PH_GET_PUBLIC_KEY = "get_public_key";
const PH_SIGN_MESSAGE = "sign_message";
const PH_SIGN_TRANSACTION = "sign_transaction";
export class AddonManager {
  public addons: { [namespace: string]: { addon: Addon; networks: string[] } } =
    {};

  public registerAddon(namespace: string, addon: Addon) {
    if (this.addons[namespace]) {
      throw new Error(`namespace ${namespace} already exists`);
    }

    this.addons[namespace] = { addon, networks: [] };
  }

  public addNetworkInstance(namespace: string, networkId: string) {
    if (!this.addons[namespace].networks.includes(networkId)) {
      this.addons[namespace].networks.push(networkId);
    }
  }

  getAddon(namespace: string, networkId: string): Addon {
    if (!this.addons[namespace]) {
      throw new Error(`could not find addon for namespace ${namespace}`);
    }
    const { addon, networks } = this.addons[namespace];

    const network = networks.find((network) => network === networkId);
    if (!network) {
      throw new Error(
        `could not find network ${networkId} for addon ${namespace}`,
      );
    }
    return addon;
  }

  public async connectWallet(namespace: string, networkId: string) {
    const addon = this.getAddon(namespace, networkId);
    addon.connectWallet();
  }

  public disconnectWallet(namespace: string, networkId: string) {
    const addon = this.getAddon(namespace, networkId);
    addon.disconnectWallet();
  }

  public isWalletConnected(namespace: string, networkId: string): boolean {
    const addon = this.getAddon(namespace, networkId);
    return addon.isWalletConnected();
  }

  public getAddress(namespace: string, networkId: string): string {
    const addon = this.getAddon(namespace, networkId);
    const result = addon.getAddress(networkId);
    if (typeof result === "object") {
      throw new Error(result.error);
    } else {
      return result;
    }
  }

  public async getPublicKey(
    namespace: string,
    networkId: string,
    address: string,
    message: string,
  ): Promise<string | undefined> {
    const addon = this.getAddon(namespace, networkId);
    const result = await addon.getPublicKey(networkId, address, message);
    if (typeof result === "object") {
      console.error(result.error);
      phLogOnChainError(namespace, PH_GET_PUBLIC_KEY, result.error);
      return;
    } else {
      phLogOnChainSuccess(namespace, PH_GET_PUBLIC_KEY);
      return result;
    }
  }

  public async signMessage(
    namespace: string,
    networkId: string,
    address: string,
    message: string,
  ): Promise<string | undefined> {
    const addon = this.getAddon(namespace, networkId);
    const result = await addon.signMessage(networkId, address, message);
    if (typeof result === "object") {
      console.error(result.error);
      phLogOnChainError(namespace, PH_SIGN_MESSAGE, result.error);
      return;
    } else {
      phLogOnChainSuccess(namespace, PH_SIGN_MESSAGE);
      return result;
    }
  }

  public async signTransaction(
    namespace: string,
    networkId: string,
    address: string,
    txHex: string,
  ): Promise<string | undefined> {
    const addon = this.getAddon(namespace, networkId);
    const result = await addon.signTransaction(txHex);
    if (typeof result === "object") {
      console.error(result.error);
      phLogOnChainError(namespace, PH_SIGN_TRANSACTION, result.error);
      return;
    } else {
      phLogOnChainSuccess(namespace, PH_SIGN_TRANSACTION);
      return result;
    }
  }
}

export type ConnectedWalletInfo = string;
export type ConnectWalletFunction = () => void;
export type AddonError = { error: string };
export abstract class Addon {
  public abstract connectWallet();

  public abstract disconnectWallet();

  public abstract isWalletConnected(): boolean;

  public abstract getAddress(networkId: string): string | AddonError;

  public abstract getPublicKey(
    networkId: string,
    address: string,
    message: string,
  ): Promise<string | AddonError>;

  public abstract signMessage(
    networkId: string,
    address: string,
    message: string,
  ): Promise<string | AddonError>;

  public abstract signTransaction(txHex: string): Promise<string | AddonError>;
}
