import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios, { AxiosInstance } from "axios";

type AuthCtx = {
  token: string | null;
  setToken: (t: string | null) => void;
  api: AxiosInstance;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("nexa_token"));

  useEffect(() => {
    if (token) localStorage.setItem("nexa_token", token);
    else localStorage.removeItem("nexa_token");
  }, [token]);

  const api = useMemo<AxiosInstance>(() => {
    // Si VITE_API_URL no está definida, usa el mismo origen del servidor (Express sirve API + frontend)
    const baseURL = (import.meta as any).env?.VITE_API_URL || "";
    const instance = axios.create({ baseURL });
    instance.interceptors.request.use((config) => {
      if (token) {
        config.headers = config.headers ?? {};
        (config.headers as any)["Authorization"] = `Bearer ${token}`;
      }
      return config;
    });
    return instance;
  }, [token]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    setToken(data.token);
  };

  const logout = () => setToken(null);

  const value: AuthCtx = { token, setToken, api, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useApi = (): AxiosInstance => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useApi must be used within ApiProvider");
  return ctx.api;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within ApiProvider");
  return { token: ctx.token, setToken: ctx.setToken, login: ctx.login, logout: ctx.logout };
};
