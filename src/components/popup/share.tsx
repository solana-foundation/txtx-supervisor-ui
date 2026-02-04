import React from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import classnames from "../ui-kit/classnames";
import CopyLinkIcon from "../icons/copy-link";

export default function Share() {
  const timer = 60;

  const [currentTime, setCurrentTime] = React.useState(timer);
  const [fieldLink, setFieldLink] = React.useState("https://tx.new/alexgo/c/4");

  React.useEffect(() => {
    let timer = setInterval(() => {
      setCurrentTime((time) => {
        if (time === 0) {
          clearInterval(timer);
          return 0;
        } else return time - 1;
      });
    }, 1000);
  }, []);

  return (
    <div className="relative w-full max-w-[410px] border border-zinc-700 bg-zinc-200 text-gray-400 rounded-[16px] text-center p-6">
      <XMarkIcon className="absolute top-[12px] right-[12px] w-[20px] cursor-pointer" />
      <div className="text-emerald-500 text-base font-normal font-gt uppercase mb-5">
        Share Runbook
      </div>
      <div className="h-[1px] bg-gray-800 my-6" />
      <div className="relative flex items-center justify-between mb-3">
        <CopyLinkIcon className="absolute top-[14px] left-[12px] pointer-events-none" />
        <input
          className={classnames(
            "text-sm font-normal w-[220px] py-2.5 pr-3 pl-[36px]",
            "border-gray-800 rounded",
            "bg-neutral-800 text-gray-400",
            "focus:outline-none focus:ring-0 ring-0 focus:border-emerald-500",
          )}
          value={fieldLink}
          onChange={(ev) => setFieldLink(ev.target.value)}
        />
        <div className="flex items-center gap-2">
          <div className="text-emerald-550">423-904</div>
          <div className="w-[34px]">
            <CircularProgressbar
              value={(100 * currentTime) / timer}
              text={currentTime || "0"}
              styles={buildStyles({
                strokeLinecap: "butt",
                pathColor: `#00D992`,
                textColor: "#B7BBBC",
                trailColor: "#122221",
                textSize: "32px",
              })}
            />
          </div>
        </div>
      </div>
      <button
        className="transition duration-200 rounded text-xs font-gt uppercase tracking-wide bg-emerald-800 hover:bg-teal-950 text-emerald-500 py-[12px] px-4 w-full border border-emerald-950"
        onClick={() => {
          navigator.clipboard.writeText(fieldLink);
        }}
      >
        Copy link
      </button>
    </div>
  );
}
