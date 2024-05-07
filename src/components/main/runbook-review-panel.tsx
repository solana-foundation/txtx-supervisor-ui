import React, { forwardRef } from "react";
import CheckMark, { CheckMarkColor } from "../icons/check-mark";
import addonManager from "../../utils/addons-initializer";
import { PanelWithTable, TableForPanelProps } from "./panel";

export const RunbookReviewPanel = forwardRef(function RunbookReviewPanel(
  { scrollHandler }: { scrollHandler: any },
  ref,
) {
  const rows: TableForPanelProps[] = [
    {
      index: 0,
      title: "Check Stacks blockchain network",
      cell: { value: "Mainnet | 140,349 Blocks" },
    },
    {
      index: 1,
      title: "Check wallet address executing the Runbook",
      cell: { value: "SP12293498239481941230912309543" },
    },
    {
      index: 2,
      title: "Check estimated cost for executing the Runbook (STX)",
      cell: { value: "150 STX" },
    },
    {
      index: 3,
      title: "Check wallet provisioning (STX)",
      cell: {
        value: "100 STX",
        error: "Wallet does not have enough funds to execute the Runbook",
      },
    },
  ];
  return (
    <PanelWithTable
      panelIndex={0}
      key="runbook-checklist"
      title="runbook checklist"
      description="Review and check the items from the list below."
      primaryButton={{
        title: "start runbook",
        disabled: !addonManager.areAllWalletsConnected(),
      }}
      readonly={true}
      rows={rows}
      ref={ref}
      scrollHandler={scrollHandler}
    />
  );
});

export function walletConnections() {
  let connection = addonManager.getWalletConnectionPrompts();
  return connection.map(({ namespace, walletConnection }) => {
    if (typeof walletConnection === "object") {
      return (
        <div>
          <div className="text-white text-xs font-bold font-['Inter'] uppercase">
            {namespace} wallet
          </div>
          <div className="pl-2 pr-4 py-2 bg-white bg-opacity-20 rounded justify-start items-center gap-1 inline-flex">
            <div className="flex-col justify-start items-center gap-2.5 inline-flex">
              <div className="w-8 h-8 pl-[3.50px] pr-[4.50px] py-1 justify-center items-center inline-flex">
                <div className="w-6 h-6 relative flex-col justify-start items-start flex text-emerald-400">
                  <CheckMark color={CheckMarkColor.Emerald} />
                </div>
              </div>
            </div>
            <div className="flex-col justify-start items-start gap-1 inline-flex">
              <div className="text-base text-white font-bold font-['Inter']">
                {walletConnection.walletName}
              </div>
              <div className="self-stretch justify-start items-start gap-1 inline-flex">
                <div className="text-xs uppercase text-white text-[10px] font-bold font-['Inter']">
                  Address
                </div>
                <div className="text-xs text-right text-emerald-300 text-[10px] font-bold font-['Inter']">
                  {walletConnection.address}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (typeof walletConnection === "function") {
      return (
        <div>
          <div className="text-white text-xs font-bold font-['Inter'] uppercase">
            {namespace} wallet
          </div>
          <button
            onClick={walletConnection}
            className="mt-2 py-2 bg-purple-500 hover:bg-purple-400 focus-visible:outline-purple-500 rounded-md px-3.5 py-2.5 text-sm font-semibold text-white uppercase shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Connect Wallet
          </button>
        </div>
      );
    } else {
      throw new Error(`invalid wallet connection for namespace ${namespace}`);
    }
  });
}

export interface RunbookReviewItemProps {
  title: string;
  subtitle: string;
  data: { [key: string]: string };
}

export function RunbookReviewItem({
  title,
  subtitle,
  data,
}: RunbookReviewItemProps) {
  const content = Object.keys(data).map((key) => {
    const value = data[key];
    return (
      <div
        key={key}
        className="text-nowrap self-stretch justify-start items-start gap-1 inline-flex"
      >
        <div className="text-xs uppercase text-white text-[10px] font-bold font-['Inter']">
          {key}
        </div>
        <div className="text-xs uppercase text-right text-emerald-300 text-[10px] font-bold font-['Inter']">
          {value}
        </div>
      </div>
    );
  });
  return (
    <div>
      <div className="text-white text-xs font-bold font-['Inter'] uppercase">
        {title}
      </div>
      <div className="pl-2 pr-4 py-2 bg-white bg-opacity-20 rounded justify-start items-center gap-1 inline-flex">
        <div className="flex-col justify-start items-center gap-2.5 inline-flex">
          <div className="w-8 h-8 pl-[3.50px] pr-[4.50px] py-1 justify-center items-center inline-flex">
            <div className="w-6 h-6 relative flex-col justify-start items-start flex text-emerald-400">
              <CheckMark color={CheckMarkColor.Emerald} />
            </div>
          </div>
        </div>
        <div className="flex-col justify-start items-start gap-1 inline-flex">
          <div className="text-white text-sm font-bold font-['Inter']">
            {subtitle}
          </div>
          {content}
        </div>
      </div>
    </div>
  );
}
