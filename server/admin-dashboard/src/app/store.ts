import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, REGISTER, PURGE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authSlice } from '../features/auth/authSlice';

const rootReducer = combineReducers({
  auth: authSlice.reducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: [authSlice.name],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof rootReducer>;