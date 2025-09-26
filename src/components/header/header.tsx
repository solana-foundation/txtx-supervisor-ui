import React from "react";
import { useAppSelector } from "../../hooks";
import RunbookStatusBar from "./runbook-status-bar";
import { selectRunbook, setMetadata } from "../../reducers/runbooks-slice";
import { classNames } from "../../utils/helpers";
import MarkdownDescriptionPopup from "../popup/markdown-description-popup";
import { BookOpenIcon } from "@heroicons/react/20/solid";

export interface HeaderProps {
  loading: boolean;
}
export function Header({ loading }: HeaderProps) {
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

  const descriptionIsMarkdown = description?.includes("\n");

  return (
    <div className="backdrop-blur-md bg-opacity-50 sticky top-0 z-50 h-28 px-8 flex shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 bg-zinc-950 border-b dark:border-zinc-900">
      {/* left spacer */}
      <div className="flex-1" />

      {/* centered title + description */}
      <div className="absolute left-1/2 w-full transform -translate-x-1/2 justify-center flex flex-col items-center">
        <div className="self-stretch flex-col gap-2 flex">
          <div className="self-stretch text-emerald-500 text-center font-bold font-inter uppercase">
            {name}
          </div>
          {!descriptionIsMarkdown && (
            <div className="self-stretch text-white text-sm font-normal font-inter text-center">
              {description}
            </div>
          )}
        </div>
      </div>

      {/* right-aligned actions */}
      <div className="flex-1 flex justify-end items-center gap-2">
        {descriptionIsMarkdown && (
          <button
            onClick={showMarkdownButtonClick}
            className="flex items-center gap-1 px-2 py-1 rounded-full text-emerald-500 hover:brightness-125"
          >
            <BookOpenIcon className="w-8 text-emerald-500 hover:brightness-125" />
            <span className="sr-only">Read documentation</span>
          </button>
        )}
      </div>

      <MarkdownDescriptionPopup
        title="Runbook Documentation"
        markdown={description}
        closePopup={hideMarkdown}
        visible={showMarkdown}
      />
    </div>
  );
}
