import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const loc = useLocation();
  const active = loc.pathname === to;
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded ${active ? "bg-gray-200" : "hover:bg-gray-100"}`}
    >
      {children}
    </Link>
  );
};

const Layout: React.FC = () => {
  const { token, modules, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-bold">NEXA ERP</Link>
            <nav className="flex gap-2">
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/crm/customers">Clientes</NavLink>
              <NavLink to="/inventory/products">Productos</NavLink>
              <NavLink to="/accounting/invoices">Facturas</NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {token ? "Sesión activa" : "Invitado"}
            </span>
            {token && (
              <button onClick={logout} className="text-sm underline">
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Muestra módulos detectados (si hay) para verificar que el context funciona */}
      {modules && modules.length > 0 && (
        <div className="max-w-6xl mx-auto p-3 text-xs text-gray-600">
          Módulos:{" "}
          {modules
            .map((m: any) => (typeof m === "string" ? m : m?.name ?? m?.key))
            .filter(Boolean)
            .join(", ")}
        </div>
      )}

      <main className="flex-1 max-w-6xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
