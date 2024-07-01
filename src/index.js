import { createRoot } from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import { Connect } from "@stacks/connect-react";
import { authOptions } from "./components/main/addons/stacks";
import "./utils/addons-initializer";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import initializePosthog from "./posthog";
import { BrowserRouter } from "react-router-dom";

initializePosthog();

const container = document.getElementById("app");
const root = createRoot(container);
let persistor = persistStore(store);

root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      {/* TODO: we need to investigate removing this connect wrapper 
            and finding a way to connect only via the addon manager
        */}
      <Connect authOptions={authOptions}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Connect>
    </PersistGate>
  </Provider>,
);
