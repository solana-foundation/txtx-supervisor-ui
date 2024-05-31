import React, { MutableRefObject } from "react";
import { useAppSelector } from "../../hooks";
import { selectRunbook } from "../../reducers/runbooks-slice";
import { Panel } from "./panel";

export interface RunbookProps {
  panelScrollHandler: any;
  panelRefs: MutableRefObject<any[]>;
}
export default function Runbook({
  panelScrollHandler,
  panelRefs,
}: RunbookProps) {
  const { blocks } = useAppSelector(selectRunbook);

  return (
    <div className="w-full justify-center flex flex-col items-center">
      <div className="w-[1024px] min-h-full px-6 pt-6 justify-center flex flex-col inline-flex gap-8">
        {blocks.map((block, i) => {
          return (
            <Panel
              key={block.uuid}
              panel={block}
              panelIndex={i}
              scrollHandler={() => {}}
            />
          );
        })}
      </div>
    </div>
  );
}
