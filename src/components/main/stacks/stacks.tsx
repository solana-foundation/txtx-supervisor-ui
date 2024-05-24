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
import { AppConfig, UserSession, showConnect } from "@stacks/connect";
import { Action, Prompt } from "../types";
import { getPublicKey } from "./stacks-helpers";
import { MultisigPanel, MultisigTransactionPrimaryButton } from "./multisig";

const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSession = new UserSession({ appConfig });
export const appDetails = {
  name: "txtx",
  icon: window.location.origin, // todo
};
export const authOptions = {
  appDetails,
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
      console.log("stacks user session", userSession);
      const userData = userSession.loadUserData();
      // todo, handle no address
      const address = userData.profile.stxAddress[networkId];
      await getPublicKey(address, networkId);
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
          : // @ts-ignore
            window.XverseProviders
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
      case "Multisig Stacks Transaction":
        return <MultisigPanel prompt={prompt} />;
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
      case "Multisig Stacks Transaction":
        return (
          <MultisigTransactionPrimaryButton
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
