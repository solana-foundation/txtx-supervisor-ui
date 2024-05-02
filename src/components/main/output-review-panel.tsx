import React, { forwardRef } from "react";
import { Panel, PanelColor, PanelContent } from "./panel";
import { Output } from "./types";

export interface OutputReviewPanelProps {
  outputs: Output[];
  panelIndex: number;
}
export const OutputReviewPanel = forwardRef(function OutputReviewPanel(
  {
    outputs,
    panelIndex,
    scrollHandler,
  }: OutputReviewPanelProps & { scrollHandler: any },
  ref,
) {
  return (
    <Panel
      panelIndex={panelIndex}
      key="runbook-outputs"
      color={PanelColor.Purple}
      title="Runbook Outputs"
      primaryButton={{ title: "publish runbook" }}
      content={
        <PanelContent
          children={[
            <OutputReviewField outputs={outputs} panelIndex={panelIndex} />,
          ]}
        />
      }
      ref={ref}
      scrollHandler={scrollHandler}
    />
  );
});

function OutputReviewField({ outputs }: OutputReviewPanelProps) {
  let values = outputs.map((output) => (
    <div key={output.commandUuid}>{`> ${output.name}: ${output.value}`}</div>
  ));
  return (
    <div className="w-full min-h-20 px-2 py-4 bg-zinc-950 rounded border border-zinc-600 flex-col justify-start items-start gap-2.5 inline-flex">
      <div className="w-full block self-stretch bg-zinc-950 break-all text-wrap text-zinc-300 rounded-sm text-sm font-medium font-['Inter']">
        {values}
      </div>
    </div>
  );
}
