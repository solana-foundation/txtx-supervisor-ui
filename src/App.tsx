import { Header } from "./components/header/header";
import React, { useState } from "react";
import Runbook from "./components/main/runbook";
import { useAppSelector } from "./hooks";
import { selectRunbook } from "./reducers/runbooks-slice";
import useSubscriptions from "./hooks/useSubscriptions";
import { Modal } from "./components/main/modal";
import useQueries from "./hooks/useQueries";
import { ApolloProvider } from "@apollo/client/react";
import useApolloClient from "./hooks/useApolloClient";
import AddonsProvider from "./components/main/addons-provider";
import ErrorModal from "./components/popup/error-popup";

const devMode = process.env.TXTX_DEV_MODE === "true";
const protocol = window.location.protocol;
const host = devMode ? "localhost:8488" : window.location.host;
const wsProtocol = protocol === "https:" ? "wss:" : "ws:";
export const BACKEND_URL = `${protocol}//${host}`;
export const BACKEND_WS_URL = `${wsProtocol}//${host}`;
export const ID_SERVICE_URL =
  process.env.ID_SERVICE_URL || "http://localhost:1235";

export default function App() {
  const apolloClient = useApolloClient();
  return (
    <ApolloProvider client={apolloClient}>
      <AddonsProvider>
        <AppInternal />
      </AddonsProvider>
    </ApolloProvider>
  );
}

function AppInternal() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { modalBlocks } = useAppSelector(selectRunbook);

  const { loading } = useQueries();
  // subscribe to new block events, action item updates, etc
  useSubscriptions();

  return (
    <div className="bg-gradient-to-b from-gray-950 to-neutral-900 ">
      {/* Header & main content */}
      <div className="from-gray-950 to-neutral-900 ">
        <Header loading={loading}></Header>
        <main
          className="min-h-screen pt-0 mt-0" //pl-16 when we reinsatate sidebar
          onClick={() => setModalVisible(!modalVisible)}
        >
          <div className="flex justify-center py-9">
            {loading
              ? undefined
              : modalBlocks.map((block, i) => (
                  <Modal block={block} index={i} key={block.uuid} />
                ))}

            {loading ? <div>Loading...</div> : <Runbook />}
          </div>
        </main>
      </div>

      <ErrorModal />
    </div>
  );
}
