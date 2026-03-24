export const RpcSchema = {
  wallet_connect: {
    Capabilities: {},
  },
} as const;

export class Porto {
  static async create() {
    throw new Error("Porto connector is not supported in this app.");
  }
}
