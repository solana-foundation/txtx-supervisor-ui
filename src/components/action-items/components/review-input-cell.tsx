import React, { ReactElement } from "react";
import classnames from "../../ui-kit/classnames";
import {
  ActionItemStatus,
  DisplayableValue,
  valueToJson,
  ObjectType,
  Value,
} from "../../main/types";
import { SyntaxHighlighterInput } from "./syntax-highlighter-input";

export interface ReviewInputCell {
  value: Value;
  actionStatus: ActionItemStatus;
  isCurrent: boolean;
}
export function ReviewInputCell({
  value,
  actionStatus,
  isCurrent,
}: ReviewInputCell) {
  const { status } = actionStatus;

  const isStatusError = status === "Error";
  const isStatusSuccess = status === "Success";
  const isStateDefault = !isStatusSuccess && !isStatusError && !isCurrent;

  const childIsFullWidth =
    value.type === "object" ||
    value.type === "array" ||
    (value.type === "string" && value.value.length > 50);

  return (
    <div
      className={classnames(
        "self-stretch flex-col justify-center items-start inline-flex basis-full md:basis-auto",
        childIsFullWidth ? "w-full" : "",
      )}
    >
      <div
        className={classnames(
          "self-stretch pr-3 pb-3 pl-3 md:pt-3 justify-end items-start inline-flex",
          childIsFullWidth ? "w-full" : "",
        )}
      >
        <div
          className={classnames(
            "rounded flex-col justify-end items-start gap-2.5 inline-flex",
            isStatusSuccess ? "bg-teal-950" : "",
            isCurrent ? "bg-emerald-500" : "",
            isStatusError ? "bg-stone-900" : "",
            isStateDefault ? "bg-neutral-800" : "",
            childIsFullWidth ? "w-full" : "px-2 py-0.5",
            isCurrent && childIsFullWidth ? "px-[2px] py-[2px]" : "",
          )}
        >
          <div
            className={classnames(
              "text-sm font-normal font-gt leading-[18.20px] break-all",
              isStatusSuccess ? "text-emerald-500" : "",
              isCurrent ? "text-gray-950" : "",
              isStatusError ? "text-rose-400" : "",
              isStateDefault ? "text-gray-400" : "",
              childIsFullWidth ? "w-full" : "",
            )}
          >
            <DisplayValue input={value} isCurrent={isCurrent} />
          </div>
        </div>
      </div>
    </div>
  );
}

export interface DisplayValue {
  input: Value;
  isCurrent: boolean;
}
export function DisplayValue({ input, isCurrent }: DisplayValue): ReactElement {
  const { type, value } = input;
  if (value == null) {
    return <div>null</div>;
  }
  if (type === "buffer") {
    // todo: add button to copy data
    if (value.length > 100) {
      return <div>{value.slice(0, 100) + "..."}</div>;
    } else {
      return <div>{value}</div>;
    }
  }
  if (type === "string") {
    if (value.startsWith("https://")) {
      return (
        <a href={value} target="_blank">
          {value}
        </a>
      );
    } else if (value.length > 100) {
      return <div>{value}</div>;
    } else {
      return <div className="">{value}</div>;
    }
  } else if (type === "bool") {
    return <div>{value.toString()}</div>;
  } else if (type === "integer") {
    return <div>{parseInt(value)}</div>;
  } else if (type === "null") {
    return <div>"null"</div>;
  } else if (type === "array" && Array.isArray(value)) {
    return (
      <SyntaxHighlighterInput
        language="json"
        isCurrent={isCurrent}
        codeString={JSON.stringify(
          value.map((v) => valueToJson(v)),
          null,
          2,
        )}
      />
    );
  } else if (type === "object" && typeof value === "object") {
    const obj = value as ObjectType;
    const keys = Object.keys(obj);
    let res = {} as { [k: string]: DisplayableValue };
    keys.forEach((k) => {
      res[k] = valueToJson(obj[k]);
    });
    return (
      <SyntaxHighlighterInput
        language="json"
        isCurrent={isCurrent}
        codeString={JSON.stringify(res, null, 2)}
      />
    );
  } else {
    const str = value.toString();
    return <div>{str}</div>;
  }
}
