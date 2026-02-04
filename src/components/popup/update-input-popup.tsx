import { useEffect, useRef } from "react";
import { ActionItemStatus } from "../main/types";
import useHandleEscapeKey from "../../hooks/useHandleEscapeKey";
import useHandleEnterKey from "../../hooks/useHandleEnterKey";
import { ModalWrapper } from "../main/modal-wrapper";
import React from "react";
import classnames from "../ui-kit/classnames";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Button } from "../ui-kit";

export default function UpdateInputPopup({
  actionStatus,
  defaultInputValue,
  confirmAction,
  closePopup,
  title,
  description,
  visible,
}: {
  actionStatus: ActionItemStatus;
  defaultInputValue: string | number | object | undefined;
  confirmAction: (value: string | number | object) => void;
  closePopup: () => void;
  title: string;
  description?: string;
  visible: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { status } = actionStatus;
  let inputClass = "";
  if (status === "Todo") {
    inputClass = "bg-neutral-800 text-gray-400";
  } else if (status === "Success") {
    inputClass = "bg-neutral-800 text-emerald-500";
  } else if (status === "Error") {
    inputClass = "bg-stone-900 text-rose-400";
  }

  const inputKey = Math.random().toString(36).substring(2, 15);

  const onConfirm = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    let inputElement = document.getElementById(inputKey);
    let inputValue = (inputElement as HTMLInputElement)?.value;
    confirmAction(inputValue);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  }, []);

  useHandleEscapeKey(closePopup, [visible], visible);
  useHandleEnterKey(onConfirm, [visible], visible);

  return (
    <ModalWrapper visible={visible} onClick={closePopup}>
      <div className="m-auto w-[320px] border border-zinc-700 bg-zinc-200 text-gray-400 rounded-[16px] text-center p-6">
        <div className="text-emerald-500 text-base font-normal font-gt uppercase mb-2">
          Update input
        </div>
        <div className="text-sm text-gray-400 px-6 leading-[17px]">
          {description || title}
        </div>
        <input
          className={classnames(
            "grow text-sm font-normal font-gt leading-[18.20px] my-[20px] w-full",
            "border-gray-800 rounded-sm",
            "focus:outline-none focus:ring-0 ring-0 focus:border-emerald-500",
            inputClass,
          )}
          defaultValue={defaultInputValue}
          key={inputKey}
          id={inputKey}
          ref={inputRef}
        />
        <Button
          onClick={onConfirm}
          className="uppercase w-full"
          size={Button.ButtonSizes.m}
          variant={Button.ButtonVariants.primary}
        >
          CONFIRM
        </Button>
        <XMarkIcon
          className="absolute top-[10px] right-[10px] w-[20px] cursor-pointer rounded hover:text-gray-400/80 transition-colors"
          onClick={closePopup}
        />
      </div>
    </ModalWrapper>
  );
}
