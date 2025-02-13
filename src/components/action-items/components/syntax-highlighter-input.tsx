import { ChevronDownIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { classNames } from "../../../utils/helpers";

export interface SyntaxHighlighterInputProps {
  codeString: string;
  language: string;
  isCurrent: boolean;
}
export function SyntaxHighlighterInput({
  codeString,
  language,
  isCurrent,
}: SyntaxHighlighterInputProps) {
  let [isFullHeight, setIsFullHeight] = useState(false);

  const lineCount = codeString.split("\n").length;

  return (
    <div className="w-full rounded overflow-hidden">
      <div
        className={classNames(
          "transition-[max-height] duration-300 ease-in-out overflow-scroll scrollbar-thin w-full bg-gray-950 p-0",
          isFullHeight ? "max-h-[80vh]" : "max-h-60",
        )}
      >
        <SyntaxHighlighter
          language={language}
          // @ts-ignore
          style={getSyntaxStyle(isCurrent)}
          className="w-full scrollbar-thin rounded"
          showLineNumbers
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
      {/* add "Expand/Collapse" button if it's a lot of code */}
      {lineCount > 12 ? (
        <div className="items-right flex justify-end text-white bg-gray-950 pb-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFullHeight(!isFullHeight);
            }}
            className="flex items-center justify-center gap-1.5 px-4 text-gray-400 hover:text-gray-500 transition-colors"
          >
            <ChevronDownIcon
              className={classNames(
                "transition-transform duration-300 h-6 w-6",
                isFullHeight ? "rotate-180" : "",
              )}
            />
            <span className="text-sm whitespace-nowrap leading-16 ">
              {isFullHeight ? "Collapse" : "Expand"}
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

function getSyntaxStyle(isCurrent: boolean) {
  return {
    'code[class*="language-"]': {
      color: isCurrent ? "#FFFFFF" : "#B7BBBC",
      fontFamily: "Consolas, Monaco, 'Andale Mono', monospace",
      direction: "ltr",
      textAlign: "left",
      whiteSpace: "pre",
      wordSpacing: "normal",
      wordBreak: "normal",
      lineHeight: "1.5",
      MozTabSize: "4",
      OTabSize: "4",
      tabSize: "4",
      WebkitHyphens: "none",
      MozHyphens: "none",
      msHyphens: "none",
      hyphens: "none",
    },
    'pre[class*="language-"]': {
      color: isCurrent ? "#FFFFFF" : "#B7BBBC",
      fontFamily: "Consolas, Monaco, 'Andale Mono', monospace",
      direction: "ltr",
      textAlign: "left",
      whiteSpace: "pre",
      wordSpacing: "normal",
      wordBreak: "normal",
      lineHeight: "1.5",
      MozTabSize: "4",
      OTabSize: "4",
      tabSize: "4",
      WebkitHyphens: "none",
      MozHyphens: "none",
      msHyphens: "none",
      hyphens: "none",
      padding: "1em",
      margin: ".5em 0",
      overflow: "auto",
      background: "#11171a",
    },
    'pre[class*="language-"]::-moz-selection': {
      color: "inherit",
      background: isCurrent ? "#6897bb" : "#6897bbcc",
    },
    'pre[class*="language-"] ::-moz-selection': {
      color: "inherit",
      background: isCurrent ? "#6897bb" : "#6897bbcc",
    },
    'code[class*="language-"]::-moz-selection': {
      color: "inherit",
      background: isCurrent ? "#6897bb" : "#6897bbcc",
    },
    'code[class*="language-"] ::-moz-selection': {
      color: "inherit",
      background: isCurrent ? "#6897bb" : "#6897bbcc",
    },
    'pre[class*="language-"]::selection': {
      color: "inherit",
      background: isCurrent ? "#6897bb" : "#6897bbcc",
    },
    'pre[class*="language-"] ::selection': {
      color: "inherit",
      background: isCurrent ? "#6897bb" : "#6897bbcc",
    },
    'code[class*="language-"]::selection': {
      color: "inherit",
      background: isCurrent ? "#6897bb" : "#6897bbcc",
    },
    'code[class*="language-"] ::selection': {
      color: "inherit",
      background: isCurrent ? "#6897bb" : "#6897bbcc",
    },
    ':not(pre) > code[class*="language-"]': {
      background: "#2b2b2b",
      padding: ".1em",
      borderRadius: ".3em",
    },
    comment: {
      color: isCurrent ? "#FFFFFF" : "#B7BBBC",
    },
    prolog: {
      color: "#808080",
    },
    cdata: {
      color: "#808080",
    },
    delimiter: {
      color: "#cc7832",
    },
    boolean: {
      color: "#cc7832",
    },
    keyword: {
      color: "#cc7832",
    },
    selector: {
      color: "#cc7832",
    },
    important: {
      color: "#cc7832",
    },
    atrule: {
      color: "#cc7832",
    },
    operator: {
      color: isCurrent ? "#FFFFFF" : "#B7BBBC",
    },
    punctuation: {
      color: isCurrent ? "#FFFFFF" : "#B7BBBC",
    },
    "attr-name": {
      color: isCurrent ? "#FFFFFF" : "#B7BBBC",
    },
    tag: {
      color: "#e8bf6a",
    },
    "tag.punctuation": {
      color: "#e8bf6a",
    },
    doctype: {
      color: "#e8bf6a",
    },
    builtin: {
      color: "#e8bf6a",
    },
    entity: {
      color: isCurrent ? "#6897bb" : "#6897bbcc",
    },
    number: {
      color: isCurrent ? "#6897bb" : "#6897bbcc",
    },
    symbol: {
      color: isCurrent ? "#6897bb" : "#6897bbcc",
    },
    property: {
      color: isCurrent ? "#FFB9C5" : "#FFB9C5CC",
    },
    constant: {
      color: isCurrent ? "#FFB9C5" : "#FFB9C5CC",
    },
    variable: {
      color: isCurrent ? "#FFB9C5" : "#FFB9C5CC",
    },
    string: {
      color: isCurrent ? "#00D992" : "#31715A",
    },
    char: {
      color: "#6a8759",
    },
    "attr-value": {
      color: "#a5c261",
    },
    "attr-value.punctuation": {
      color: "#a5c261",
    },
    "attr-value.punctuation:first-child": {
      color: isCurrent ? "#FFFFFF" : "#B7BBBC",
    },
    url: {
      color: "#287bde",
      textDecoration: "underline",
    },
    function: {
      color: isCurrent ? "#FFFFFF" : "#B7BBBC",
    },
    regex: {
      background: "#364135",
    },
    bold: {
      fontWeight: "bold",
    },
    italic: {
      fontStyle: "italic",
    },
    inserted: {
      background: "#294436",
    },
    deleted: {
      background: "#484a4a",
    },
    "code.language-css .token.property": {
      color: isCurrent ? "#FFFFFF" : "#B7BBBC",
    },
    "code.language-css .token.property + .token.punctuation": {
      color: isCurrent ? "#FFFFFF" : "#B7BBBC",
    },
    "code.language-css .token.id": {
      color: "#ffc66d",
    },
    "code.language-css .token.selector > .token.class": {
      color: "#ffc66d",
    },
    "code.language-css .token.selector > .token.attribute": {
      color: "#ffc66d",
    },
    "code.language-css .token.selector > .token.pseudo-class": {
      color: "#ffc66d",
    },
    "code.language-css .token.selector > .token.pseudo-element": {
      color: "#ffc66d",
    },
  };
}
