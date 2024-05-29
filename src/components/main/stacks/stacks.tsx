import React from "react";
import {
  Addon,
  ConnectWalletFunction,
  ConnectedWalletInfo,
} from "../../../utils/addons";
import {
  AppConfig,
  UserSession,
  openSignatureRequestPopup,
  showConnect,
} from "@stacks/connect";
import { StacksMainnet, StacksTestnet } from "@stacks/network";
import {
  getStorageKey,
  storePublicKeyInLocalStorage,
} from "../../../utils/helpers";

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
  public async connectWallet() {
    if (userSession.isUserSignedIn()) {
      console.warn(
        "unnecessary call of walletConnection when user is signed in",
      );
    }
    showConnect(authOptions);
  }

  public getAddress(networkId: string): string {
    if (userSession.isUserSignedIn()) {
      console.log("stacks user session", userSession);
      const userData = userSession.loadUserData();
      // todo, handle no address
      const address = userData.profile.stxAddress[networkId];

      return address;
    } else {
      throw new Error("user must be signed in to wallet to call getAddress");
    }
  }

  public async getPublicKey(
    networkId: string,
    address: string,
    message: string,
  ): Promise<string | undefined> {
    let publicKey;
    await openSignatureRequestPopup({
      message,
      network:
        networkId == "mainnet" ? new StacksMainnet() : new StacksTestnet(),
      appDetails: appDetails,
      onFinish(response) {
        console.log("signature popup response", response);
        publicKey = response.publicKey;
        if (publicKey === undefined) {
          console.error(
            `Address mismatch between user session and selected wallet address.`,
          );
        }
      },
    });
    storePublicKeyInLocalStorage(getStorageKey("stacks"), address, publicKey);
    return publicKey;
  }

  public isWalletConnected(): boolean {
    return userSession.isUserSignedIn();
  }
}
