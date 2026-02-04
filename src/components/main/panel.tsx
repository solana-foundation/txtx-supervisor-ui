import React, { forwardRef, useEffect } from "react";
import { ActionBlock } from "./types";
import { Group } from "../action-items/components/group";

export interface PanelProps {
  block: ActionBlock;
  panelIndex: number;
  isLast: boolean;
  doScrollIntoView: boolean;
}
export const Panel = forwardRef(function Panel(
  { block, panelIndex, isLast, doScrollIntoView }: PanelProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { uuid, panel } = block;
  const { title, description, groups } = panel;
  const [didScroll, setDidScroll] = React.useState(false);

  const panelId =
    title.toLocaleLowerCase().split(" ").join("-") + "-" + panelIndex;

  useEffect(() => {
    if (didScroll || !doScrollIntoView || panelIndex === 0) return;

    const scrollTimer = setTimeout(() => {
      document
        .getElementById(uuid)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      setDidScroll(true);
    }, 200);

    return () => clearTimeout(scrollTimer);
  }, [didScroll, doScrollIntoView, panelIndex, uuid]);

  return (
    <div
      className="scroll-m-44 w-full p-4 md:p-6 bg-zinc-900 rounded-lg shadow border border-neutral-800 flex-col justify-center items-start gap-2.5 inline-flex"
      id={uuid}
    >
      <div className="self-stretch justify-start items-start inline-flex">
        <div
          className="grow shrink basis-0 text-emerald-500 text-base font-normal font-gt uppercase"
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
