import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div style={{ fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif" }}>
      <header style={{ padding: 16, borderBottom: "1px solid #eee", display: "flex", gap: 12 }}>
        <strong>NEXA ERP</strong>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/crm/customers">Clientes</Link>
          <Link to="/inventory/products">Productos</Link>
          <Link to="/accounting/invoices">Facturas</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
