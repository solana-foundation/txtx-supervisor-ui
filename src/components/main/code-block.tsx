import React from "react";

export interface CodeBlock {
  data: { [key: string]: string };
}
export function CodeBlock({ data }: CodeBlock) {
  return (
    <pre className="scrollbar-h-1 scrollbar scrollbar-thumb-slate-500/50 scrollbar-track-slate-950 scrollbar-thumb-rounded-full scrollbar-track-rounded-full overflow-x-auto w-full whitespace-pre text-sm font-medium dark:text-slate-500 leading-6 mt-2 -ml-0.5 px-2.5 py-1 border rounded dark:border-slate-500/20 dark:bg-slate-950">
      <code className="w-full break-words box-decoration-clone font-mono ">
        {Object.keys(data).map((k) => {
          return `${k}: ${data[k]}\n`;
        })}
      </code>
    </pre>
  );
}
