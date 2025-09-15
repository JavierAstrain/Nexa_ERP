import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAuthToken } from "../lib/api";

type ModuleInfo = { key: string; name: string } | string;

type AuthContextValue = {
  token: string | null;
  setToken: (t: string | null) => void;
  api: typeof api;
  modules: ModuleInfo[];
  refreshModules: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem("token"));
  const [modules, setModules] = useState<ModuleInfo[]>([]);

  useEffect(() => {
    setAuthToken(token);
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  const setToken = (t: string | null) => setTokenState(t);

  const refreshModules = async () => {
    try {
      const { data } = await api.get("/modules");
      // Acepta array de strings o de objetos {key,name}
      setModules(Array.isArray(data) ? data : []);
    } catch {
      setModules([]); // no rompas el render si falla
    }
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    // asume { token: string }
    setToken(data?.token ?? null);
    await refreshModules();
  };

  const logout = () => {
    setToken(null);
    setModules([]);
  };

  const value: AuthContextValue = useMemo(
    () => ({ token, setToken, api, modules, refreshModules, login, logout }),
    [token, modules]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
}
