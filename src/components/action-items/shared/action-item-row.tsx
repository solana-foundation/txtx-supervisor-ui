import React from "react";
import classNames from "../../ui/class-names";
import { ActionItemRequest, errorDiagnostic } from "../../../types/runbook";
import { CheckIcon } from "@heroicons/react/20/solid";
import { InfoToolTip } from "../../shared/info-tooltip";
import MarkdownDescriptionPopup from "../../overlays/markdown-description-popup";

export interface ActionItemRow {
  actionItem: ActionItemRequest;
  isFirst: boolean;
  isLast: boolean;
  onClick: () => void;
  subRow?: ActionItemSubRow;
  isCurrent: boolean;
  displayStatus?: boolean;
}

export function ActionItemRow({
  actionItem,
  isFirst,
  isLast,
  children,
  onClick,
  subRow,
  isCurrent,
  displayStatus = true,
}: ActionItemRow & { children: React.ReactNode }) {
  const {
    constructInstanceName,
    description,
    metaDescription,
    actionStatus,
    internalKey,
    markdown,
  } = actionItem;
  const { status } = actionStatus;

  subRow =
    !subRow && status === "Error"
      ? // todo: should ref err component
        { content: <div>{actionStatus.data.message}</div> }
      : subRow;
  const isStatusError = status === "Error";
  const isStatusSuccess = status === "Success";
  const isStateDefault = !isStatusSuccess && !isStatusError && !isCurrent;

  return (
    <div className="w-full relative">
      <div
        onClick={onClick}
        className={classNames(
          "w-full self-stretch bg-white/opacity-0 justify-start items-start inline-flex cursor-pointer flex-wrap rounded",
          isCurrent ? "bg-emerald-950" : "bg-gray-950",
        )}
      >
        <div
          className={classNames(
            "flex items-center justify-center self-stretch",
            displayStatus ? "w-[46px]" : "w-0 pl-4",
          )}
        >
          <div
            className={classNames(
              "flex items-center justify-center",
              displayStatus
                ? "w-[20px] aspect-square border border-emerald-500 rounded-full transition-colors hover:border-emerald-500"
                : "w-0",
              isStatusSuccess ? "border-emerald-500 bg-emerald-500" : "",
              isCurrent ? "border-emerald-500" : "",
              isStateDefault ? "border-zinc-600" : "",
              isStatusError ? "border-rose-400" : "",
            )}
          >
            {displayStatus && (
              <CheckIcon
                className={classNames(
                  "w-[16px] aspect-square transition-opacity",
                  !isStatusSuccess ? "opacity-0" : "",
                )}
              />
            )}
          </div>
        </div>

        <div className="grow shrink basis-0 self-stretch flex-col justify-center items-start inline-flex">
          <div className="self-stretch py-2.5 md:py-[12px] justify-start items-start inline-flex rounded">
            <div
              className={classNames(
                "grow shrink basis-0 text-sm font-normal font-inter leading-[18.20px]",
                isStatusSuccess ? "text-emerald-620" : "",
                isCurrent ? "text-emerald-500" : "",
                isStateDefault ? "text-stone-500" : "",
                isStatusError ? "text-rose-400" : "",
              )}
            >
              <ActionItemTitle
                constructInstanceName={constructInstanceName}
                description={description}
                isCurrent={isCurrent}
                metaDescription={metaDescription}
                internalKey={internalKey}
                markdown={markdown}
              />
            </div>
          </div>
        </div>

        {children}
      </div>

      {subRow ? (
        <ActionItemSubRow {...subRow} isError={isStatusError} />
      ) : undefined}

      {!isLast && <div className="border-b border-gray-800" />}
    </div>
  );
}

