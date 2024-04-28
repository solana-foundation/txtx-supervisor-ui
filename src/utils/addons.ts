import { PanelButton } from "../components/main/panel";
import { Action, Prompt } from "../components/main/types";

export class AddonManager {
  public addons: { [namespace: string]: Addon } = {};

  public registerAddon(namespace: string, addon: Addon) {
    if (this.addons[namespace]) {
      throw new Error(`namespace ${namespace} already exists`);
    }

    this.addons[namespace] = addon;
  }

  public getAddonFromNamespace(namespace: string): Addon {
    if (!this.addons[namespace]) {
      throw new Error(`could not find addon for namespace ${namespace}`);
    }
    return this.addons[namespace];
  }

  public getWalletConnectionPrompts() {
    const addons = this.addons;
    return Object.keys(addons).map((namespace) => {
      return {
        namespace,
        walletConnection: addons[namespace].walletConnection(),
      };
    });
  }

  public areAllWalletsConnected() {
    const addons = this.addons;
    for (let namespace of Object.keys(addons)) {
      let addon = addons[namespace];
      if (!addon.isWalletConnected()) {
        return false;
      }
    }
    return true;
  }
}

export interface ConnectedWalletInfo {
  address: string;
  walletName: string;
}
export type ConnectWalletFunction = () => void;

export abstract class Addon {
  public abstract walletConnection():
    | ConnectedWalletInfo
    | ConnectWalletFunction;
  public abstract isWalletConnected(): boolean;

  // prompts
  public abstract getPromptElement(prompt: Prompt): React.JSX.Element;

  public abstract getPromptPrimaryButton(
    prompt: Prompt,
  ): PanelButton | undefined;

  public abstract getPromptSecondaryButton(
    prompt: Prompt,
  ): PanelButton | undefined;

  // actions
  public abstract getActionElement(
    prompt: Action,
  ): React.JSX.Element | undefined;

  public abstract getActionPrimaryButton(
    prompt: Action,
  ): PanelButton | undefined;

  public abstract getActionSecondaryButton(
    prompt: Action,
  ): PanelButton | undefined;
}
