import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useHandleEscapeKey from "./useHandleEscapeKey";

function EscapeHarness({
  onEscape,
  enabled = true,
}: {
  onEscape: () => void;
  enabled?: boolean;
}) {
  useHandleEscapeKey(onEscape, [onEscape, enabled], enabled);
  return <div>escape harness</div>;
}

describe("useHandleEscapeKey", () => {
  it("fires the callback when escape is pressed and enabled", () => {
    const onEscape = vi.fn();

    render(<EscapeHarness onEscape={onEscape} enabled={true} />);
    fireEvent.keyDown(document, { key: "Escape" });

    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it("does not fire for other keys or when disabled", () => {
    const onEscape = vi.fn();

    const { rerender } = render(
      <EscapeHarness onEscape={onEscape} enabled={false} />,
    );

    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.keyDown(document, { key: "Enter" });
    expect(onEscape).not.toHaveBeenCalled();

    rerender(<EscapeHarness onEscape={onEscape} enabled={true} />);
    fireEvent.keyDown(document, { key: "Enter" });
    expect(onEscape).not.toHaveBeenCalled();
  });

  it("removes the listener on unmount", () => {
    const onEscape = vi.fn();

    const { unmount } = render(<EscapeHarness onEscape={onEscape} />);
    unmount();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onEscape).not.toHaveBeenCalled();
  });
});
