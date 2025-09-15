import { useEffect, useState } from "react";
import { api } from "../../lib/api";

type Product = { id: string; name: string; price: number };

export default function Products() {
  const [rows, setRows] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", price: "" });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await api.get<Product[]>("/products");
    setRows(data);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/products", { name: form.name, price: Number(form.price) });
      setForm({ name: "", price: "" });
      await load();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Nuevo producto</h2>
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
            placeholder="Precio *"
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            required
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
        <h2 className="mb-4 text-lg font-semibold">Productos</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="border-b p-2">Nombre</th>
                <th className="border-b p-2">Precio</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="border-b p-2">{p.name}</td>
                  <td className="border-b p-2">${Number(p.price).toFixed(2)}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={2} className="p-4 text-center text-gray-500">
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
