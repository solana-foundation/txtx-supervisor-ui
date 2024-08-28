// https://tppr.me/K7gKC4

import React from "react";
import { classNames } from "../../utils/helpers";
import GoogleIcon from "../../components/icons/google";
import GithubIcon from "../../components/icons/github";
import { XMarkIcon } from "@heroicons/react/20/solid";

export default function FormSignUp() {
  return (
    <div className="relative w-[410px] border border-zinc-700 bg-zinc-200 text-gray-400 rounded-[16px] text-center p-8">
      <XMarkIcon className="absolute top-[12px] right-[12px] w-[20px] cursor-pointer" />
      <div className="text-emerald-500 text-base font-normal font-gt uppercase mb-8">
        Sign-up
      </div>
      <div className="flex flex-col gap-2.5">
        <input
          placeholder="Enter your email"
          className={classNames(
            "text-xs font-normal font-gt w-full p-3",
            "border-gray-800 rounded",
            "bg-neutral-800 text-gray-400",
            "focus:outline-none focus:ring-0 ring-0 focus:border-emerald-500",
          )}
        />
        <button className="transition duration-200 rounded text-xs font-gt uppercase tracking-wide bg-emerald-800 hover:bg-teal-950 text-emerald-500 py-[13px] px-4 w-full border border-emerald-950">
          Sign-in with email
        </button>
      </div>
      <div className="h-[1px] bg-gray-800 my-6" />
      <div className={"flex flex-col gap-2"}>
        <button
          className={classNames(
            "transition duration-200 rounded text-xs font-gt uppercase tracking-wide bg-black hover:bg-gray-800 text-zinc-400 py-[13px] px-4 w-full",
            "flex justify-center gap-2",
          )}
        >
          <GithubIcon />
          Github connect
        </button>
        <button
          className={classNames(
            "transition duration-200 rounded text-xs font-gt uppercase tracking-wide bg-black hover:bg-gray-800 text-zinc-400 py-[13px] px-4 w-full",
            "flex justify-center gap-2",
          )}
        >
          <GoogleIcon />
          Google connect
        </button>
      </div>
    </div>
  );
}
