import axios from 'axios';
import { getToken, removeToken } from '../utils/token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach the token to every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AUTH_PATHS = ['/auth/login', '/auth/register'];

// If the server says the token is invalid, clear it and go to the login page
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = AUTH_PATHS.includes(error.config?.url);

    if (error.response?.status === 401 && !isAuthRequest) {
      removeToken();
      const onAuthPage = ['/login', '/register'].includes(window.location.pathname);
      if (!onAuthPage) {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;