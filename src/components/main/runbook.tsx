import React, { MutableRefObject } from "react";
import { useAppSelector } from "../../hooks";
import { selectRunbook } from "../../reducers/runbooks-slice";
import { Panel } from "./panel";
import ProgressOutput from "./progress-output";
import { ErrorPanel } from "./error";

export interface RunbookProps {
  panelScrollHandler: any;
  panelRefs: MutableRefObject<any[]>;
}
export default function Runbook({
  panelScrollHandler,
  panelRefs,
}: RunbookProps) {
  const { actionBlocks, errorBlocks } = useAppSelector(selectRunbook);

  return (
    <div className="w-full justify-center flex flex-col items-center">
      <div className="mx-auto w-[1024px] max-w-full min-h-full px-6 pt-6 justify-center flex flex-col inline-flex gap-8">
        {actionBlocks.map((block, i) => {
          return (
            <Panel
              key={block.uuid}
              block={block}
              panelIndex={i}
              scrollHandler={() => {}}
              isLast={i === actionBlocks.length - 1}
            />
          );
        })}
        {errorBlocks.map((block, i) => {
          return (
            <ErrorPanel
              key={block.uuid}
              block={block}
              panelIndex={i}
              scrollHandler={() => {}}
              isLast={i === errorBlocks.length - 1}
            />
          );
        })}
        <ProgressOutput />
      </div>
    </div>
  );
}
