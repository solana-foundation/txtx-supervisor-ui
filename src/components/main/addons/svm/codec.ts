import {
  Blockhash,
  Message,
  MessageArgs,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";

const EMPTY_SIGNATURE = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];
const EMPTY_SIGNATURE_STRING = bs58.encode(Buffer.from(EMPTY_SIGNATURE));

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

  toTransaction(
    mostRecentBlockhash: Readonly<{
      blockhash: Blockhash;
      lastValidBlockHeight: number;
    }>,
  ): Transaction {
    let isPartiallySigned = false;
    const signatures = ShortVecUtils.fromVec(this.signatures).map((sig) => {
      const signature = bs58.encode(Buffer.from(sig));

      if (signature !== EMPTY_SIGNATURE_STRING) {
        isPartiallySigned = true;
      }
      return signature;
    });

    const { accountKeys, header, instructions, recentBlockhash } = this.message;

    const messageArgs: MessageArgs = {
      accountKeys: ShortVecUtils.fromVec(accountKeys).map(
        (key) => new PublicKey(bs58.encode(Buffer.from(key))),
      ),
      header: header,
      instructions: ShortVecUtils.fromVec(instructions).map(
        ({ accounts, data, programIdIndex }) => {
          return {
            accounts: ShortVecUtils.fromVec(accounts),
            data: bs58.encode(Buffer.from(ShortVecUtils.fromVec(data))),
            programIdIndex: programIdIndex,
          };
        },
      ),
      // if this transaction has already been partially signed, we need to use the blockhash provided
      // in the transaction. If not, we can use the one that was just fetched from the network to make sure it's as recent as possible
      recentBlockhash: isPartiallySigned
        ? bs58.encode(Buffer.from(recentBlockhash))
        : mostRecentBlockhash.blockhash,
    };
    return Transaction.populate(new Message(messageArgs), signatures);
  }

  public static fromTransaction(
    transaction: Transaction,
  ): RustSolanaTransaction {
    const message = transaction.compileMessage();
    const signatures: ShortVec<SolSignature> = ShortVecUtils.toShortVec(
      transaction.signatures.map((sig) =>
        sig.signature ? Array.from(sig.signature as Buffer) : EMPTY_SIGNATURE,
      ),
    );
    const rustEncodedMessage: RustMessage = {
      accountKeys: ShortVecUtils.toShortVec(
        message.accountKeys.map((key) => Array.from(key.toBytes())),
      ),
      header: {
        numRequiredSignatures: message.header.numRequiredSignatures,
        numReadonlySignedAccounts: message.header.numReadonlySignedAccounts,
        numReadonlyUnsignedAccounts: message.header.numReadonlyUnsignedAccounts,
      },
      instructions: ShortVecUtils.toShortVec(
        message.instructions.map((instruction) => {
          return {
            accounts: ShortVecUtils.toShortVec(instruction.accounts),
            data: ShortVecUtils.toShortVec(
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
    console.log("str", str);
    const hex = Buffer.from(str).toString("hex");
    return hex;
  }
  public toJSON(): Object {
    return { message: this.message, signatures: this.signatures };
  }
}

class ShortVecUtils {
  static fromVec<T>(shortVec: ShortVec<T>): T[] {
    // Return the elements of the ShortVec
    return shortVec.slice(1) as T[];
  }

  static toShortVec<T>(members: T[]): ShortVec<T> {
    // Encode the length of the array using the short-vec encoding format
    const encodedLength = ShortVecUtils.encodeLength(members.length);

    // Combine the encoded length and the array elements into a ShortVec
    return [encodedLength, ...members];
  }

  private static encodeLength(length: number): number[] {
    const encoded: number[] = [];
    if (length === 0) {
      return [0];
    }
    let remaining = length;

    while (remaining > 0) {
      let byte = remaining & 0x7f; // Take the lower 7 bits
      remaining >>= 7; // Shift right by 7 bits

      if (remaining > 0) {
        byte |= 0x80; // Set the continuation bit
      }

      encoded.push(byte);
    }

    return encoded;
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
