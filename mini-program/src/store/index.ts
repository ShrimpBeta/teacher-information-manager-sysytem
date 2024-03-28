import { configureStore } from "@reduxjs/toolkit";
import { persistStore, PersistConfig, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import taroStorage from "./taro-storage";

import rootReducer from "./slices/reducers";
import { userSlice } from "./slices/userSlice";

const persistConfig = {
  key: 'app',
  version: 1,
  storage: taroStorage,
  whitelist: [userSlice.name],
  blacklist: [''],
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  }),
})

export const persistor = persistStore(store);


