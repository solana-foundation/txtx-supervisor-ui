import * as allChains from "wagmi/chains";
import type { Chain } from "wagmi/chains";

function isChain(chain: any): boolean {
  if (
    typeof chain === "object" &&
    "id" in chain &&
    "name" in chain &&
    "rpcUrls" in chain &&
    "nativeCurrency" in chain
  ) {
    return true;
  }
  return false;
}

const supportedChains = Object.values(allChains).filter(
  isChain,
) as unknown as readonly [Chain];
export default supportedChains;
