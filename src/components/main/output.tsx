import React from "react";
import { CodeBlock } from "./code-block";

export interface Output {
  name: string;
  description: string;
  value: string;
  uuid: string;
}
export function Output({ name, description, value }: Output) {
  return (
    <div className="mt-4">
      <p className="text-sm font-medium dark:text-white/90 leading-6">{name}</p>
      <p className="text-sm font-medium dark:text-slate-500 leading-6">
        {description}
      </p>
      <CodeBlock value={value} />
    </div>
  );
}
