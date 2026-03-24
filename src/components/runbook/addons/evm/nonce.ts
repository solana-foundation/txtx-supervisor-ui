import { Config, getTransactionCount } from "@wagmi/core";

// Singleton nonce manager for EVM transactions.
//
// Problem: When sending multiple transactions in quick succession, the on-chain nonce query
// (even with `blockTag: "pending"`) may not reflect transactions we just broadcast but haven't
// yet propagated to the node's mempool. This causes nonce collisions and rejected transactions.
//
// Solution: Track the next expected nonce locally after each send. Return max(cached, on-chain)
// to handle both rapid sends (use cache) and external transactions (on-chain catches up).
export default class NonceManager {
    private static instance: NonceManager;
    private nonce: Record<string, number> = {};

    private constructor() {}

    static getInstance(): NonceManager {
        if (!NonceManager.instance) {
            NonceManager.instance = new NonceManager();
        }
        return NonceManager.instance;
    }

    async getNonce(account: string, wagmiConfig: Config, chainId: number): Promise<number> {
        console.log(`[NonceManager] Getting nonce for ${account} on chain ${chainId}`);

        const onChainNonce = await getTransactionCount(wagmiConfig, {
            address: account as `0x${string}`,
            chainId,
            blockTag: "pending",
        });
        console.log(`[NonceManager] On-chain nonce: ${onChainNonce}`);

        const cachedNonce = this.nonce[account];
        if (cachedNonce !== undefined) {
            console.log(`[NonceManager] Cached nonce: ${cachedNonce}`);
        }

        const nonce = Math.max(cachedNonce ?? onChainNonce, onChainNonce);
        console.log(`[NonceManager] Using nonce: ${nonce}, caching next: ${nonce + 1}`);

        this.nonce[account] = nonce + 1;

        return nonce;
    }
}
