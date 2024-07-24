// https://tppr.me/tlIS6c

import React from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";

export default function Plans() {
  return (
    <div className="relative w-full max-w-[730px] border border-zinc-700 bg-zinc-200 text-gray-400 rounded-[16px] text-center p-8">
      <XMarkIcon className="absolute top-[12px] right-[12px] w-[20px] cursor-pointer" />
      <div className="text-emerald-500 text-base font-normal font-gt uppercase mb-8">
        Choose your plan
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="border border-zinc-700 rounded-2xl p-6 grow shrink basis-full md:basis-0">
          <div className="text-emerald-500 text-sm font-normal font-gt uppercase mb-2.5">
            Anon
          </div>
          <div className="text-[22px] text-white uppercase mb-4">Free</div>
          <div className="h-[1px] bg-gray-800 mb-4" />
          <div className="md:h-[75px] mb-8">
            <div className="text-sm leading-[17px]">
              Free, private and forever open source
            </div>
          </div>
          <button className="transition duration-200 rounded text-xs font-gt uppercase tracking-wide bg-black hover:bg-gray-800 text-zinc-400 py-[13px] px-4 w-full">
            Add github star
          </button>
        </div>
        <div className="border border-zinc-700 rounded-2xl p-6 grow shrink basis-full md:basis-0">
          <div className="text-emerald-500 text-sm font-normal font-gt uppercase mb-2.5">
            Cloud services
          </div>
          <div className="mb-4">
            <span className="text-[22px] text-white uppercase">$9.00</span>
            <span className="text-sm leading-[17px]">/seat/month</span>
          </div>
          <div className="h-[1px] bg-gray-800 mb-4" />
          <div className="md:h-[75px] mb-8">
            <ul className="text-sm leading-[17px] flex flex-col gap-3 whitespace-nowrap">
              <li>✓ Colaborative execution</li>
              <li>✓ Multi chain auto-faucets</li>
              <li>✓ Multi chain faucets</li>
            </ul>
          </div>
          <button className="transition duration-200 rounded text-xs font-gt uppercase tracking-wide bg-emerald-800 hover:bg-teal-950 text-emerald-500 py-[12px] px-4 w-full border border-emerald-950">
            Sign-up
          </button>
        </div>
        <div className="border border-zinc-700 rounded-2xl p-6 grow shrink basis-full md:basis-0">
          <div className="text-emerald-500 text-sm font-normal font-gt uppercase mb-2.5">
            Enterprise
          </div>
          <div className="text-[22px] text-white uppercase mb-4">Custom</div>
          <div className="h-[1px] bg-gray-800 mb-4" />
          <div className="md:h-[75px] mb-8">
            <div className="text-sm leading-[17px]">Taylored features</div>
          </div>
          <a
            href="#"
            className="block transition duration-200 rounded text-xs font-gt uppercase tracking-wide bg-black hover:bg-gray-800 text-zinc-400 py-[13px] px-4 w-full"
          >
            Contact us
          </a>
        </div>
      </div>
    </div>
  );
}
