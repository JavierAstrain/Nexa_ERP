import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

type Customer = {
  id: string;
  name: string;
  email?: string;
};

export default function Customers() {
  const { api } = useAuth();
  const [rows, setRows] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/customers");
        if (mounted) setRows(Array.isArray(data) ? data : []);
      } catch {
        if (mounted) setRows([]);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [api]);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Clientes</h1>
      {loading && <div>Cargando…</div>}
      {!loading && rows.length === 0 && <div>No hay clientes</div>}
      <ul className="space-y-2">
        {rows.map((c) => (
          <li key={c.id} className="p-3 rounded border">
            <div className="font-medium">{c.name}</div>
            <div className="text-sm text-gray-600">{c.email ?? "—"}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
