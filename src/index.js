import { createRoot } from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import { Connect } from "@stacks/connect-react";
import { authOptions } from "./components/main/stacks/sign-transaction";
import "./utils/addons-initializer";

export const apolloClient = new ApolloClient({
  uri: "http://localhost:8488/graphql",
  cache: new InMemoryCache(),
});

const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <ApolloProvider client={apolloClient}>
      <Connect authOptions={authOptions}>
        <App />
      </Connect>
    </ApolloProvider>
  </Provider>,
);
