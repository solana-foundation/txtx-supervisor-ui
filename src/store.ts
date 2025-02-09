import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
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
  createTransform,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { runbookStepSlice } from "./reducers/runbook-step-slice";
import { panelRowsSlice } from "./reducers/panel-rows-slice";
import { MultiPartyMode, multiPartySlice } from "./reducers/multi-party-slice";
import { errorSlice } from "./reducers/error-slice";
import { participantAuthSlice } from "./reducers/participant-auth-slice";

const configureReducer = () => {
  // we want some reducers persisted at a slug-specific level
  const path = window.location.pathname;
  const match = path.match(/^\/c\/([^/]+)/);
  const slug = match ? match[1] : "default";
  const slugPersistConfig = {
    key: `${slug}`,
    storage,
  };

  const multiPartyModeTransform: any = createTransform(
    // Transform state on its way to being serialized and persisted.
    (inboundState: MultiPartyMode, key) => {
      const { auth } = inboundState;
      return { auth };
    },
    // Transform state being rehydrated.
    (outboundState: any, key) => {
      return outboundState as any;
    },
    // Define which slice this transform gets applied to.
    { whitelist: ["multiPartyMode"] },
  );

  const generalPersistConfig = {
    key: "runbooks",
    storage,
    whitelist: ["multiPartyMode"],
    transforms: [multiPartyModeTransform],
  };

  const rootReducer = combineReducers({
    runbooks: runbooksSlice.reducer,
    activeStep: runbookStepSlice.reducer,
    panelRows: panelRowsSlice.reducer,
    multiPartyMode: multiPartySlice.reducer,
    errors: errorSlice.reducer,
    participantAuth: persistReducer(
      slugPersistConfig,
      participantAuthSlice.reducer,
    ),
  });

  const persistedReducer = persistReducer(generalPersistConfig, rootReducer);

  return persistedReducer;
};

const persistedReducer = configureReducer();
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
