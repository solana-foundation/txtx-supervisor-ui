import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Header } from "./header";
import { renderWithProviders } from "../../test/render";
import { setMetadata } from "../../reducers/runbooks-slice";
import { makeStore } from "../../store";

describe("Header", () => {
  it("renders loading state", () => {
    renderWithProviders(<Header loading={true} />);

    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("renders markdown metadata and opens the documentation modal", () => {
    const store = makeStore();

    store.dispatch(
      setMetadata({
        name: "Sample Runbook",
        description: "# Docs\n\nSome markdown details",
        uuid: "runbook-1",
        addonData: [],
      }),
    );

    const view = renderWithProviders(<Header loading={false} />, { store });

    expect(view.getByText("Sample Runbook")).toBeInTheDocument();

    fireEvent.click(
      view.getByRole("button", { name: /read documentation/i }),
    );

    expect(view.getByText("Runbook Documentation")).toBeInTheDocument();
    expect(view.getByText("Docs")).toBeInTheDocument();
    expect(view.getByText("Some markdown details")).toBeInTheDocument();
  });
});
