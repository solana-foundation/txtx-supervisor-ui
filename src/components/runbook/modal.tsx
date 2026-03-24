import React, { forwardRef } from "react";
import { ModalBlock } from "../../types/runbook";
import { useAppDispatch } from "../../hooks";
import { setModalVisibility } from "../../reducers/runbooks-slice";
import { ModalWrapper } from "./modal-wrapper";
import useHandleEscapeKey from "../../hooks/useHandleEscapeKey";
import { Group, GroupAccent } from "../action-items/shared/group";

export interface Modal {
  block: ModalBlock<true>;
  index: number;
}
export function Modal({ block, index }: Modal) {
  const dispatch = useAppDispatch();
  const isVisible = block.visible;

  useHandleEscapeKey(
    () => {
      dispatch(setModalVisibility([block.uuid, false]));
    },
    [dispatch, block.uuid, block.visible],
    isVisible,
  );

  return (
    <ModalWrapper
      visible={isVisible}
      onClick={() => {
        dispatch(setModalVisibility([block.uuid, false]));
      }}
    >
      <ModalPanel
        key={block.uuid}
        block={block}
        panelIndex={index}
        scrollHandler={() => {}}
      />
    </ModalWrapper>
  );
}

interface ModalPanelProps {
  block: ModalBlock;
  panelIndex: number;
  scrollHandler: any;
}

const ModalPanel = forwardRef(function Panel(
  { block, panelIndex, scrollHandler }: ModalPanelProps,
  ref: React.ForwardedRef<any>,
) {
  const { uuid, visible, panel } = block;
  const { title, description, groups } = panel;

  const panelId =
    title.toLocaleLowerCase().split(" ").join("-") + "-" + panelIndex;

  return (
    <div
      className="w-full p-4 md:p-6 bg-zinc-900 rounded-lg shadow border border-neutral-800 flex-col justify-center items-start gap-2.5 inline-flex"
      id={uuid}
    >
      <div className="self-stretch justify-start items-start inline-flex">
        <div
          className="scroll-mt-44 grow shrink basis-0 text-emerald-500 text-base font-normal font-gt uppercase"
          ref={ref}
          id={panelId}
        >
          {title}
        </div>
      </div>
      <div className="w-full h-[19px] text-gray-400 text-sm font-normal font-inter">
        {description}
      </div>
      {groups.map((group, i) => {
        const mod = i % 3;
        return (
          <Group
            group={group}
            key={i}
            accent={
              mod === 0
                ? GroupAccent.Red
                : mod === 1
                  ? GroupAccent.Blue
                  : mod === 2
                    ? GroupAccent.Amber
                    : undefined
            }
            modalUuid={uuid}
          />
        );
      })}
    </div>
  );
});
