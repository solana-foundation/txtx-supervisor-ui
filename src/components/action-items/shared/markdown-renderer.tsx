import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownRenderer({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="font-gt text-xl font-bold mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="font-gt text-l font-semibold mb-3" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="font-gt text-sm list-disc pl-6 mb-4" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="font-gt text-sm list-disc ml-6" {...props} />
          ),
          pre: ({ node, ...props }) => (
            <pre
              className="bg-gray-800 text-sm p-4 rounded mb-4 font-gt"
              {...props}
            />
          ),
          code: ({ node, ...props }) => (
            <code
              className="bg-gray-800 text-sm py-[2px] px-1 rounded font-gt"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-4 font-gt text-sm" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="border-gray-700 my-4" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a
              className="font-gt text-emerald-500 hover:underline text-sm"
              {...props}
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          table: ({ node, ...props }) => (
            <table className="text-sm font-gt mb-4" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th
              className="border-b border-gray-700 p-2 font-semibold"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td className="border-b border-gray-700 p-2" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold" {...props} />
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
