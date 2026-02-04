import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import classnames from "../ui-kit/classnames";

export interface InfoToolTipProps {
  text: string;
  isCurrent?: boolean;
  className?: string;
}

export function InfoToolTip({
  text,
  isCurrent = false,
  className = "",
}: InfoToolTipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [delayHandler, setDelayHandler] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (delayHandler) {
      clearTimeout(delayHandler);
      setDelayHandler(null);
    }
    setIsOpen(true);
  };
  const handleMouseLeave = () => {
    setDelayHandler(
      setTimeout(() => {
        setIsOpen(false);
      }, 200),
    );
  };

  return (
    <Popover className={classnames("relative flex items-center", className)}>
      <PopoverButton
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={classnames(
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
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="absolute right-full mr-1 min-w-48 z-50 p-2 text-sm text-gray-400 bg-black rounded-lg shadow-lg transition-colors shadow-md"
        >
          {text}
        </PopoverPanel>
      )}
    </Popover>
  );
}
