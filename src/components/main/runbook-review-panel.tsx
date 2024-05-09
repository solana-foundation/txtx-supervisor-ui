import React, { forwardRef, useEffect, useState } from "react";
import addonManager from "../../utils/addons-initializer";
import { ButtonColor, PanelWithTable } from "./panel";

export const RunbookReviewPanel = forwardRef(function RunbookReviewPanel(
  { scrollHandler }: { scrollHandler: any },
  ref: React.ForwardedRef<any>,
) {
  const [walletData, setWalletData] = useState<any>([]);
  useEffect(() => {
    const getSetWalletData = async () => {
      let walletConnectionPrompts =
        await addonManager.getWalletConnectionPrompts();
      setWalletData(walletConnectionPrompts);
    };
    getSetWalletData();
  }, []);

  let rows = [
    {
      index: 0,
      title: "Check Stacks blockchain network",
      cell: { value: "Mainnet | 140,349 Blocks" },
    },
  ];

  const allRows = walletData.reduce((rows, data, i, _) => {
    const index = i * 3 + 1;
    if (typeof data === "function") {
      return rows.concat([
        {
          index,
          title: `Check wallet address executing the runbook`,
          cell: {
            title: "Connect Wallet",
            onClick: data,
            color: ButtonColor.Amber,
            error: undefined,
          },
        },
        {
          index: index + 1,
          title: `Check estimated cost for executing the Runbook`,
          cell: { value: "N/A" },
        },
        {
          index: index + 2,
          title: `Check wallet provisioning`,
          cell: { value: "N/A" },
        },
      ]);
    } else {
      const provisioningError =
        data.requiredBalance > data.balance
          ? "Not enough funds to execute runbook"
          : undefined;
      return rows.concat([
        {
          index,
          title: `Check wallet address executing the runbook (${data.ticker})`,
          cell: { value: data.address },
        },
        {
          index: index + 1,
          title: `Check estimated cost for executing the Runbook (${data.ticker})`,
          cell: { value: `${data.requiredBalance} ${data.ticker}` },
        },
        {
          index: index + 2,
          title: `Check wallet provisioning (${data.ticker})`,
          cell: {
            value: `${data.balance} ${data.ticker}`,
            error: provisioningError,
          },
        },
      ]);
    }
  }, rows as any[]);

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
      rows={allRows}
      ref={ref}
      scrollHandler={scrollHandler}
    />
  );
});
