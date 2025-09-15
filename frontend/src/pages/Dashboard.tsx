import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Dashboard() {
  const [counts, setCounts] = useState({ customers: 0, products: 0, invoices: 0 });

  useEffect(() => {
    (async () => {
      const [c, p, i] = await Promise.all([
        api.get("/customers"),
        api.get("/products"),
        api.get("/invoices"),
      ]);
      setCounts({ customers: c.data.length, products: p.data.length, invoices: i.data.length });
    })().catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat title="Clientes" value={counts.customers} />
        <Stat title="Productos" value={counts.products} />
        <Stat title="Facturas" value={counts.invoices} />
      </div>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-3xl font-semibold">{value}</div>
    </div>
  );
}
