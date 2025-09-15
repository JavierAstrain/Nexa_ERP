import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

type Ctx = {
  token: string | null;
  setToken: (t: string | null) => void;
  api: typeof axios;
  modules: string[];
  refreshModules: () => Promise<void>;
};

const ApiCtx = createContext<Ctx>(null as any);

export const ApiProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [modules, setModules] = useState<string[]>([]);

  const api = axios.create({ baseURL: API_URL });
  api.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const refreshModules = async () => {
    if (!token) return;
    const { data } = await api.get('/modules');
    setModules(data.filter((m: any) => m.enabled).map((m: any) => m.moduleKey));
  };

  useEffect(() => { if (token) { localStorage.setItem('token', token); refreshModules(); } else { localStorage.removeItem('token'); }}, [token]);

  return <ApiCtx.Provider value={{ token, setToken, api, modules, refreshModules }}>{children}</ApiCtx.Provider>
};

export const useAuth = () => useContext(ApiCtx);