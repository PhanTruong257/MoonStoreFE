import axios from "axios";

import { env } from "@/app/config/env";

export const http = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
});

const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/me"];

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url: string = error.config?.url ?? "";
      const isAuthEndpoint = AUTH_ENDPOINTS.some((ep) => url.includes(ep));
      if (!isAuthEndpoint) {
        localStorage.removeItem("auth_user");
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  },
);
