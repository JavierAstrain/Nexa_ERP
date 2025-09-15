import React, { useEffect, useState } from "react";
import { useApi } from "../../lib/api";

type Customer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
};

export default function Customers() {
  const api = useApi();
  const [rows, setRows] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/crm/customers");
        const list: Customer[] = Array.isArray(data?.items)
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

  if (loading) return <div style={{ padding: 24 }}>Cargando clientes…</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 12 }}>Clientes</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>Nombre</th>
            <th style={th}>Email</th>
            <th style={th}>Teléfono</th>
            <th style={th}>Empresa</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id}>
              <td style={td}>{c.name}</td>
              <td style={td}>{c.email ?? "-"}</td>
              <td style={td}>{c.phone ?? "-"}</td>
              <td style={td}>{c.company ?? "-"}</td>
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
