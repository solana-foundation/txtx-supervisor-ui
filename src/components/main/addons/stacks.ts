import { Addon } from "../../../utils/addons";
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
import posthog from "posthog-js";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });
const appDetails = {
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

  public async signTransaction(txHex: string): Promise<string | undefined> {
    // @ts-ignore
    const response = await LeatherProvider.request("stx_signTransaction", {
      txHex,
    });
    if (response.result?.txHex) {
      posthog.capture("onchain_success");
      return response.result.txHex;
    } else {
      console.error(response.error);
      posthog.capture("onchain_error", {
        addon: "stacks",
        action: "sign_transaction",
        message: response.error.message,
        code: response.error.code,
        data: response.error.data,
      });
    }
  }
  catch(error) {
    posthog.capture("onchain_failure", {
      addon: "stacks",
      action: "sign_transaction",
      message: error,
    });
    console.error(error);
  }
}
