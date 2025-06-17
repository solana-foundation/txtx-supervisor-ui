import React from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { classNames } from "../../utils/helpers";
import { InputOption } from "../main/types";
import useHandleEscapeKey from "../../hooks/useHandleEscapeKey";
import useHandleEnterKey from "../../hooks/useHandleEnterKey";
import { Button } from "@txtxrun/txtx-ui-kit";
import { ModalWrapper } from "../main/modal-wrapper";

export interface PickInputPopup {
  options: InputOption[];
  currentSelection: InputOption;
  closePopup: () => void;
  onSubmit: (value: InputOption) => void;
  title: string;
  description?: string;
  visible: boolean;
}

export default function PickInputPopup({
  options,
  currentSelection,
  closePopup,
  onSubmit,
  title,
  description,
  visible,
}: PickInputPopup) {
  const [active, setActive] = React.useState(currentSelection);

  const isChangeEnv = title === "Select the environment to target";

  const updated = active.value !== currentSelection.value;
  const buttonText = isChangeEnv ? "Reset execution" : "Confirm";

  const onButtonClick = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    e?.preventDefault();
    onSubmit(active);
    closePopup();
  };

  useHandleEscapeKey(closePopup, [active, visible], visible);
  useHandleEnterKey(onButtonClick, [active], visible);

  const activeIndex = options.findIndex(
    (option) => option.value === active.value,
  );

  return (
    <ModalWrapper visible={visible} onClick={closePopup}>
      <div className="relative w-[320px] border border-zinc-700 bg-zinc-200 text-gray-400 rounded-[16px] text-center p-6">
        <XMarkIcon
          className="absolute top-[12px] right-[12px] w-[20px] cursor-pointer"
          onClick={closePopup}
        />
        <div className="text-emerald-500 text-base font-normal font-gt uppercase mb-5">
          Pick Input
        </div>
        <div className="text-sm text-gray-400 px-6 pb-6 leading-[17px]">
          {description || title}
        </div>
        <div className="flex flex-col gap-1 text-left mb-5">
          {options.map((item, idx) => (
            <div
              key={item.value}
              onClick={() => {
                console.log("setActive", item);
                setActive(item);
              }}
              className={classNames(
                "flex items-center gap-3 px-3 py-2 rounded border transition-colors cursor-pointer",
                activeIndex === idx
                  ? "bg-emerald-950 border-teal-950"
                  : "bg-gray-950 border-neutral-800",
              )}
            >
              <div
                className={classNames(
                  "flex border w-[16px] aspect-square rounded-full transition-colors",
                  activeIndex === idx
                    ? "border-emerald-500"
                    : "border-gray-700",
                )}
              >
                <div
                  className={classNames(
                    "m-auto w-[8px] aspect-square rounded-full transition-colors",
                    activeIndex === idx ? "bg-emerald-500" : "",
                  )}
                />
              </div>
              <div
                className={classNames(
                  "flex-1",
                  activeIndex === idx ? "text-emerald-500" : "",
                )}
              >
                {item.displayedValue}
              </div>
            </div>
          ))}
        </div>
        {isChangeEnv && updated ? (
          <div className={"text-sm text-rose-400 leading-[17px] mb-4 px-2"}>
            The ongoing execution will be interrupted
          </div>
        ) : null}
        <Button
          onClick={onButtonClick}
          className={classNames(
            "font-gt uppercase tracking-wide w-full",
            isChangeEnv && updated
              ? "bg-rose-400 hover:bg-rose-350 text-black"
              : "bg-emerald-500 hover:bg-emerald-400 text-black",
          )}
          size={Button.ButtonSizes.m}
          variant={Button.ButtonVariants.primary}
        >
          {buttonText}
        </Button>
      </div>
    </ModalWrapper>
  );
}
