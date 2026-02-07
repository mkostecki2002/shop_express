import axios from "axios";

const API_URL = "http://localhost:3000/";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = sessionStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}refresh`, {
            refreshToken,
          });
          sessionStorage.setItem("accessToken", data.accessToken);
          api.defaults.headers.common["Authorization"] =
            `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch {
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);
