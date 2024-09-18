import React, { forwardRef, useRef } from "react";
import { ActionBlock } from "./types";
import { Group } from "../action-items/components/group";

function useFirstRender() {
  const ref = useRef(true);
  const firstRender = ref.current;
  ref.current = false;
  return firstRender;
}
export interface PanelProps {
  block: ActionBlock;
  panelIndex: number;
  scrollHandler: any;
  isLast: boolean;
}
export const Panel = forwardRef(function Panel(
  { block, panelIndex, scrollHandler, isLast }: PanelProps,
  ref: React.ForwardedRef<any>,
) {
  const { uuid, visible, panel } = block;
  const { title, description, groups } = panel;
  const firstRender = useFirstRender();

  const panelId =
    title.toLocaleLowerCase().split(" ").join("-") + "-" + panelIndex;

  if (firstRender && isLast && panelIndex !== 0) {
    setTimeout(() => {
      document
        .getElementById(uuid)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  }

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
      {groups.map((group, i) => (
        <Group group={group} key={i} />
      ))}
    </div>
  );
});
