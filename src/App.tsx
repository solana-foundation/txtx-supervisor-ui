import { Header } from "./components/header/header";
import { Search } from "./components/sidebar/search";
import { Nav, NavGroup } from "./components/sidebar/nav";
import React, { createContext, useState } from "react";
import Manual from "./components/main/manual";
import { Logo } from "./components/header/logo";
import { NavItem } from "./components/sidebar/nav-item";
import { useQuery } from "@apollo/client";
import { GET_MANUALS } from "./utils/queries";
import { ManualDescription } from "./components/main/types";

const packageData = {
  title: "Pyth",
  versions: ["0.0.1", "0.0.2"],
};

export type ActiveManualContext = {
  activeManualId: string;
  setActiveManualId: (id: string) => void;
};
export const ActiveManualContext = createContext({} as ActiveManualContext);

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
export default function App() {
  const [activeManualId, setActiveManualId] = useState("");
  const [navGroups, setNavGroups] = useState<NavGroup[]>();

  const { loading, error } = useQuery(GET_MANUALS, {
    onCompleted: (result) => {
      let manualDescriptions: ManualDescription[] = result.manuals;
      if (manualDescriptions.length > 0) {
        setActiveManualId(manualDescriptions[0].id);
      }
      let navGroup: NavGroup = { name: "Usage Manuals", children: [] };
      for (const description of manualDescriptions) {
        navGroup.children.push({
          name: description.name,
          uuid: description.id,
        });
      }
      let navGroups = [navGroup];
      navGroups.forEach((group) => group.children.sort(SortRecursive));
      setNavGroups(navGroups);
    },
  });

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
              {loading ? (
                <div>Loading...</div>
              ) : (
                <ActiveManualContext.Provider
                  value={{ activeManualId, setActiveManualId }}
                >
                  <Manual />
                </ActiveManualContext.Provider>
              )}
            </div>
          </main>
        </div>

        <aside className="block lg:px-8 xl:left-20 fixed bottom-0 top-16 xl:w-96 overflow-y-auto border-r border-gray-200 px-4 py-6 dark:bg-slate-950 border-r dark:border-slate-500/20 transition-all">
          <Search></Search>

          {loading || !navGroups ? (
            <div>Loading...</div>
          ) : (
            <ActiveManualContext.Provider
              value={{ activeManualId, setActiveManualId }}
            >
              <Nav navGroups={navGroups} />
            </ActiveManualContext.Provider>
          )}
        </aside>
      </div>
    </>
  );
}
