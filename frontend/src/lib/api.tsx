import axios from "axios";

const API_BASE =
  (import.meta as any)?.env?.VITE_API_URL?.toString() ||
  // por defecto, mismo host bajo /api
  "/api";

export const api = axios.create({
  baseURL: API_BASE,
});

// setea/limpia el header Authorization globalmente
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}
