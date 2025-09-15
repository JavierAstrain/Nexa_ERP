import React from 'react';
import { useAuth } from '../lib/api';
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  const { logout, modules } = useAuth();
  return (
    <div>
      <nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #eee' }}>
        <Link to="/">Dashboard</Link>
        {modules.includes('crm') && <Link to="/customers">Clientes</Link>}
        {modules.includes('inventory') && <Link to="/products">Productos</Link>}
        {modules.includes('accounting') && <Link to="/invoices">Facturación</Link>}
        <button onClick={logout} style={{ marginLeft: 'auto' }}>Salir</button>
      </nav>
      <Outlet />
    </div>
  );
}
