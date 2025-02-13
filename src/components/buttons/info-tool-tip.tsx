import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import { classNames } from "../../utils/helpers";

export interface InfoToolTipProps {
  text: string;
  isCurrent?: boolean;
}

export function InfoToolTip({ text, isCurrent = false }: InfoToolTipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover className="relative flex items-center">
      <PopoverButton
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={classNames(
          "flex items-center justify-center w-6 h-6 rounded-full transition-colors outline-none focus:outline-none",
          isCurrent
            ? "text-gray-500 hover:text-gray-400"
            : "text-gray-700 hover:text-gray-500",
        )}
      >
        <InformationCircleIcon className="w-5 h-5" />
      </PopoverButton>
      {isOpen && (
        <PopoverPanel
          static
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="absolute left-8 min-w-48 z-10 p-2 text-sm text-gray-400 bg-gray-700 rounded-lg shadow-lg"
        >
          {text}
        </PopoverPanel>
      )}
    </Popover>
  );
}
