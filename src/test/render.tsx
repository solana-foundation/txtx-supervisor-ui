import React, { PropsWithChildren } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "../store";

interface ExtendedRenderOptions extends Omit<RenderOptions, "wrapper"> {
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  { store = makeStore(), ...renderOptions }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
