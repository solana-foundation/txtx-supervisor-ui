import React from "react";
import {
  Addon,
  ConnectWalletFunction,
  ConnectedWalletInfo,
} from "../../../utils/addons";
import {
  SignTransactionPanel,
  SignTransactionPrimaryButton,
} from "./sign-transaction";
import { PanelButton, PanelContent } from "../panel";
import { AppConfig, UserSession, showConnect } from "@stacks/connect";
import { Action, Prompt } from "../types";

const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSession = new UserSession({ appConfig });
export const authOptions = {
  appDetails: {
    name: "txtx",
    icon: window.location.origin, // todo
  },
  redirectTo: "/",
  onFinish: () => {
    window.location.reload();
  },
  userSession,
};

export class StacksAddon implements Addon {
  public async walletConnection(
    networkId: string,
  ): Promise<ConnectedWalletInfo | ConnectWalletFunction> {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      // todo, handle no address
      const address = userData.profile.stxAddress[networkId];
      const balanceResponse = await fetch(
        `https://api.${networkId}.hiro.so/extended/v1/address/${address}/balances`,
      );
      const balance = await balanceResponse.json();

      return {
        address,
        chain: "Stacks",
        network: networkId,
        ticker: "STX",
        balance:
          Math.round((parseInt(balance.stx.balance) / 1000000) * 100) / 100,
        requiredBalance: 0,
        chainTip: 0,
        // @ts-ignore
        walletName: window.LeatherProvider
          ? "Leather"
          : window.XverseProviders
            ? "Xverse"
            : "Unknown",
      };
    } else {
      return function authenticate() {
        showConnect(authOptions);
      };
    }
  }

  public isWalletConnected(): boolean {
    return userSession.isUserSignedIn();
  }

  // prompts
  public getPromptElement(prompt: Prompt): JSX.Element {
    switch (prompt.name) {
      case "Sign Stacks Transaction":
        return <SignTransactionPanel prompt={prompt} />;
      default:
        throw new Error(`unimplemented prompt ${prompt.name} for stacks addon`);
    }
  }

  public getPromptPrimaryButton(
    prompt: Prompt,
    panelIndex: number,
    scrollHandler: any,
  ): JSX.Element | undefined {
    switch (prompt.name) {
      case "Sign Stacks Transaction":
        return (
          <SignTransactionPrimaryButton
            prompt={prompt}
            panelIndex={panelIndex}
            scrollHandler={scrollHandler}
          />
        );
      default:
        return;
    }
  }
  public getPromptSecondaryButton(prompt: Prompt): JSX.Element | undefined {
    return;
  }

  // actions
  public getActionElement(action: Action): JSX.Element | undefined {
    switch (action.name) {
      default:
        return;
    }
  }
  public getActionPrimaryButton(
    prompt: Action,
    panelIndex: number,
    scrollHandler: any,
  ): JSX.Element | undefined {
    return;
  }
  public getActionSecondaryButton(prompt: Action): JSX.Element | undefined {
    return;
  }
}
