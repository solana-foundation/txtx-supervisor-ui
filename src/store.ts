import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore, combineSlices, createSlice } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import loggerMiddleware from "./middleware/logger";
import { manualsSlice } from "./reducers/manualsSlice";

const numberSlice = createSlice({
  name: "number",
  initialState: 0,
  reducers: {},
});
export const rootReducer = combineSlices(manualsSlice, numberSlice);

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(loggerMiddleware);
    },
    enhancers: (getDefaultEnhancers) => getDefaultEnhancers(),
    preloadedState,
  });
  setupListeners(store.dispatch);
  return store;
};

export const store = makeStore();
export type AppStore = typeof store;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
