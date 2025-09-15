import React, { useEffect, useState } from "react";
import { useApi } from "../../lib/api";

type Product = {
  id: string;
  sku?: string;
  name: string;
  price?: number;
  stock?: number;
};

export default function Products() {
  const api = useApi();
  const [rows, setRows] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/inventory/products");
        const list: Product[] = Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data)
          ? data
          : [];
        setRows(list);
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [api]);

  if (loading) return <div style={{ padding: 24 }}>Cargando productos…</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 12 }}>Productos</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>SKU</th>
            <th style={th}>Nombre</th>
            <th style={{ ...th, textAlign: "right" }}>Precio</th>
            <th style={{ ...th, textAlign: "right" }}>Stock</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id}>
              <td style={td}>{p.sku ?? "-"}</td>
              <td style={td}>{p.name}</td>
              <td style={{ ...td, textAlign: "right" }}>
                {typeof p.price === "number" ? p.price.toFixed(2) : p.price ?? "-"}
              </td>
              <td style={{ ...td, textAlign: "right" }}>
                {typeof p.stock === "number" ? p.stock : "-"}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td style={td} colSpan={4}>
                Sin registros
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  fontWeight: 600,
  borderBottom: "1px solid #eee",
  padding: 8
};

const td: React.CSSProperties = {
  borderBottom: "1px solid #f3f3f3",
  padding: 8
};
