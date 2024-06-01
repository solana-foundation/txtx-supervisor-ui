import type { PayloadAction } from "@reduxjs/toolkit";
import { createSelector, createSlice } from "@reduxjs/toolkit";

export interface PanelRows {
  [panelId: string]: boolean[];
}
const initialState: PanelRows = {};

const getPanelById = (state: PanelRows, panelId: string) => state[panelId];
const getRowCheckedFromPanel = (
  state: PanelRows,
  panelId: string,
  rowIndex: number,
) => {
  const panelRows = state[panelId];
  if (!panelRows) {
    return undefined;
  }
  return panelRows[rowIndex];
};

export const panelRowsSlice = createSlice({
  name: "panelRows",
  initialState,
  reducers: (create) => ({
    addPanel: create.reducer(
      (state, action: PayloadAction<{ panelId: string; rowCount: number }>) => {
        const { panelId, rowCount } = action.payload;
        if (!state[panelId]) {
          state[panelId] = new Array(rowCount).fill(false);
        }
        return state;
      },
    ),
    setPanelRows: create.reducer(
      (
        state,
        action: PayloadAction<{
          panelId: string;
          rowIdx: number;
          isChecked: boolean;
        }>,
      ) => {
        const { panelId, rowIdx, isChecked } = action.payload;
        const panelRows = state[panelId];
        if (panelRows) {
          const nextState = panelRows.map((current, i) => {
            if (rowIdx === -1) {
              return isChecked;
            } else if (i === rowIdx) {
              return isChecked;
            } else return current;
          });
          state[panelId] = nextState;
        }
        return state;
      },
    ),
  }),
  selectors: {
    selectPanelRows: getPanelById,
    selectPanelRowChecked: getRowCheckedFromPanel,
  },
});

export const { addPanel, setPanelRows } = panelRowsSlice.actions;

export const { selectPanelRows, selectPanelRowChecked } =
  panelRowsSlice.selectors;
