import React, { forwardRef, useRef, useEffect } from "react";

function useFirstRender() {
  const ref = useRef(true);
  const firstRender = ref.current;
  ref.current = false;
  return firstRender;
}
interface BeginFlowProps {
  title: string;
  index: number;
  totalFlows: number;
  description?: string;
  uuid: string;
  doScrollIntoView: boolean;
}

export const BeginFlow = forwardRef(function BeginFlow(
  {
    title,
    description,
    index,
    totalFlows,
    uuid,
    doScrollIntoView,
  }: BeginFlowProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const firstRender = useFirstRender();

  useEffect(() => {
    if (!firstRender || !doScrollIntoView) return;

    const scrollTimer = setTimeout(() => {
      document
        .getElementById(uuid)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);

    return () => clearTimeout(scrollTimer);
  }, [firstRender, doScrollIntoView, uuid]);

  return (
    <div className="scroll-m-44 w-full my-8" id={uuid}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white text-base font-normal font-gt uppercase">
          Flow Execution {index + 1}/{totalFlows}
        </h3>
        <p className="text-base text-sm text-gray-500">
          Beginning new flow '{title}'
        </p>
      </div>
      <div className="h-[2px] w-full rounded-full shadow-sm bg-gradient-to-r from-emerald-400 via-emerald-400 to-transparent" />

      {description && (
        <div className="mt-2 flex justify-end">
          <p className="text-xs text-gray-400 italic">{description}</p>
        </div>
      )}
    </div>
  );
});
