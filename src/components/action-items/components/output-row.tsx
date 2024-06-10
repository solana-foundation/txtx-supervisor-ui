import React from "react";

export interface OutputRow {
  displayValue: string;
}
export function OutputRow({ displayValue }: OutputRow) {
  return (
    <div className="overflow-auto scrollbar-thin self-stretch flex-col justify-start items-start flex">
      <div className="w-fit self-stretch bg-black rounded flex-col justify-start items-start flex">
        <div className="w-full p-4 bg-black bg-opacity-0 justify-start items-start inline-flex">
          <div className="grow shrink basis-0 text-white text-sm font-medium font-inter">
            {displayValue}
          </div>
        </div>
      </div>
    </div>
  );
}
