import axios from "axios";
import { ENV } from "./env";
import { getTokenFromCookies } from "./cookies";

const serverAxiosInstance = axios.create({
  baseURL: ENV.backendBaseUrl,
  
});

serverAxiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getTokenFromCookies();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

serverAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Server-side error handling can be added here
    console.error("Server-side Axios error:", error.message);
    return Promise.reject(error);
  }
);

export default serverAxiosInstance;
