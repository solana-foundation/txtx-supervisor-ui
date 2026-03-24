import { describe, expect, it } from "vitest";
import {
  errorSlice,
  pushError,
  removeFirstError,
  selectErrors,
  selectFirstError,
} from "./error-slice";

describe("errorSlice", () => {
  it("pushes and removes errors in queue order", () => {
    let state = errorSlice.reducer(undefined, pushError("first"));
    state = errorSlice.reducer(state, pushError("second"));
    const rootState = { errors: state };

    expect(state).toEqual(["first", "second"]);
    expect(selectErrors(rootState)).toEqual(["first", "second"]);
    expect(selectFirstError(rootState)).toBe("first");

    state = errorSlice.reducer(state, removeFirstError());
    const updatedRootState = { errors: state };

    expect(state).toEqual(["second"]);
    expect(selectFirstError(updatedRootState)).toBe("second");
  });

  it("returns undefined when the queue is empty", () => {
    const state = errorSlice.reducer(undefined, { type: "unknown" });
    const rootState = { errors: state };

    expect(selectFirstError(rootState)).toBeUndefined();
  });
});
