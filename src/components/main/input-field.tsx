import React from "react";

export interface InputFieldSetProps {
  value?: string | boolean | number;
  default?: string | boolean | number;
  description?: string;
  commandUuid: string;
}

export function InputFieldSet({
  description,
  default: defaultValue,
  value,
  commandUuid,
}: InputFieldSetProps) {
  return (
    <div className="w-full h-[83px] p-2 rounded flex-col justify-start items-start gap-2 inline-flex">
      <div className="self-stretch justify-start items-start gap-2.5 inline-flex">
        <label
          htmlFor={commandUuid}
          className="text-zinc-300 text-sm font-medium font-['Inter']"
        >
          {description || "No description provided"}
        </label>
      </div>
      <div className="block self-stretch h-[42px] bg-zinc-950 rounded-sm border border-zinc-300 flex-col justify-center items-start gap-2.5 flex">
        <input
          id={commandUuid}
          className="self-stretch bg-zinc-950 text-zinc-300 rounded-sm text-sm font-medium font-['Inter'] focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus-ring"
          value={defaultValue?.toString() || undefined}
          onChange={console.log}
        />
      </div>
    </div>
  );
}
