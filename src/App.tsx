import { Header } from "./components/header/header";
import { Search } from "./components/sidebar/search";
import { Nav, NavGroup } from "./components/sidebar/nav";
import React, { createContext, useState } from "react";
import Manual from "./components/main/manual";
import { Logo } from "./components/header/logo";
import { NavItem } from "./components/sidebar/nav-item";

const packageData = {
  title: "Pyth",
  versions: ["0.0.1", "0.0.2"],
};
const navGroups: NavGroup[] = [
  {
    name: "Usage Manuals",
    children: [
      {
        name: "Consume Price Feeds",
        uuid: "a",
        children: [
          {
            name: "Read Price Feeds",
            uuid: "1",
            children: [
              {
                name: "And another one",
                uuid: "z",
                children: [
                  {
                    name: "And another one",
                    uuid: "y",
                    children: [
                      {
                        name: "And another one",
                        uuid: "x",
                      },
                      {
                        name: "And another one",
                        uuid: "w",
                      },
                    ],
                  },
                ],
              },
              {
                name: "And another one",
                uuid: "v",
              },
            ],
          },
          { name: "Update Price Feeds", uuid: "2" },
          { name: "Read Execution Plans", uuid: "3" },
        ],
      },
      {
        name: "Oracle Governance",
        uuid: "b",
        children: [{ name: "Read Execution Plans2", uuid: "4" }],
      },
      {
        name: "Wormhole Governance",
        uuid: "c",
        children: [{ name: "Read Price Feeds2", uuid: "5" }],
      },
    ],
  },
  {
    name: "Deployment Manuals",
    children: [
      {
        name: "Pyth 1.0.0",
        uuid: "d",
        children: [{ name: "Something", uuid: "6" }],
      },
      {
        name: "Pyth 2.0.0",
        uuid: "e",
        children: [{ name: "Something2", uuid: "7" }],
      },
    ],
  },
];
export type ActiveManualContext = {
  activeManualId: string;
  setActiveManualId: (id: string) => void;
};
export const ActiveManualContext = createContext({} as ActiveManualContext);
export default function App() {
  const [activeManualId, setActiveManualId] = useState("1");
  function SortRecursive(a: NavItem, b: NavItem) {
    if (a.children && b.children) {
      a.children.sort(SortRecursive);
      b.children.sort(SortRecursive);
      return 0;
    } else if (a.children) {
      a.children.sort(SortRecursive);
      return 1;
    } else if (b.children) {
      b.children.sort(SortRecursive);
      return -1;
    } else {
      return 0;
    }
  }
  navGroups.forEach((group) => group.children.sort(SortRecursive));
  return (
    <>
      <div>
        {/* Small sidebar */}
        <div className="hidden xl:fixed xl:inset-y-0 xl:left-0 xl:z-50 xl:block xl:w-20 xl:overflow-y-auto dark:bg-slate-950 border-r dark:border-slate-500/20 xl:pb-4 transition-all">
          <div className="flex h-16 shrink-0 items-center justify-center px-4 py-1">
            <Logo />
          </div>
        </div>

        {/* Header & main content */}
        <div className="xl:pl-20 dark:bg-slate-900">
          <Header {...packageData}></Header>
          <main className="pl-80 xl:pl-96 dark:bg-slate-900">
            <div className="px-4 py-10 lg:px-8 lg:py-6 dark:bg-slate-900">
              <Manual />
            </div>
          </main>
        </div>

        <aside className="block lg:px-8 xl:left-20 fixed bottom-0 top-16 xl:w-96 overflow-y-auto border-r border-gray-200 px-4 py-6 dark:bg-slate-950 border-r dark:border-slate-500/20 transition-all">
          <Search></Search>
          <ActiveManualContext.Provider
            value={{ activeManualId, setActiveManualId }}
          >
            <Nav navGroups={navGroups} />
          </ActiveManualContext.Provider>
        </aside>
      </div>
    </>
  );
}
