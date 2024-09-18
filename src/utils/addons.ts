import { phLogOnChainError, phLogOnChainSuccess } from "../posthog";
import { Result } from "./result";

export enum AddonErrorType {
  ADDON_NOT_SUPPORTED,
  NETWORK_NOT_SUPPORTED,
  GET_PUBLIC_KEY_FAILED,
  SIGN_MESSAGE_FAILED,
  SIGN_TRANSACTION_FAILED,
}

export function getAddonErrorMessage(
  error: AddonErrorType,
  namespace: string | undefined,
  network: string | undefined,
): string {
  switch (error) {
    case AddonErrorType.ADDON_NOT_SUPPORTED:
      return `Addon ${namespace} is not supported`;
    case AddonErrorType.NETWORK_NOT_SUPPORTED:
      return `Network ${network} is not supported for namespace ${namespace}`;
    case AddonErrorType.GET_PUBLIC_KEY_FAILED:
      return `Failed to get ${namespace} public key`;
    case AddonErrorType.SIGN_MESSAGE_FAILED:
      return `Failed to sign ${namespace} message`;
    case AddonErrorType.SIGN_TRANSACTION_FAILED:
      return `Failed to sign ${namespace} transaction`;
  }
}

const PH_GET_ADDRESS = "get_address";
const PH_GET_PUBLIC_KEY = "get_public_key";
const PH_SIGN_MESSAGE = "sign_message";
const PH_SIGN_TRANSACTION = "sign_transaction";
const PH_SEND_TRANSACTION = "send_transaction";

export type AddonAndNetwork = { addon: Addon; networks: string[] };
export class AddonManager {
  public addons: { [namespace: string]: AddonAndNetwork } = {};

  private getAddonAndNetworks(
    namespace: string,
  ): Result<AddonAndNetwork, string> {
    if (!this.addons[namespace]) {
      return Result.err(`Addon ${namespace} is not supported`);
    }
    return Result.ok(this.addons[namespace]);
  }

  public registerAddon(namespace: string, addon: Addon) {
    if (this.addons[namespace]) {
      return;
    }

    this.addons[namespace] = { addon, networks: [] };
  }

  public injectProvider(
    namespace: string,
    inner: any,
  ): Result<React.FunctionComponentElement<any>, string> {
    const result = this.getAddonAndNetworks(namespace);
    if (result.is_err()) {
      return Result.err(result.unwrap_err());
    }
    const { addon } = result.unwrap();
    return Result.ok(addon.injectProvider(inner));
  }

  public addNetworkInstance(
    namespace: string,
    networkId: string,
  ): Result<null, string> {
    const result = this.getAddonAndNetworks(namespace);
    if (result.is_err()) {
      return Result.err(result.unwrap_err());
    }
    const { networks } = result.unwrap();
    if (!networks.includes(networkId)) {
      networks.push(networkId);
    }
    return Result.ok(null);
  }

  getAddon(namespace: string, networkId: string): Result<Addon, string> {
    const addonAndNetworkResult = this.getAddonAndNetworks(namespace);
    if (addonAndNetworkResult.is_err()) {
      return Result.err(addonAndNetworkResult.unwrap_err());
    }
    const { addon, networks } = addonAndNetworkResult.unwrap();

    const network = networks.find((network) => network === networkId);
    if (!network) {
      return Result.err(
        `Network ${network} is not supported for namespace ${namespace}`,
      );
    }
    return Result.ok(addon);
  }

  public async connectWallet(
    namespace: string,
    networkId: string,
  ): Promise<Result<null, string>> {
    const result = this.getAddon(namespace, networkId);
    if (result.is_err()) {
      return Result.err(result.unwrap_err());
    }
    const addon = result.unwrap();
    addon.connectWallet();
    return Result.ok(null);
  }

  public disconnectWallet(
    namespace: string,
    networkId: string,
  ): Result<null, string> {
    const result = this.getAddon(namespace, networkId);
    if (result.is_err()) {
      return Result.err(result.unwrap_err());
    }
    const addon = result.unwrap();
    addon.disconnectWallet();
    return Result.ok(null);
  }

  public isWalletConnected(
    namespace: string,
    networkId: string,
  ): Result<boolean, string> {
    const result = this.getAddon(namespace, networkId);
    if (result.is_err()) {
      return Result.err(result.unwrap_err());
    }
    const addon = result.unwrap();
    return Result.ok(addon.isWalletConnected());
  }

