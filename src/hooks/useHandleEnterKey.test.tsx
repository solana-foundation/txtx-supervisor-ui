import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useHandleEnterKey from "./useHandleEnterKey";

function EnterHarness({
  onEnter,
  enabled = true,
}: {
  onEnter: () => void;
  enabled?: boolean;
}) {
  useHandleEnterKey(onEnter, [onEnter, enabled], enabled);
  return <div>enter harness</div>;
}

describe("useHandleEnterKey", () => {
  it("fires the callback when enter is pressed and enabled", () => {
    const onEnter = vi.fn();

    render(<EnterHarness onEnter={onEnter} enabled={true} />);
    fireEvent.keyDown(document, { key: "Enter" });

    expect(onEnter).toHaveBeenCalledTimes(1);
  });

  it("does not fire for other keys or when disabled", () => {
    const onEnter = vi.fn();

    const { rerender } = render(<EnterHarness onEnter={onEnter} enabled={false} />);

    fireEvent.keyDown(document, { key: "Enter" });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onEnter).not.toHaveBeenCalled();

    rerender(<EnterHarness onEnter={onEnter} enabled={true} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onEnter).not.toHaveBeenCalled();
  });

  it("removes the listener on unmount", () => {
    const onEnter = vi.fn();

    const { unmount } = render(<EnterHarness onEnter={onEnter} />);
    unmount();

    fireEvent.keyDown(document, { key: "Enter" });
    expect(onEnter).not.toHaveBeenCalled();
  });
});
