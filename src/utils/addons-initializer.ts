import { AddonManager } from "./addons";
import { StacksAddon } from "../components/main/addons/stacks";
import { EvmAddon } from "../components/main/addons/evm";

const addonManager = new AddonManager();
addonManager.registerAddon("stacks", new StacksAddon());
addonManager.registerAddon("evm", new EvmAddon());
export default addonManager;