  public getAddress(
    namespace: string,
    networkId: string,
  ): Result<string, string> {
    const addonResult = this.getAddon(namespace, networkId);
    if (addonResult.is_err()) {
      return Result.err(addonResult.unwrap_err());
    }
    const addon = addonResult.unwrap();
    const addressResult = addon.getAddress(networkId);
    if (typeof addressResult === "object") {
      return Result.err(addressResult.error);
    } else {
      return Result.ok(addressResult);
    }
  }

  public async getPublicKey(
    namespace: string,
    networkId: string,
    address: string,
    message: string,
  ): Promise<Result<string, string>> {
    const addonResult = this.getAddon(namespace, networkId);
    if (addonResult.is_err()) {
      return Result.err(addonResult.unwrap_err());
    }
    const addon = addonResult.unwrap();
    const result = await addon.getPublicKey(networkId, address, message);
    if (typeof result === "object") {
      console.error(result.error);
      phLogOnChainError(namespace, PH_GET_PUBLIC_KEY, result.error);
      return Result.err(
        `Failed to get ${namespace} public key: ${result.error}`,
      );
    } else {
      phLogOnChainSuccess(namespace, PH_GET_PUBLIC_KEY);
      return Result.ok(result);
    }
  }

  public async signMessage(
    namespace: string,
    networkId: string,
    address: string,
    message: string,
  ): Promise<Result<string, string>> {
    const addonResult = this.getAddon(namespace, networkId);
    if (addonResult.is_err()) {
      return Result.err(addonResult.unwrap_err());
    }
    const addon = addonResult.unwrap();
    const result = await addon.signMessage(networkId, address, message);
    if (typeof result === "object") {
      console.error(result.error);
      phLogOnChainError(namespace, PH_SIGN_MESSAGE, result.error);
      return Result.err(`Failed to sign ${namespace} message: ${result.error}`);
    } else {
      phLogOnChainSuccess(namespace, PH_SIGN_MESSAGE);
      return Result.ok(result);
    }
  }

  public async signTransaction(
    namespace: string,
    networkId: string,
    address: string,
    txHex: string,
  ): Promise<Result<string, string>> {
    const addonResult = this.getAddon(namespace, networkId);
    if (addonResult.is_err()) {
      return Result.err(addonResult.unwrap_err());
    }
    const addon = addonResult.unwrap();
    const result = await addon.signTransaction(txHex, address);
    if (typeof result === "object") {
      console.error(result.error);
      phLogOnChainError(namespace, PH_SIGN_TRANSACTION, result.error);
      return Result.err(
        `Failed to sign ${namespace} transaction: ${result.error}`,
      );
    } else {
      phLogOnChainSuccess(namespace, PH_SIGN_TRANSACTION);
      return Result.ok(result);
    }
  }

  public async sendTransaction(
    namespace: string,
    networkId: string,
    address: string,
    txHex: string,
  ): Promise<Result<string, string>> {
    const addonResult = this.getAddon(namespace, networkId);
    if (addonResult.is_err()) {
      return Result.err(addonResult.unwrap_err());
    }
    const addon = addonResult.unwrap();
    const result = await addon.sendTransaction(txHex, address);
    if (typeof result === "object") {
      console.error(result.error);
      phLogOnChainError(namespace, PH_SEND_TRANSACTION, result.error);
      return Result.err(
        `Failed to send ${namespace} transaction: ${result.error}`,
      );
    } else {
      phLogOnChainSuccess(namespace, PH_SEND_TRANSACTION);
      return Result.ok(result);
    }
  }
}

export type ConnectedWalletInfo = string;
export type ConnectWalletFunction = () => void;
export type AddonError = { error: string };
export abstract class Addon {
  public abstract injectProvider(
    inner: any,
  ): React.FunctionComponentElement<any>;

  public abstract connectWallet(): void;

  public abstract disconnectWallet(): void;

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

  public abstract signTransaction(
    txHex: string,
    signerAddress: string,
  ): Promise<string | AddonError>;

  public abstract sendTransaction(
    txHex: string,
    signerAddress: string,
  ): Promise<string | AddonError>;
}
