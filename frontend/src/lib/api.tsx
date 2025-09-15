import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import axios, { AxiosInstance, AxiosRequestHeaders } from "axios";

type AuthCtx = {
  token: string | null;
  setToken: (t: string | null) => void;
  api: AxiosInstance;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  modules: string[];
  refreshModules: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("nexa_token"));
  const [modules, setModules] = useState<string[]>([]);

  useEffect(() => {
    if (token) localStorage.setItem("nexa_token", token);
    else localStorage.removeItem("nexa_token");
  }, [token]);

  const api = useMemo<AxiosInstance>(() => {
    const baseURL = (import.meta as any).env?.VITE_API_URL || "";
    const instance = axios.create({ baseURL });

    instance.interceptors.request.use((config) => {
      if (!config.headers) config.headers = {} as AxiosRequestHeaders;
      if (token) {
        (config.headers as any)["Authorization"] = `Bearer ${token}`;
      }
      return config;
    });

    return instance;
  }, [token]);

  const refreshModules = useCallback(async () => {
    try {
      const { data } = await api.get("/modules");
      // aceptar distintos formatos: [{moduleKey, enabled}], ["crm", ...] o {modules:[...]}
      const raw = Array.isArray(data) ? data : data?.modules ?? [];
      const keys = raw.map((m: any) =>
        typeof m === "string" ? m : m?.moduleKey ?? m?.key ?? ""
      ).filter(Boolean);
      setModules(keys);
    } catch {
      setModules([]);
    }
  }, [api]);

  useEffect(() => {
    if (token) refreshModules();
  }, [token, refreshModules]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    setToken(data.token);
    await refreshModules();
  };

  const logout = () => setToken(null);

  const value: AuthCtx = { token, setToken, api, login, logout, modules, refreshModules };
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
  const { token, setToken, login, logout, api, modules, refreshModules } = ctx;
  return { token, setToken, login, logout, api, modules, refreshModules };
};
