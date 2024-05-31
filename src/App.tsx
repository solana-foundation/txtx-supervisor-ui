import { Header } from "./components/header/header";
import { NavGroup } from "./components/sidebar/nav";
import React, { useEffect, useRef, useState } from "react";
import Runbook from "./components/main/runbook";
import { useQuery } from "@apollo/client";
import { GET_BLOCKS } from "./utils/queries";
import { Block } from "./components/main/types";
import { useAppDispatch } from "./hooks";
import { setBlocks } from "./reducers/runbooks-slice";
import useSubscriptions from "./hooks/useSubscriptions";

enum PageNav {
  Runbook,
  Deploy,
}
export default function App() {
  // todo: we should probably introduce a router to actually have this on a separate page
  const [pageNav, setPageNav] = useState<PageNav>(PageNav.Runbook);
  const [navGroups, setNavGroups] = useState<NavGroup[]>();
  const [protocolName, setProtocolName] = useState<string>("");
  const panelRefs = useRef<any[]>([]);
  const dispatch = useAppDispatch();

  // todo: this is probably a hacky way to do this, but it works for now
  // if an href is provided, scroll to it after a timeout, to give components
  // time to load
  useEffect(() => {
    setTimeout(() => {
      const hash = window.location.hash.replace("#", "");
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView();
      }
    }, 200);
  }, []);

  const [completed, setCompleted] = useState(true);

  const { loading } = useQuery(GET_BLOCKS, {
    onCompleted: (data) => {
      const blocks: Block<false>[] = data.blocks;
      dispatch(setBlocks(blocks));
    },
  });
  // subscribe to new block events, action item updates, etc
  useSubscriptions();

  const panelScrollHandler = (index) => {
    window.location.hash = panelRefs.current[index].current.id;
    // when we select a new panel, the panels resize some, which makes the
    // location of the ref change. set a timeout to give the css resizing a
    // head start, so this scroll into view has the correct position to scroll to
    setTimeout(() => {
      panelRefs.current[index].current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    }, 200);
  };

  return (
    <>
      <div className="bg-gradient-to-b from-gray-950 to-neutral-900">
        {/* Small sidebar */}
        {/*         
        <div className=" fixed inset-y-0 left-0 z-50 block w-20 overflow-y-auto border-r dark:border-slate-500/20 xl:pb-4 transition-all">
          <div className="flex h-20 shrink-0 items-center justify-center px-4 py-1">
             <Logo />
          </div>
          <PageNavButton
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
          />
        </div>
     */}

        {/* Header & main content */}
        <div className="from-gray-950 to-neutral-900">
          <Header
            {...{ title: protocolName }}
            panelScrollHandler={panelScrollHandler}
          ></Header>
          <main className="min-h-screen pt-0 mt-0 pl-16 ">
            <div className="flex justify-center py-9">
              {loading ? (
                <div>Loading...</div>
              ) : (
                <Runbook
                  panelScrollHandler={panelScrollHandler}
                  panelRefs={panelRefs}
                />
              )}
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
