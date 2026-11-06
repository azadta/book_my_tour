import { combineReducers, configureStore } from "@reduxjs/toolkit";
import adminReducer from "./admin/adminSlice";
import chatReducer from "./chatSlice";
import notificationReducer from "./notificationSlice";
import operatorReducer from "./operator/operatorSlice";
import userReducer from "./user/userSlice";

import storageImport from "redux-persist/lib/storage";
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
const storage = (storageImport as any).default || storageImport;

import {
  FLUSH, PAUSE,
  PERSIST, persistReducer, persistStore, PURGE,
  REGISTER, REHYDRATE
} from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  blacklist: ["chat", "notifications"],
};

const rootReducer = combineReducers({
  user: userReducer,
  operator: operatorReducer,
  admin: adminReducer,

  chat: chatReducer,
  notification: notificationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