export interface ActionItemTitle {
  constructInstanceName: string;
  internalKey: string;
  description?: string;
  metaDescription?: string;
  markdown?: string;
  isCurrent: boolean;
}
export function ActionItemTitle({
  constructInstanceName,
  internalKey,
  description,
  metaDescription,
  markdown,
  isCurrent,
}: ActionItemTitle) {
  const [showMarkdown, setShowMarkdown] = React.useState(false);
  const hasDescription = description != null;
  const hasMarkdown = !!markdown;
  const hasNeitherDescriptionNorMarkdown = !hasDescription && !hasMarkdown;
  const internalKeySkipDescription = internalKey === "env";
  const showDescription = !internalKeySkipDescription;

  const primary = metaDescription ? metaDescription : constructInstanceName;
  let secondary = null;

  const descriptionTextColor = isCurrent ? "text-blue-400" : "";

  const markdownButtonColor = isCurrent ? "text-emerald-500" : "";

  const showMarkdownButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMarkdown(true);
  };
  const hideMarkdown = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setShowMarkdown(false);
  };

  if (hasDescription && hasMarkdown) {
    secondary = (
      <span className="font-inter text-xs font-semibold">
        <span className={classNames(descriptionTextColor)}>{description}</span>
        <span
          className={classNames(
            "uppercase font-bold ml-2 hover:brightness-150",
            markdownButtonColor,
          )}
          onClick={showMarkdownButtonClick}
        >
          more
        </span>
      </span>
    );
  } else if (hasDescription && !hasMarkdown) {
    secondary = (
      <span
        className={classNames(
          "font-gt text-xs font-semibold",
          descriptionTextColor,
        )}
      >
        {description}
      </span>
    );
  } else if (!hasDescription && hasMarkdown) {
    secondary = (
      <span
        className={classNames(
          "uppercase font-gt text-xs font-semibold hover:brightness-150",
          markdownButtonColor,
        )}
        onClick={showMarkdownButtonClick}
      >
        read documentation
      </span>
    );
  } else {
    secondary = (
      <span
        className={classNames(
          "font-gt text-xs font-semibold",
          isCurrent ? "text-amber-400" : "",
        )}
      >
        ⚠ No description provided
      </span>
    );
  }

  const descriptionEl = showDescription ? (
    <div className="flex flex-col gap-0.5">
      {primary}
      {secondary}
    </div>
  ) : (
    <span>{metaDescription}</span>
  );

  const tooltipText = internalKeySkipDescription
    ? "This action is available by default when your `txtx.yml` has multiple environments"
    : `This is derived from the \`${constructInstanceName}\` construct`;

  return (
    <div className="w-full self-stretch justify-start flex flex-col items-start">
      <div className="w-full flex items-center justify-between">
        {descriptionEl}
        <InfoToolTip
          text={tooltipText}
          isCurrent={isCurrent}
          className="mr-4"
        />
        {markdown ? (
          <MarkdownDescriptionPopup
            title="Description"
            subTitle={`Markdown description for the '${constructInstanceName}' construct.`}
            markdown={markdown}
            closePopup={hideMarkdown}
            visible={showMarkdown}
          />
        ) : undefined}
      </div>
    </div>
  );
}

export interface ActionItemSubRow {
  content: JSX.Element;
  isError?: boolean;
  footer?: JSX.Element;
}
export function ActionItemSubRow({
  content,
  footer,
  isError = false,
}: ActionItemSubRow) {
  let footerEl = footer ? (
    <div className="absolute bottom-4 right-4 self-stretch justify-end items-end gap-2.5 inline-flex ">
      {footer}
    </div>
  ) : null;

  return (
    <div
      className={classNames(
        "overflow-auto w-full p-3 pb-0 justify-start items-start inline-flex bg-black rounded-b",
        footer ? "min-h-20" : "",
        // todo, investigate why scrollbar styling isn't working
        "scrollbar-thin scrollbar-h-1",
      )}
    >
      <div
        className={classNames(
          "grow shrink basis-0 flex-col justify-start items-start inline-flex",
          footer ? "gap-2.5" : "",
        )}
      >
        <div
          className={classNames(
            "self-stretch text-sm font-medium font-inter leading-[18.20px]",
            isError ? "text-rose-400" : "text-stone-500",
          )}
        >
          {/* weird rendering bug I can't figure out: whenever the text here is an empty string
            there's an unstyled gap. so just insert a zero-width string here
        */}
          {content}
        </div>
      </div>
      {footerEl}
    </div>
  );
}

export function ErrorActionItemRow({
  error,
  originalActionItem,
  isFirst,
  isLast,
  isCurrent,
}: {
  error: string;
  originalActionItem: ActionItemRequest;
  isFirst: boolean;
  isLast: boolean;
  isCurrent: boolean;
}) {
  let errorActionItem: ActionItemRequest = {
    ...originalActionItem,
    actionStatus: {
      status: "Error",
      data: errorDiagnostic(error),
    },
  };
  return (
    <ActionItemRow
      actionItem={errorActionItem}
      isFirst={isFirst}
      isLast={isLast}
      onClick={() => {}}
      isCurrent={isCurrent}
    >
      <div></div>
    </ActionItemRow>
  );
}
