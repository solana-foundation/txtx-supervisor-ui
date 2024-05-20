import type { Action, ThunkAction } from "@reduxjs/toolkit";
import {
  configureStore,
  combineSlices,
  createSlice,
  combineReducers,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import loggerMiddleware from "./middleware/logger";
import { runbooksSlice } from "./reducers/runbooks-slice";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { runbookStepSlice } from "./reducers/runbook-step-slice";
import { runbookPanelRefsSlice } from "./reducers/runbook-panel-refs-slice";

const persistConfig = {
  key: "runbooks",
  storage,
  whitelist: ["activeStep"],
};

const reducers = combineReducers({
  runbooks: runbooksSlice.reducer,
  activeStep: runbookStepSlice.reducer,
  panelRefs: runbookPanelRefsSlice.reducer,
});
const persistedReducer = persistReducer(persistConfig, reducers);

export type RootState = ReturnType<typeof persistedReducer>;

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(loggerMiddleware),
    enhancers: (getDefaultEnhancers) => getDefaultEnhancers(),
    // preloadedState,
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
