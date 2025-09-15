// frontend/src/lib/api.ts
import axios, { AxiosError } from "axios";

/**
 * Instancia de Axios para toda la app.
 * Puedes sobreescribir la base con VITE_API_BASE_URL si quieres apuntar a otra API.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
});

/** --- Helpers de autenticación --- */
const TOKEN_KEY = "nexa_token";

export function setAuthToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore storage errors (SSR / private mode)
  }
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export function clearAuthToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
  delete api.defaults.headers.common["Authorization"];
}

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/** Inicializa el header Authorization desde storage si ya había sesión */
const saved = getAuthToken();
if (saved) {
  api.defaults.headers.common["Authorization"] = `Bearer ${saved}`;
}

/** Interceptor para limpiar token si la API responde 401 */
api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      clearAuthToken();
    }
    return Promise.reject(err);
  }
);
