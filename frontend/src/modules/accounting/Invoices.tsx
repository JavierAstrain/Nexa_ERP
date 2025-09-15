import React, { useEffect, useState } from "react";
import { useApi } from "../../lib/api";

type InvoiceItem = {
  id: string;
  productId?: string;
  description?: string;
  quantity: number;
  price: number;
  total?: number;
};

type Invoice = {
  id: string;
  number: string;
  customerId?: string;
  status?: string;
  total: number;
  items?: InvoiceItem[];
  createdAt?: string;
};

export default function Invoices() {
  const api = useApi();
  const [rows, setRows] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/accounting/invoices");
        const list: Invoice[] = Array.isArray(data?.items)
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

  if (loading) return <div style={{ padding: 24 }}>Cargando facturas…</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 12 }}>Facturas</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>Nro</th>
            <th style={th}>Estado</th>
            <th style={{ ...th, textAlign: "right" }}>Total</th>
            <th style={th}>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((inv) => (
            <tr key={inv.id}>
              <td style={td}>{inv.number}</td>
              <td style={td}>{inv.status ?? "-"}</td>
              <td style={{ ...td, textAlign: "right" }}>
                {typeof inv.total === "number" ? inv.total.toFixed(2) : inv.total}
              </td>
              <td style={td}>
                {inv.createdAt ? new Date(inv.createdAt).toLocaleString() : "-"}
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
  padding: 8,
};

const td: React.CSSProperties = {
  borderBottom: "1px solid #f3f3f3",
  padding: 8,
};
