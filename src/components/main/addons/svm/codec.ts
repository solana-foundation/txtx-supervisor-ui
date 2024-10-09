import { Message, MessageArgs, PublicKey, Transaction } from "@solana/web3.js";
import bs58 from "bs58";

export class RustSolanaTransaction {
  public message: RustMessage;
  public signatures: ShortVec<SolSignature>;

  constructor(message: RustMessage, signatures: ShortVec<SolSignature>) {
    this.message = message;
    this.signatures = signatures;
  }

  public static from_hex(txHex: string): RustSolanaTransaction {
    const prefixRemoved = txHex.replace("0x", "");
    const deserializedTx = Buffer.from(prefixRemoved, "hex");
    const { message: rawMessage, signatures: rawSignatures }: SolTransaction =
      JSON.parse(deserializedTx.toString());
    return new RustSolanaTransaction(rawMessage, rawSignatures);
  }

  toTransaction(): Transaction {
    const signatures = RustSolanaTransaction.retrieveShortVecMembers(
      this.signatures,
    ).map((sig) => bs58.encode(Buffer.from(sig)));
    const { accountKeys, header, instructions, recentBlockhash } = this.message;
    const messageArgs: MessageArgs = {
      accountKeys: RustSolanaTransaction.retrieveShortVecMembers(
        accountKeys,
      ).map((key) => new PublicKey(bs58.encode(Buffer.from(key)))),
      header: header,
      instructions: RustSolanaTransaction.retrieveShortVecMembers(
        instructions,
      ).map(({ accounts, data, programIdIndex }) => {
        return {
          accounts: RustSolanaTransaction.retrieveShortVecMembers(accounts),
          data: bs58.encode(
            Buffer.from(RustSolanaTransaction.retrieveShortVecMembers(data)),
          ),
          programIdIndex: programIdIndex,
        };
      }),
      recentBlockhash: bs58.encode(Buffer.from(recentBlockhash)),
    };
    return Transaction.populate(new Message(messageArgs), signatures);
  }

  public static fromTransaction(
    transaction: Transaction,
  ): RustSolanaTransaction {
    const message = transaction.compileMessage();
    const signatures: ShortVec<SolSignature> = RustSolanaTransaction.toShortVec(
      transaction.signatures
        .filter((sig) => !!sig.signature)
        .map((sig) => Array.from(sig.signature as Buffer)),
    );
    const rustEncodedMessage: RustMessage = {
      accountKeys: RustSolanaTransaction.toShortVec(
        message.accountKeys.map((key) => Array.from(key.toBytes())),
      ),
      header: {
        numRequiredSignatures: message.header.numRequiredSignatures,
        numReadonlySignedAccounts: message.header.numReadonlySignedAccounts,
        numReadonlyUnsignedAccounts: message.header.numReadonlyUnsignedAccounts,
      },
      instructions: RustSolanaTransaction.toShortVec(
        message.instructions.map((instruction) => {
          return {
            accounts: RustSolanaTransaction.toShortVec(instruction.accounts),
            data: RustSolanaTransaction.toShortVec(
              Array.from(bs58.decode(instruction.data)),
            ),
            programIdIndex: instruction.programIdIndex,
          };
        }),
      ),
      recentBlockhash: Array.from(bs58.decode(message.recentBlockhash)),
    };

    return new RustSolanaTransaction(rustEncodedMessage, signatures);
  }

  public toHex(): string {
    const str = JSON.stringify(this.toJSON());
    const hex = Buffer.from(str).toString("hex");
    return hex;
  }
  public toJSON(): Object {
    return { message: this.message, signatures: this.signatures };
  }

  static retrieveShortVecMembers<T>(shortVec: ShortVec<T>): T[] {
    return shortVec.slice(1) as T[];
  }
  static toShortVec<T>(members: T[]): ShortVec<T> {
    return [[members.length], ...members];
  }
}

type ShortVec<T> = [number[], ...T[]];
type SolTransaction = {
  signatures: ShortVec<SolSignature>;
  message: RustMessage;
};
type SolSignature = number[];
type RustMessage = {
  accountKeys: ShortVec<SolAccountKey>;
  header: SolMessageHeader;
  instructions: ShortVec<SolInstruction>;
  recentBlockhash: RecentBlockhash;
};
type SolAccountKey = number[];
type SolMessageHeader = {
  numRequiredSignatures: number;
  numReadonlySignedAccounts: number;
  numReadonlyUnsignedAccounts: number;
};
type SolInstruction = {
  accounts: ShortVec<SolAccount>;
  data: ShortVec<SolInstructionData>;
  programIdIndex: number;
};
type SolAccount = number;
type SolInstructionData = number;
type RecentBlockhash = number[];

function uint8ArrayToNumberArray(arr: Uint8Array): number[] {
  return Array.from(arr);
}
