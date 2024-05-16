import { Action, Prompt } from "../components/main/types";

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

  public getAddonFromNamespace(namespace: string): Addon {
    if (!this.addons[namespace]) {
      throw new Error(`could not find addon for namespace ${namespace}`);
    }
    return this.addons[namespace].addon;
  }

  public async getWalletConnectionPrompts(): Promise<
    (ConnectedWalletInfo | ConnectWalletFunction)[]
  > {
    const addons = this.addons;
    const namespaces = Object.keys(addons);
    const prompts: any[] = [];
    for (const namespace of namespaces) {
      const { addon, networks } = addons[namespace];
      for (const network of networks) {
        prompts.push(await addon.walletConnection(network));
      }
    }
    return prompts;
  }

  public areAllWalletsConnected() {
    const addons = this.addons;
    for (let namespace of Object.keys(addons)) {
      let addon = addons[namespace].addon;
      if (!addon.isWalletConnected()) {
        return false;
      }
    }
    return true;
  }
}

export interface ConnectedWalletInfo {
  chain: string;
  address: string;
  network: string;
  walletName: string;
  balance: number;
  requiredBalance: number;
  chainTip: number;
  ticker: string;
}
export type ConnectWalletFunction = () => void;

export abstract class Addon {
  public abstract walletConnection(
    networkId: string,
  ): Promise<ConnectedWalletInfo | ConnectWalletFunction>;
  public abstract isWalletConnected(): boolean;

  // prompts
  public abstract getPromptElement(prompt: Prompt): React.JSX.Element;

  public abstract getPromptPrimaryButton(
    prompt: Prompt,
    panelIndex: number,
    scrollHandler: any,
  ): JSX.Element | undefined;

  public abstract getPromptSecondaryButton(
    prompt: Prompt,
  ): JSX.Element | undefined;

  // actions
  public abstract getActionElement(prompt: Action): JSX.Element | undefined;

  public abstract getActionPrimaryButton(
    prompt: Action,
    panelIndex: number,
    scrollHandler: any,
  ): JSX.Element | undefined;

  public abstract getActionSecondaryButton(
    prompt: Action,
  ): JSX.Element | undefined;
}
