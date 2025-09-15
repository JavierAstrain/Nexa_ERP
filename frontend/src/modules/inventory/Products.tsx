import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

type Product = {
  id: string;
  name: string;
  price?: number;
};

export default function Products() {
  const { api } = useAuth();
  const [rows, setRows] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/products");
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
      <h1 className="text-xl font-semibold mb-4">Productos</h1>
      {loading && <div>Cargando…</div>}
      {!loading && rows.length === 0 && <div>No hay productos</div>}
      <ul className="space-y-2">
        {rows.map((p) => (
          <li key={p.id} className="p-3 rounded border">
            <div className="font-medium">{p.name}</div>
            <div className="text-sm text-gray-600">Precio: {p.price ?? 0}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
