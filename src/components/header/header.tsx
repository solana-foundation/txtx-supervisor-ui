import React from "react";
import { useAppSelector } from "../../hooks";
import RunbookStatusBar from "./runbook-status-bar";
import { selectRunbook, setMetadata } from "../../reducers/runbooks-slice";
import { selectIsOperator } from "../../reducers/participant-auth-slice";
import { classNames } from "../../utils/helpers";
import MarkdownDescriptionPopup from "../popup/markdown-description-popup";

export interface HeaderProps {
  title: string;
  panelScrollHandler: any;
  loading: boolean;
}
export function Header({ title, panelScrollHandler, loading }: HeaderProps) {
  const [showMarkdown, setShowMarkdown] = React.useState(false);
  const { metadata } = useAppSelector(selectRunbook);

  const name = loading ? "Loading" : metadata.name;
  const description = loading ? "" : metadata.description;

  const showMarkdownButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMarkdown(true);
  };
  const hideMarkdown = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setShowMarkdown(false);
  };

  const descriptionIsMultiline = description?.includes("\n");
  const descriptionEl = descriptionIsMultiline ? (
    <div
      className="uppercase font-bold self-stretch text-sm font-gt text-center text-emerald-500 cursor-pointer hover:brightness-150"
      onClick={showMarkdownButtonClick}
    >
      runbook documentation
    </div>
  ) : (
    <div className="self-stretch text-white text-sm font-normal font-inter text-center">
      {description}
    </div>
  );

  return (
    <div className="backdrop-blur-md bg-opacity-50 sticky top-0 z-50 px-8 py-4 flex shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 bg-zinc-950 border-b dark:border-zinc-900">
      <div className="flex-1"></div>
      <div className="absolute left-1/2 w-full transform -translate-x-1/2 justify-center flex flex-col items-center">
        <div className="self-stretch px-8 flex-col gap-2 flex">
          <div className="self-stretch text-emerald-500 text-center font-bold font-inter uppercase">
            {name}
          </div>
          {descriptionEl}
          <MarkdownDescriptionPopup
            title="Runbook Documentation"
            markdown={description}
            closePopup={hideMarkdown}
            visible={showMarkdown}
          />

          {/* <RunbookStatusBar
            steps={commandSections.length + 2}
            scrollHandler={panelScrollHandler}
          /> */}
        </div>
      </div>
      <div className="py-4">
        <div className="flex">
          {/* <h1 className="font-bold text-2xl dark:text-emerald-400">{title}</h1> */}
          {/* <VersionBadge versions={versions}></VersionBadge> */}
        </div>
        {/* <span className="font-bold dark:text-slate-500">Protocol Runbook</span> */}
      </div>
      <div className="z-50 h-20 flex-1 flex justify-end flex-col gap-1 justify-end">
        <div className="h-[45px]"></div>
      </div>
    </div>
  );
}
