import { Link, NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-extrabold tracking-tight">NEXA ERP</Link>
          <nav className="flex gap-2">
            {[
              { to: "/dashboard", label: "Dashboard" },
              { to: "/customers", label: "Clientes" },
              { to: "/products", label: "Productos" },
              { to: "/invoices", label: "Facturas" },
            ].map((i) => (
              <NavLink
                key={i.to}
                to={i.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1 text-sm ${
                    isActive ? "bg-gray-200" : "hover:bg-gray-100"
                  }`
                }
              >
                {i.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
