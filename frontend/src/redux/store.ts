import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import operatorReducer from "./operator/operatorSlice";
import adminReducer from "./admin/adminSlice";
import packageReducer from "./package/packageSlice";
import chatReducer from "./chatSlice";
import notificationReducer from "./notificationSlice";

import storageImport from "redux-persist/lib/storage";
const storage = (storageImport as any).default || storageImport;

import { persistReducer, persistStore } from "redux-persist";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
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
  package: packageReducer,
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
