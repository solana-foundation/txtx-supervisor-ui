// https://tppr.me/lUCOaW

import React from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { classNames } from "../../utils/helpers";

const networkList = ["devnet", "testnet", "mainnet"];

export default function Network() {
  const [active, setActive] = React.useState(0);

  return (
    <div className="relative w-[320px] border border-zinc-700 bg-zinc-200 text-gray-400 rounded-[16px] text-center p-6">
      <XMarkIcon className="absolute top-[12px] right-[12px] w-[20px] cursor-pointer" />
      <div className="text-emerald-500 text-base font-normal font-gt uppercase mb-5">
        Change network
      </div>
      <div className="flex flex-col gap-1 text-left mb-5">
        {networkList.map((item, idx) => (
          <div
            key={item}
            onClick={() => setActive(idx)}
            className={classNames(
              "flex items-center gap-3 px-3 py-2 rounded border transition-colors cursor-pointer",
              active === idx
                ? "bg-emerald-950 border-teal-950"
                : "bg-gray-950 border-neutral-800",
            )}
          >
            <div
              className={classNames(
                "flex border w-[16px] aspect-square rounded-full transition-colors",
                active === idx ? "border-emerald-500" : "border-gray-700",
              )}
            >
              <div
                className={classNames(
                  "m-auto w-[8px] aspect-square rounded-full transition-colors",
                  active === idx ? "bg-emerald-500" : "",
                )}
              />
            </div>
            <div
              className={classNames(
                "flex-1",
                active === idx ? "text-emerald-500" : "",
              )}
            >
              {item}
            </div>
          </div>
        ))}
      </div>
      <div className={"text-sm text-rose-400 leading-[17px] mb-4 px-2"}>
        The ongoing execution will be interrupted
      </div>
      <button className="transition duration-200 rounded text-xs font-gt uppercase tracking-wide bg-rose-400 hover:bg-rose-350 text-black py-[13px] px-4 w-full">
        Reset execution
      </button>
    </div>
  );
}
