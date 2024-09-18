import { Header } from "./components/header/header";
import { NavGroup } from "./components/sidebar/nav";
import React, { ReactNode, useRef, useState } from "react";
import Runbook from "./components/main/runbook";
import { useAppDispatch, useAppSelector } from "./hooks";
import { selectRunbook } from "./reducers/runbooks-slice";
import useSubscriptions from "./hooks/useSubscriptions";
import { Modal } from "./components/main/modal";
import useQueries from "./hooks/useQueries";
import {
  isMultiPartyAuthenticated,
  isMultiPartyEnabled,
} from "./reducers/multi-party-slice";
import HankoAuth from "./components/auth/hanko";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { useParticipantAuth } from "./hooks/useParticipantAuth";
import Login from "./components/login";
import { ApolloProvider } from "@apollo/client";
import useOpenChannel from "./hooks/useOpenChannel";
import useApolloClient from "./hooks/useApolloClient";
import { SuspensePage } from "./components/pages/suspense";
import AddonsProvider from "./components/main/addons-provider";

const devMode = process.env.TXTX_DEV_MODE === "true";
const protocol = window.location.protocol;
const host = devMode ? "localhost:8488" : window.location.host;
const wsProtocol = protocol === "https:" ? "wss:" : "ws:";
export const BACKEND_URL = `${protocol}//${host}`;
export const BACKEND_WS_URL = `${wsProtocol}//${host}`;

enum PageNav {
  Runbook,
  Deploy,
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/c/:slug/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppInternal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/c/:slug"
        element={
          <ProtectedRoute>
            <AppInternal />
          </ProtectedRoute>
        }
      />
      <Route path="/c/:slug/*" element={<RedirectComponent />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

const RedirectComponent = () => {
  const { slug } = useParams();
  return <Navigate to={`/c/${slug}`} replace />;
};

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { tokenNeeded, token } = useParticipantAuth();
  const { slug } = useParams();
  if (tokenNeeded === undefined) {
    return <SuspensePage />;
  }
  if (tokenNeeded && !token) {
    const route = slug ? `/c/${slug}/login` : "/login";
    return <Navigate to={route} />;
  }
  const apolloClient = useApolloClient(tokenNeeded, token);
  if (apolloClient === undefined) {
    throw new Error("failed to initialize apollo client.");
  }
  return (
    <ApolloProvider client={apolloClient}>
      <AddonsProvider>{children}</AddonsProvider>
    </ApolloProvider>
  );
};

function AppInternal() {
  // todo: we should probably introduce a router to actually have this on a separate page
  const [pageNav, setPageNav] = useState<PageNav>(PageNav.Runbook);
  const [navGroups, setNavGroups] = useState<NavGroup[]>();
  const [protocolName, setProtocolName] = useState<string>("");
  const panelRefs = useRef<any[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { modalBlocks } = useAppSelector(selectRunbook);
  const multiPartyEnabled = useAppSelector(isMultiPartyEnabled);
  const multiPartyAuthenticated = useAppSelector(isMultiPartyAuthenticated);

  const { loading } = useQueries();
  // subscribe to new block events, action item updates, etc
  useSubscriptions();
  // open multiparty channel if it's enabled, authenticated, and hasn't been opened
  useOpenChannel();

  const panelScrollHandler = (index: any) => {
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
    <div className="bg-gradient-to-b from-gray-950 to-neutral-900 ">
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
      <div className="from-gray-950 to-neutral-900 ">
        <Header
          {...{ title: protocolName }}
          panelScrollHandler={panelScrollHandler}
          loading={loading}
        ></Header>
        <main
          className="min-h-screen pt-0 mt-0" //pl-16 when we reinsatate sidebar
          onClick={() => setModalVisible(!modalVisible)}
        >
          <div className="flex justify-center py-9">
            {loading ? undefined : multiPartyEnabled &&
              !multiPartyAuthenticated ? (
              <HankoAuth />
            ) : undefined}

            {loading
              ? undefined
              : modalBlocks.map((block, i) => (
                  <Modal block={block} index={i} key={block.uuid} />
                ))}

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
