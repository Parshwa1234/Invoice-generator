import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Adjust if your backend port is different
});

export const setupAxiosInterceptors = (getToken) => {
  api.interceptors.request.use(
    async (config) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error fetching Clerk token:", error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export default api;
