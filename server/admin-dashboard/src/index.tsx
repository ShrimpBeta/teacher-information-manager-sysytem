import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { persistor, store } from './app/store';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { SignIn } from './pages/signin/signin';
import { Users } from './pages/users/users';
import ErrorPage from './error-page';
import { PersistGate } from 'redux-persist/integration/react';
import apiClient, { setInterceptors } from './features/apiclient/apiclient';

const routes = [
  {
    path: '/',
    element: <Navigate to="/users" replace />,
    errorElement: <ErrorPage />
  },
  {
    path: 'signin',
    element: <SignIn />,
  },
  {
    path: 'users',
    element: <Users />,
  },
]

const router = createBrowserRouter(
  routes,
  {
    basename: '/client'
  },
);

// add token
setInterceptors(store, apiClient);

const container = document.getElementById('root')!;
const root = createRoot(container);

export const ApiClientContext = React.createContext(apiClient);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApiClientContext.Provider value={apiClient}>
          <RouterProvider router={router} />
        </ApiClientContext.Provider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
