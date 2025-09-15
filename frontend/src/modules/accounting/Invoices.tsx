import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

type Invoice = {
  id: string;
  number: string;
  total?: number;
};

export default function Invoices() {
  const { api } = useAuth();
  const [rows, setRows] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        // ajusta el endpoint si tu API usa otro prefijo
        const { data } = await api.get("/invoices");
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
      <h1 className="text-xl font-semibold mb-4">Facturas</h1>
      {loading && <div>Cargando…</div>}
      {!loading && rows.length === 0 && <div>No hay facturas</div>}
      <ul className="space-y-2">
        {rows.map((f) => (
          <li key={f.id} className="p-3 rounded border">
            <div className="font-medium">#{f.number}</div>
            <div className="text-sm text-gray-600">Total: {f.total ?? 0}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
