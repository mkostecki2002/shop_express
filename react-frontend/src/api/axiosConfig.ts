import axios from "axios";

const API_URL = "http://localhost:3000/";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor do dodawania tokena
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Interceptor do obsługi 401 (Refresh Token)
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}refresh`, {
            refreshToken,
          });
          localStorage.setItem("accessToken", data.accessToken);
          api.defaults.headers.common["Authorization"] =
            `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Jeśli refresh się nie uda, wyloguj
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);
