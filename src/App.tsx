import { Header } from "./components/header/header";
import { Search } from "./components/sidebar/search";
import { Nav, NavGroup } from "./components/sidebar/nav";
import React, { useState } from "react";
import Runbook from "./components/main/runbook";
import { Logo } from "./components/header/logo";
import { useQuery } from "@apollo/client";
import { GET_PROTOCOL } from "./utils/queries";
import { RunbookMetadata, Protocol } from "./components/main/types";
import { sortNavItemsRecursive } from "./utils/helpers";
import { useAppDispatch } from "./hooks";
import { addRunbook } from "./reducers/runbooks-slice";
import RunbookIcon from "./components/icons/runbook";
import DeploymentIcon from "./components/icons/deployment";

enum PageNav {
  Runbook,
  Deploy,
}
export default function App() {
  // todo: we should probably introduce a router to actually have this on a separate page
  const [pageNav, setPageNav] = useState<PageNav>(PageNav.Runbook);
  const [navGroups, setNavGroups] = useState<NavGroup[]>();
  const [protocolName, setProtocolName] = useState<string>("");
  const dispatch = useAppDispatch();

  const { loading } = useQuery(GET_PROTOCOL, {
    onCompleted: (result) => {
      const protocol: Protocol = result.protocol;
      const protocolName = protocol.name;
      const metadatas: RunbookMetadata[] = protocol.runbooks;
      const navGroup: NavGroup = {
        name: "Runbooks",
        children: [],
      };
      for (let i = 0; i < metadatas.length; i++) {
        const metadata = metadatas[i];
        navGroup.children.push({
          name: metadata.name,
          runbookUuid: metadata.uuid,
        });
        dispatch(addRunbook([metadata, i === 0]));
      }
      let navGroups = [navGroup];
      navGroups.forEach((group) => group.children.sort(sortNavItemsRecursive));
      setNavGroups(navGroups);
      setProtocolName(protocolName);
    },
  });

  return (
    <>
      <div className="bg-gradient-to-b from-gray-950 to-neutral-900">
        {/* Small sidebar */}
        <div className=" fixed inset-y-0 left-0 z-50 block w-20 overflow-y-auto border-r dark:border-slate-500/20 xl:pb-4 transition-all">
          <div className="flex h-20 shrink-0 items-center justify-center px-4 py-1">
            <Logo />
          </div>
          {/* <PageNavButton
            activePageNav={pageNav}
            thisPageNav={PageNav.Runbook}
            name="Runbooks"
            icon={<RunbookIcon />}
            setPageNav={setPageNav}
          />
          <PageNavButton
            activePageNav={pageNav}
            thisPageNav={PageNav.Deploy}
            name="Deploy"
            icon={<DeploymentIcon />}
            setPageNav={setPageNav}
          /> */}
        </div>

        {/* Header & main content */}
        <div className="from-gray-950 to-neutral-900">
          <Header {...{ title: protocolName }}></Header>
          <main className="min-h-screen pt-0 mt-0 pl-80 xl:pl-96 ">
            <div className="py-10 lg:py-6">
              {loading ? <div>Loading...</div> : <Runbook />}
            </div>
          </main>
        </div>

        {/* <aside className="block lg:px-8 xl:left-20 fixed bottom-0 top-16 xl:w-96 overflow-y-auto border-r border-gray-200 px-4 py-6 border-r dark:border-slate-500/20 transition-all">
          <Search></Search>

          {loading || !navGroups ? (
            <div>Loading...</div>
          ) : (
            <Nav navGroups={navGroups} />
          )}
        </aside> */}
      </div>
    </>
  );
}

interface PageNavButton {
  activePageNav: PageNav;
  thisPageNav: PageNav;
  name: string;
  icon: React.JSX.Element;
  setPageNav: any;
}
function PageNavButton({
  activePageNav,
  thisPageNav,
  name,
  icon,
  setPageNav,
}: PageNavButton) {
  return (
    <div
      className={
        "flex flex-col h-16 shrink-0 items-center justify-center mx-1.5 mb-1 dark:text-white/80 rounded-lg hover:brightness-150 hover:backdrop-brightness-150 transition-all " +
        (activePageNav === thisPageNav ? "dark:bg-emerald-400/30" : "")
      }
      onClick={() => setPageNav(thisPageNav)}
    >
      {icon}
      <div className="text-xs uppercase pt-1">{name}</div>
    </div>
  );
}
