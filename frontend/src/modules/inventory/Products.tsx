import React, { useEffect, useState } from "react";
import { useApi } from "../../lib/api";

type Product = {
  id: string;
  name: string;
  price: number;
  stock?: number;
};

export default function Products() {
  const api = useApi();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/inventory/products");
        // admitir distintos formatos de respuesta
        const list: Product[] = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
        setItems(list);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [api]);

  if (loading) return <div style={{ padding: 24 }}>Cargando productos…</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Productos</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Nombre</th>
            <th style={{ textAlign: "right", borderBottom: "1px solid #eee", padding: 8 }}>Precio</th>
            <th style={{ textAlign: "right", borderBottom: "1px solid #eee", padding: 8 }}>Stock</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id}>
              <td style={{ padding: 8 }}>{p.name}</td>
              <td style={{ padding: 8, textAlign: "right" }}>
                {typeof p.price === "number" ? p.price.toFixed(2) : p.price}
              </td>
              <td style={{ padding: 8, textAlign: "right" }}>{p.stock ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
