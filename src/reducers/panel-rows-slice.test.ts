import { describe, expect, it } from "vitest";
import {
  addPanel,
  panelRowsSlice,
  selectPanelRowChecked,
  selectPanelRows,
  setPanelRows,
} from "./panel-rows-slice";

describe("panelRowsSlice", () => {
  it("adds a panel with unchecked rows", () => {
    const state = panelRowsSlice.reducer(
      undefined,
      addPanel({ panelId: "panel-1", rowCount: 3 }),
    );

    expect(state).toEqual({
      "panel-1": [false, false, false],
    });
  });

  it("does not overwrite an existing panel", () => {
    let state = panelRowsSlice.reducer(
      undefined,
      addPanel({ panelId: "panel-1", rowCount: 2 }),
    );

    state = panelRowsSlice.reducer(
      state,
      addPanel({ panelId: "panel-1", rowCount: 5 }),
    );

    expect(state["panel-1"]).toEqual([false, false]);
  });

  it("updates a single row and all rows", () => {
    let state = panelRowsSlice.reducer(
      undefined,
      addPanel({ panelId: "panel-1", rowCount: 3 }),
    );

    state = panelRowsSlice.reducer(
      state,
      setPanelRows({ panelId: "panel-1", rowIdx: 1, isChecked: true }),
    );
    expect(state["panel-1"]).toEqual([false, true, false]);

    state = panelRowsSlice.reducer(
      state,
      setPanelRows({ panelId: "panel-1", rowIdx: -1, isChecked: true }),
    );
    expect(state["panel-1"]).toEqual([true, true, true]);
  });

  it("leaves state unchanged when the panel does not exist", () => {
    const state = panelRowsSlice.reducer(
      undefined,
      setPanelRows({ panelId: "missing", rowIdx: 0, isChecked: true }),
    );

    expect(state).toEqual({});
  });

  it("selects panel rows and individual checked state", () => {
    const sliceState = {
      "panel-1": [false, true, false],
    };
    const rootState = { panelRows: sliceState };

    expect(selectPanelRows(rootState, "panel-1")).toEqual([false, true, false]);
    expect(selectPanelRowChecked(rootState, "panel-1", 1)).toBe(true);
    expect(selectPanelRowChecked(rootState, "panel-1", 0)).toBe(false);
    expect(selectPanelRowChecked(rootState, "missing", 0)).toBeUndefined();
  });
});
