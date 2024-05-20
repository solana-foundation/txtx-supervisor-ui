import { createRoot } from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import { Connect } from "@stacks/connect-react";
import { authOptions } from "./components/main/stacks/stacks";
import "./utils/addons-initializer";
import posthog from "posthog-js";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

posthog.init("phc_mTZO0r156hfsV6JBDN3YGg727kYHXc675NABuHGh6fg", {
  api_host: "https://us.i.posthog.com",
});

export const apolloClient = new ApolloClient({
  uri: "http://localhost:8488/graphql",
  cache: new InMemoryCache(),
});

const container = document.getElementById("app");
const root = createRoot(container);
let persistor = persistStore(store);

root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <ApolloProvider client={apolloClient}>
        <Connect authOptions={authOptions}>
          <App />
        </Connect>
      </ApolloProvider>
    </PersistGate>
  </Provider>,
);
