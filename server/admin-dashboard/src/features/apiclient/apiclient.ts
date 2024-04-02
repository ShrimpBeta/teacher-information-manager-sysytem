import axios, { AxiosInstance, AxiosError } from 'axios';
import { Store } from '@reduxjs/toolkit';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/restful/',
  // baseURL: '/restful/',
});


export function setInterceptors(store: Store, apiClient: AxiosInstance) {
  apiClient.interceptors.request.use((config: any) => {
    let state = store.getState();
    let token = state.auth.token;
    if (token) {
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`
        }
      }
    }
    return config;
  }, (error: AxiosError) => {
    return Promise.reject(error);
  });
}

export default apiClient;