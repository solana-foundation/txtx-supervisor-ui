import React, { useEffect, useRef } from "react";
import { useAppSelector } from "../../hooks";
import {
  selectRunbookCleanupInfo,
  selectRunbookComplete,
} from "../../reducers/runbooks-slice";
import confetti from "../animations/confetti";
import MarkdownRenderer from "../action-items/components/markdown-renderer";
import { InfoToolTip } from "../buttons/info-tool-tip";

const CONFETTI_DURATION = 2500;
const SCROLL_DELAY = 200;

export default function RunbookComplete() {
  const runbookComplete = useAppSelector(selectRunbookComplete);
  const runbookCleanupInfo = useAppSelector(selectRunbookCleanupInfo);
  const confettiHasDisplayed = useRef(false);

  useEffect(() => {
    if (!runbookComplete) {
      confettiHasDisplayed.current = false;
      return;
    }

    if (!confettiHasDisplayed.current) {
      confettiHasDisplayed.current = true;
      confetti.start();
      const confettiTimer = setTimeout(() => {
        confetti.stop();
      }, CONFETTI_DURATION);

      return () => clearTimeout(confettiTimer);
    }
  }, [runbookComplete]);

  useEffect(() => {
    if (!runbookComplete) return;

    const scrollTimer = setTimeout(() => {
      document
        .getElementById("runbook-complete")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, SCROLL_DELAY);

    return () => clearTimeout(scrollTimer);
  }, [runbookComplete]);

  if (!runbookComplete) {
    return null;
  }

  return (
    <div
      className="w-full min-h-32 p-4 md:p-6 bg-zinc-900 rounded-lg shadow border border-neutral-800 flex-col justify-center items-start gap-2.5 inline-flex"
      id="runbook-complete"
    >
      <div className="self-stretch justify-start items-start inline-flex mb-4">
        <div className="scroll-mt-44 grow shrink basis-0 text-emerald-500 text-base font-normal font-gt uppercase">
          Runbook Complete
        </div>
      </div>

      {runbookCleanupInfo &&
        runbookCleanupInfo.length > 0 &&
        runbookCleanupInfo.map((info, index) => (
          <div
            key={index}
            className="w-full flex-col justify-center items-start gap-5 inline-flex text-gray-400 mb-4"
          >
            <div className="w-full self-stretch justify-start flex flex-col items-start">
              <div className="w-full flex items-center justify-between">
                <span className="text-gray-400 px-2 text-sm font-normal font-inter rounded">
                  {info.title}
                </span>
                <InfoToolTip
                  text={`This is derived from the \`${info.constructName}\` construct`}
                  isCurrent={true}
                  className="mr-2"
                />
              </div>
            </div>
            <div className="w-full relative">
              <div className="w-full self-stretch bg-white/opacity-0 justify-start items-start inline-flex cursor-pointer flex-wrap rounded">
                <div className="self-stretch flex-col justify-start items-start inline-flex rounded max-w-full">
                  <MarkdownRenderer
                    className="flex-1 h-full p-2 pl-4 mb-2 rounded border border-gray-700 text-gray-300 overflow-y-auto scrollbar-thin bg-black"
                    content={info.details}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
