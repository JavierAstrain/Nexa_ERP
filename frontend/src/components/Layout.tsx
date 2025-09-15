import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/api';

const NavLink: React.FC<{to:string; label:string}> = ({to,label}) => {
  const loc = useLocation();
  const active = loc.pathname.startsWith(to);
  return <Link className={`block px-3 py-2 rounded-lg ${active? 'bg-nexa-700/40 text-white': 'text-slate-300 hover:text-white hover:bg-white/5'}`} to={to}>{label}</Link>;
};

const Layout: React.FC<{children: React.ReactNode}> = ({children}) => {
  const { setToken, modules } = useAuth();
  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr]">
      <aside className="p-4 border-r border-white/10 bg-slate-950/60">
        <div className="flex items-center gap-2 mb-6">
          <img src="/assets/Isotipo_Nexa.png" className="h-8 w-8 drop-shadow-[0_0_12px_rgba(46,153,255,0.7)]" />
          <span className="text-lg font-semibold">NEXA ERP</span>
        </div>
        <nav className="space-y-2">
          <NavLink to="/" label="Dashboard" />
          {modules.includes('crm') && <NavLink to="/crm/customers" label="Clientes" />}
          {modules.includes('inventory') && <NavLink to="/inventory/products" label="Productos" />}
          {modules.includes('accounting') && <NavLink to="/accounting/invoices" label="Facturas" />}
        </nav>
        <button className="btn mt-6 w-full" onClick={()=>setToken(null)}>Cerrar sesión</button>
      </aside>
      <main className="p-8">{children}</main>
    </div>
  )
}

export default Layout;