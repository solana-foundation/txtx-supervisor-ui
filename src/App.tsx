import { Header } from "./components/header/header";
import { Search } from "./components/sidebar/search";
import { Nav, NavGroup } from "./components/sidebar/nav";
import React, { useState } from "react";
import Manual from "./components/main/manual";
import { Logo } from "./components/header/logo";
import { useQuery } from "@apollo/client";
import { GET_MANUALS } from "./utils/queries";
import { ManualMetadata } from "./components/main/types";
import { SortNavItemsRecursive } from "./utils/helpers";
import { useAppDispatch } from "./hooks";
import { addManual } from "./reducers/manualsSlice";

const packageData = {
  title: "Pyth",
  versions: ["0.0.1", "0.0.2"],
};

export default function App() {
  const [navGroups, setNavGroups] = useState<NavGroup[]>();
  const dispatch = useAppDispatch();

  const { loading } = useQuery(GET_MANUALS, {
    onCompleted: (result) => {
      let metadatas: ManualMetadata[] = result.manuals;
      let navGroup: NavGroup = { name: "Usage Manuals", children: [] };
      for (let i = 0; i < metadatas.length; i++) {
        const metadata = metadatas[i];
        navGroup.children.push({
          name: metadata.name,
          manualUuid: metadata.uuid,
        });
        dispatch(addManual([metadata, i === 0]));
      }
      let navGroups = [navGroup];
      navGroups.forEach((group) => group.children.sort(SortNavItemsRecursive));
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
              {loading ? <div>Loading...</div> : <Manual />}
            </div>
          </main>
        </div>

        <aside className="block lg:px-8 xl:left-20 fixed bottom-0 top-16 xl:w-96 overflow-y-auto border-r border-gray-200 px-4 py-6 dark:bg-slate-950 border-r dark:border-slate-500/20 transition-all">
          <Search></Search>

          {loading || !navGroups ? (
            <div>Loading...</div>
          ) : (
            <Nav navGroups={navGroups} />
          )}
        </aside>
      </div>
    </>
  );
}
