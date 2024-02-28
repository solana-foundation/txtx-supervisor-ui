import React, { useEffect, useRef, useState } from "react";
import { CodeBlock } from "./code-block";

export interface CodeBlockTabs {
  data: { [key: string]: string };
  uuid: string;
  manualUuid: string;
}
export function LabeledCodeBlock({ data, uuid, manualUuid }: CodeBlockTabs) {
  const dataKeys = Object.keys(data);
  const [selected, setSelected] = useState<string>(`${dataKeys[0]}-${uuid}`); // todo, get default in a better way
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  const tabsRef = useRef([]);
  useEffect(() => {
    function setTabPosition() {
      const currentTab = tabsRef.current[selected];
      setTabUnderlineLeft(currentTab?.offsetLeft ?? 0);
      setTabUnderlineWidth(currentTab?.clientWidth ?? 0);
    }

    setTabPosition();
    window.addEventListener("resize", setTabPosition);

    return () => window.removeEventListener("resize", setTabPosition);
  }, [selected]);
  let tabs: React.JSX.Element[] = [];
  let codeBlocks: React.JSX.Element[] = [];

  dataKeys.forEach((dataKey) => {
    const keyUuid = `${dataKey}-${uuid}`;
    const isSelected = selected === keyUuid;
    tabs.push(
      <li
        key={keyUuid}
        ref={(el) => (tabsRef.current[keyUuid] = el)}
        className={
          "h-full px-3 py-1 cursor-pointer uppercase " +
          (isSelected ? "dark:text-emerald-400/90" : "dark:text-slate-500")
        }
        onClick={() => setSelected(keyUuid)}
      >
        {dataKey}
      </li>,
    );
    codeBlocks.push(
      <div className={" " + (isSelected ? "" : "hidden")}>
        <CodeBlock
          code={data[dataKey]}
          dataKey={keyUuid}
          fieldName={dataKey}
          manualUuid={manualUuid}
          constructUuid={uuid}
        />
      </div>,
    );
  });
  return (
    <div>
      <nav className="relative flex pt-2">
        <ul
          role="list"
          className="flex min-w-full flex-none text-xs font-semibold leading-6 "
        >
          {...tabs}
        </ul>
        <span
          className="absolute bottom-0 block h-px dark:bg-emerald-400/90 transition-all duration-300"
          style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
        />
      </nav>
      {...codeBlocks}
    </div>
  );
}
