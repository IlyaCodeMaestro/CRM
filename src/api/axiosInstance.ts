import axios from "axios";

const API_BASE_URL = "https://easydev.club/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const {accessToken} = JSON.parse(storedToken);
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
