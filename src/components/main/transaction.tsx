import React from "react";
import { CodeBlock } from "./code-block";
import { NetworkBadge } from "./network-badge";
import { ActionBar } from "./action-bar";

export interface Transaction {
  rawData: string;
  decodedData: string;
  network: string;
  executionIndex: number;
  uuid: string;
}
export function Transaction({
  rawData,
  decodedData,
  network,
  executionIndex,
}: Transaction) {
  return (
    <div className="mt-4 ">
      <p className="text-sm font-medium dark:text-white/90 leading-6">
        #{executionIndex}
      </p>
      <NetworkBadge network={network} />
      <CodeBlock data={rawData + "\n \n \n" + decodedData} />
      <ActionBar />
    </div>
  );
}
