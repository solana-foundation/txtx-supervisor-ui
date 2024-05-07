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
  public walletConnection(): ConnectedWalletInfo | ConnectWalletFunction {
    if (userSession.isUserSignedIn()) {
      let userData = userSession.loadUserData();
      // todo, we're only returning mainnet address
      let addresses = userData.profile.stxAddress;

      return {
        address: addresses.mainnet,
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

  public getPromptPrimaryButton(prompt: Prompt): PanelButton | undefined {
    switch (prompt.name) {
      case "Sign Stacks Transaction":
        return {
          title: "Sign Transaction",
          onClick: async (e) => SignTransactionPrimaryButton({ prompt })(e),
        };
      default:
        return;
    }
  }
  public getPromptSecondaryButton(prompt: Prompt): PanelButton | undefined {
    return;
  }

  // actions
  public getActionElement(action: Action): React.JSX.Element | undefined {
    switch (action.name) {
      default:
        return;
    }
  }
  public getActionPrimaryButton(prompt: Action): PanelButton | undefined {
    return;
  }
  public getActionSecondaryButton(prompt: Action): PanelButton | undefined {
    return;
  }
}
