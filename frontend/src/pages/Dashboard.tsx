import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { token, modules, refreshModules } = useAuth();

  useEffect(() => {
    if (token) void refreshModules();
  }, [token, refreshModules]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <div className="mb-4 text-sm text-gray-700">
        Estado de sesión: <b>{token ? "Activa" : "Invitado"}</b>
      </div>
      <div className="mb-2 font-medium">Módulos disponibles:</div>
      <ul className="list-disc list-inside">
        {(modules ?? []).map((m: any, i: number) => (
          <li key={i}>{typeof m === "string" ? m : m?.name ?? m?.key}</li>
        ))}
      </ul>
    </div>
  );
}
