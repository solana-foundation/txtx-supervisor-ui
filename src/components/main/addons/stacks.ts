import { Addon, AddonError } from "../../../utils/addons";
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
import Wallet from "sats-connect";

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

  public disconnectWallet() {
    userSession.signUserOut();
  }

  public getAddress(networkId: string): string | AddonError {
    const stacksNetworkId =
      networkId.toLocaleLowerCase() === "mainnet" ? "mainnet" : "testnet";
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      // todo, handle no address
      const address = userData.profile.stxAddress[stacksNetworkId];

      return address;
    } else {
      return { error: "user must be signed in to wallet to call getAddress" };
    }
  }

  public async getPublicKey(
    networkId: string,
    address: string,
    message: string,
  ): Promise<string | AddonError> {
    const stacksNetworkId =
      networkId.toLocaleLowerCase() === "mainnet" ? "mainnet" : "testnet";
    let publicKey;
    await openSignatureRequestPopup({
      message,
      network:
        stacksNetworkId == "mainnet"
          ? new StacksMainnet()
          : new StacksTestnet(),
      appDetails: appDetails,
      onFinish(response) {
        publicKey = response.publicKey;
        if (publicKey === undefined) {
          return {
            error: `Address mismatch between user session and selected wallet address.`,
          };
        }
      },
    });
    storePublicKeyInLocalStorage(getStorageKey("stacks"), address, publicKey);
    return publicKey;
  }

  public isWalletConnected(): boolean {
    return userSession.isUserSignedIn();
  }

  public async signMessage(
    networkId: string,
    address: string,
    message: string,
  ): Promise<string | AddonError> {
    const stacksNetworkId =
      networkId.toLocaleLowerCase() === "mainnet" ? "mainnet" : "testnet";
    let signedMessage;

    await openSignatureRequestPopup({
      message,
      network:
        stacksNetworkId == "mainnet"
          ? new StacksMainnet()
          : new StacksTestnet(),
      appDetails: appDetails,
      onFinish(response) {
        function moveLastByteToFront(str) {
          if (str.length <= 2) {
            return str;
          }
          var lastChar = str.substring(str.length - 2);
          var stringWithoutLastChar = str.substring(0, str.length - 2);
          return lastChar + stringWithoutLastChar;
        }

        signedMessage = moveLastByteToFront(response.signature);
      },
    });

    return signedMessage;
  }

  public async signTransaction(txHex: string): Promise<string | AddonError> {
    if ("LeatherProvider" in window) {
      // @ts-ignore
      const response = await LeatherProvider.request("stx_signTransaction", {
        txHex,
      });
      if (response.result?.txHex) {
        return response.result.txHex;
      } else {
        const { message } = response.error;
        return { error: message };
      }
    } else {
      const response = await Wallet.request("stx_signTransaction", {
        transaction: txHex,
        broadcast: false,
      });
      if (response.status === "success") {
        return response.result.transaction;
      } else {
        const { message } = response.error;
        return { error: message };
      }
    }
  }
}
