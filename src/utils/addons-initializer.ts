import { AddonManager } from "./addons";
import { StacksAddon } from "../components/main/addons/stacks";

const addonManager = new AddonManager();
addonManager.registerAddon("stacks", new StacksAddon());
export default addonManager;
