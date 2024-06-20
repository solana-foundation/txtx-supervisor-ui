import { createRoot } from "react-dom/client";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  split,
} from "@apollo/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import { Connect } from "@stacks/connect-react";
import { authOptions } from "./components/main/addons/stacks";
import "./utils/addons-initializer";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import initializePosthog from "./posthog";

initializePosthog();

const devMode = process.env.TXTX_DEV_MODE === "true";
const protocol = window.location.protocol;
const host = devMode ? "localhost:8488" : window.location.host;
const wsProtocol = protocol === "https:" ? "wss:" : "ws:";
export const BACKEND_URL = `${protocol}//${host}`;

const httpLink = new HttpLink({
  uri: `${BACKEND_URL}/graphql`,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `${wsProtocol}//${host}/subscriptions`,
  }),
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink,
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

const container = document.getElementById("app");
const root = createRoot(container);
let persistor = persistStore(store);

root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <ApolloProvider client={apolloClient}>
        {/* TODO: we need to investigate removing this connect wrapper 
            and finding a way to connect only via the addon manager
        */}
        <Connect authOptions={authOptions}>
          <App />
        </Connect>
      </ApolloProvider>
    </PersistGate>
  </Provider>,
);
