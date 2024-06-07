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

  public isWalletConnected(namespace: string, networkId: string): boolean {
    const addon = this.getAddon(namespace, networkId);
    return addon.isWalletConnected();
  }

  public getAddress(namespace: string, networkId: string): string {
    const addon = this.getAddon(namespace, networkId);
    return addon.getAddress(networkId);
  }

  public async getPublicKey(
    namespace: string,
    networkId: string,
    address: string,
    message: string,
  ): Promise<string | undefined> {
    const addon = this.getAddon(namespace, networkId);
    return await addon.getPublicKey(networkId, address, message);
  }

  public async signTransaction(
    namespace: string,
    networkId: string,
    address: string,
    txHex: string,
  ): Promise<string | undefined> {
    const addon = this.getAddon(namespace, networkId);
    return await addon.signTransaction(txHex);
  }
}

export type ConnectedWalletInfo = string;
export type ConnectWalletFunction = () => void;

export abstract class Addon {
  public abstract connectWallet();

  public abstract isWalletConnected(): boolean;

  public abstract getAddress(networkId: string): string;

  public abstract getPublicKey(
    networkId: string,
    address: string,
    message: string,
  ): Promise<string | undefined>;

  public abstract signTransaction(txHex: string): Promise<string | undefined>;
}
