import { useEffect, useState } from "react";
import { api } from "../../lib/api";

type Customer = { id: string; name: string; email?: string | null; phone?: string | null };

export default function Customers() {
  const [rows, setRows] = useState<Customer[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await api.get<Customer[]>("/customers");
    setRows(data);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/customers", form);
      setForm({ name: "", email: "", phone: "" });
      await load();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Nuevo cliente</h2>
        <form onSubmit={submit} className="grid gap-3">
          <input
            className="rounded-md border px-3 py-2"
            placeholder="Nombre *"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <input
            className="rounded-md border px-3 py-2"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <input
            className="rounded-md border px-3 py-2"
            placeholder="Teléfono"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
          <button
            disabled={loading}
            className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Clientes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="border-b p-2">Nombre</th>
                <th className="border-b p-2">Email</th>
                <th className="border-b p-2">Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="border-b p-2">{c.name}</td>
                  <td className="border-b p-2">{c.email ?? "-"}</td>
                  <td className="border-b p-2">{c.phone ?? "-"}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    Sin datos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
