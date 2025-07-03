import React from "react";
import { ModalWrapper } from "../main/modal-wrapper";
import useHandleEscapeKey from "../../hooks/useHandleEscapeKey";
import MarkdownRenderer from "../action-items/components/markdown-renderer";
import { Button } from "@txtxrun/txtx-ui-kit";

export default function MarkdownDescriptionPopup({
  title,
  subTitle,
  markdown,
  className,
  closePopup,
  visible,
}: {
  title: string;
  subTitle?: string;
  markdown: string;
  className?: string;
  closePopup: () => void;
  visible: boolean;
}) {
  useHandleEscapeKey(closePopup, [visible], visible);
  return (
    <ModalWrapper visible={visible} onClick={closePopup}>
      <div className="m-auto w-full min-w-[800px] min-h-80 max-h-[600px] border border-zinc-700 bg-zinc-200 text-gray-400 rounded p-6 flex flex-col">
        <div className="pb-2 grow shrink basis-0 text-emerald-500 text-base font-normal font-gt uppercase">
          {title}
        </div>
        {subTitle ? (
          <div className="pb-4 text-sm font-normal font-inter rounded">
            {subTitle}
          </div>
        ) : undefined}
        <MarkdownRenderer
          className="flex-1 h-full p-2 pl-4 mb-2 rounded border border-gray-700 text-gray-300 overflow-y-auto scrollbar-thin bg-black"
          content={markdown}
        />
        <div className="self-stretch py-2.5 justify-end items-start inline-flex">
          <Button
            onClick={closePopup}
            className="uppercase"
            size={Button.ButtonSizes.l}
            variant={Button.ButtonVariants.primary}
          >
            Close
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
}
