import React from "react";
import { Variable } from "./variable";
import { Output } from "./output";
import { Transaction } from "./transaction";

const variables: Variable[] = [
  {
    name: "Price feed identifier",
    description:
      "Pyth Price Feed has a unique ID, representing the specific pair of assets being priced.",
    value: "E13A564B654C98D654E321F321A32D654F984E321F654B321CD1A32A1EF64",
    uuid: "1",
  },
  {
    name: "Another Variable",
    description:
      "Variables can be useful; especially when you declare them and assign them a value.",
    value: `"my_string"`,
    uuid: "2",
  },
];

const outputs: Output[] = [
  {
    name: "An output",
    description: "Output data",
    value: `"my_output"`,
    uuid: "1",
  },
];

const transactions: Transaction[] = [
  {
    rawData:
      "0x1A23C21D321E54987F65E987G65DGDGDGDF654E98F4654A654D1A23C21D321E54987F65E987G65DGDGDGDF6\n54E98F4654A654D1A23C21D321E54987F65E987G65DGDGDGDF654E98F4654A654D1A23C21D321E54987F65E98\n7G65DGDGDGDF654E98F4654A654D",
    decodedData: "This transaction will be broadcast to the stacks network...",
    network: "stacks",
    executionIndex: 1,
    uuid: "1",
  },
  {
    rawData:
      "0x1A23C21D321E54987F65E987G65DGDGDGDF654E98F4654A654D1A23C21D321E54987F65E987G65DGDGDGDF6\n54E98F4654A654D1A23C21D321E54987F65E987G65DGDGDGDF654E98F4654A654D1A23C21D321E54987F65E98\n7G65DGDGDGDF654E98F4654A654D",
    decodedData: "This transaction will be broadcast to the stacks network...",
    network: "stacks",
    executionIndex: 2,
    uuid: "2",
  },
  {
    rawData:
      "0x1A23C21D321E54987F65E987G65DGDGDGDF654E98F4654A654D1A23C21D321E54987F65E987G65DGDGDGDF6\n54E98F4654A654D1A23C21D321E54987F65E987G65DGDGDGDF654E98F4654A654D1A23C21D321E54987F65E98\n7G65DGDGDGDF654E98F4654A654D",
    decodedData: "This transaction will be broadcast to the stacks network...",
    network: "stacks",
    executionIndex: 2,
    uuid: "3",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Manual() {
  return (
    <div className="max-w-3xl">
      <div className="px-4 sm:px-0">
        <h1 className="text-3xl font-medium leading-7 dark:text-emerald-400">
          Read Price Feeds
        </h1>
        <p className="mt-1 max-w-2xl font-medium leading-6 dark:text-white/90">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </p>
      </div>
      {/* Inputs */}
      <div className={classNames(variables.length ? "" : "hidden", "mt-6")}>
        <h2 className="uppercaseborder-b dark:border-slate-500/20 text-md font-medium dark:text-slate-500">
          Variables
        </h2>
        {variables.map((variable) => (
          <Variable {...variable} key={variable.uuid} />
        ))}
      </div>
      <div className={classNames(outputs.length ? "" : "hidden", "mt-6")}>
        <h2 className="uppercase border-b dark:border-slate-500/20 text-md font-medium dark:text-slate-500">
          Outputs
        </h2>
        {outputs.map((output) => (
          <Output {...output} key={output.uuid} />
        ))}
      </div>
      <div className={classNames(outputs.length ? "" : "hidden", "mt-6")}>
        <h2 className="uppercase border-b dark:border-slate-500/20 text-md font-medium dark:text-slate-500">
          Transactions
        </h2>
        {transactions.map((transaction, i) => (
          <div>
            <hr
              className={classNames(
                i === 0 ? "hidden" : "",
                "w-1/2 float-right dark:text-slate-500/20",
              )}
            />
            <Transaction {...transaction} key={transaction.uuid} />
          </div>
        ))}
      </div>
    </div>
  );
}
