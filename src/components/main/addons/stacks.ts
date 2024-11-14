import { Addon, AddonError } from "../../../utils/addons";
import {
  AppConfig,
  UserSession,
  openSignatureRequestPopup,
  showConnect,
} from "@stacks/connect";
import { STACKS_MAINNET, STACKS_TESTNET } from "@stacks/network";
import Wallet from "sats-connect";
import { createElement } from "react";
import { Connect } from "@stacks/connect-react";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });
const appDetails = {
  name: "txtx",
  icon: window.location.origin, // todo
};
const authOptions = {
  appDetails,
  redirectTo: "/",
  onFinish: () => {
    window.location.reload();
  },
  userSession,
};
let didInject = false;

export default class StacksAddon implements Addon {
  public injectProvider(inner: any): React.FunctionComponentElement<any> {
    if (didInject) {
      return inner;
    }
    didInject = true;
    const withConnect = createElement(Connect, {
      authOptions: authOptions,
      children: inner,
    });
    return withConnect;
  }

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
    return new Promise((resolve, reject) => {
      openSignatureRequestPopup({
        message,
        network:
          stacksNetworkId === "mainnet" ? STACKS_MAINNET : STACKS_TESTNET,
        appDetails: appDetails,
        onFinish(response) {
          if (response.publicKey) {
            resolve(response.publicKey);
          } else {
            reject(new Error("Failed to sign message to obtain public key"));
          }
        },
      });
    });
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
    return new Promise((resolve, reject) => {
      openSignatureRequestPopup({
        message,
        network:
          stacksNetworkId === "mainnet" ? STACKS_MAINNET : STACKS_TESTNET,
        appDetails: appDetails,
        onFinish(response) {
          resolve(moveLastByteToFront(response.signature));
        },
      });
    });
  }

  public async signTransaction(
    txHex: string,
    _signerAddress: string,
  ): Promise<string | AddonError> {
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
  public async sendTransaction(
    _txHash: string,
    _signerAddress: string,
  ): Promise<string | AddonError> {
    return { error: "Send Transaction not supported for Stacks" };
  }
}

function moveLastByteToFront(str: string) {
  if (str.length <= 2) {
    return str;
  }
  var lastChar = str.substring(str.length - 2);
  var stringWithoutLastChar = str.substring(0, str.length - 2);
  return lastChar + stringWithoutLastChar;
}
