// utils/apiClient.js
import axios from 'axios';
import { getSession } from 'next-auth/react';

export async function getAPIClient(ctx = null) {
  let token;

  if (ctx) {
    const session = await getSession(ctx);
    token = session?.accessToken;
  } else {
    const session = await getSession();
    token = session?.accessToken;
  }

  const api = axios.create({
    baseURL: 'http://localhost:8000/backend/v1/',
  });

  if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  api.interceptors.request.use(config => {
    return config;
  });

  api.interceptors.response.use(
    response => {
      return response;
    },
    async (error) => {
      if (error.response?.status === 401 && error.config && !error.config.__isRetryRequest) {
        error.config.__isRetryRequest = true;
        
        try {
          const session = await getSession(ctx);
          const refreshToken = session?.refreshToken;

          const response = await axios.post('http://localhost:8000/backend/v1/token/refresh/', { token: refreshToken });
          const { token: newToken } = response.data;

          api.defaults.headers['Authorization'] = `Bearer ${newToken}`;
          return api(error.config);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
}
