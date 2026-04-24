import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === "403" && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(
          `http://localhost:3000/api/auth/refresh`,
          {},
          { withCredentials: true },
        );
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
