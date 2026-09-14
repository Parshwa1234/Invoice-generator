import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

let tokenGetter = null;

export const setupAxiosInterceptors = (getToken) => {
  tokenGetter = getToken;
};

// Register request interceptor once
api.interceptors.request.use(
  async (config) => {
    if (tokenGetter) {
      try {
        const token = await tokenGetter();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error fetching Clerk token:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
