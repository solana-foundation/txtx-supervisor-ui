import React from "react";
import { useAppSelector } from "../../hooks";
import { selectRunbookComplete } from "../../reducers/runbooks-slice";
import confetti from "../animations/confetti";

let confetti_has_displayed = false;
export default function RunbookCopmlete() {
  const runbookComplete = useAppSelector(selectRunbookComplete);
  if (!runbookComplete) {
    confetti_has_displayed = false;
    return;
  }
  if (!confetti_has_displayed) {
    confetti_has_displayed = true;
    // @ts-ignore
    confetti.start();
    setTimeout(function () {
      // @ts-ignore
      confetti.stop();
    }, 2500);
  }
  return (
    <div className="overflow-auto scrollbar-thin self-stretch flex-col justify-start items-start flex rounded-lg shadow border border-neutral-800 mb-8">
      <div className="h-32 w-fit min-w-full self-stretch bg-zinc-900 border-neutral-900 border rounded flex-col justify-start items-start flex">
        <div className="w-full p-4 bg-black bg-opacity-0 justify-start items-start inline-flex">
          <div className="grow shrink basis-0 text-emerald-500 text-base font-normal font-gt uppercase">
            Runbook Complete
          </div>
        </div>
      </div>
    </div>
  );
}
