import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";

type Customer = { id: string; name: string };
type Product = { id: string; name: string; price: number };
type ItemDraft = { productId: string; quantity: number; price: number };

export default function Invoices() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState<ItemDraft[]>([{ productId: "", quantity: 1, price: 0 }]);
  const [loading, setLoading] = useState(false);

  const total = useMemo(
    () => items.reduce((acc, it) => acc + (Number(it.quantity) || 0) * (Number(it.price) || 0), 0),
    [items]
  );

  const load = async () => {
    const [c, p, i] = await Promise.all([
      api.get<Customer[]>("/customers"),
      api.get<Product[]>("/products"),
      api.get("/invoices"),
    ]);
    setCustomers(c.data);
    setProducts(p.data);
    setInvoices(i.data);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  useEffect(() => {
    // cuando cambio producto, precargar precio
    setItems((draft) =>
      draft.map((it) => {
        const prod = products.find((p) => p.id === it.productId);
        return prod ? { ...it, price: it.price || Number(prod.price) } : it;
      })
    );
  }, [products]);

  const addRow = () => setItems((rows) => [...rows, { productId: "", quantity: 1, price: 0 }]);
  const delRow = (idx: number) => setItems((rows) => rows.filter((_, i) => i !== idx));

  const saveInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return alert("Selecciona un cliente");
    const valid = items.filter((x) => x.productId && x.quantity > 0 && x.price >= 0);
    if (valid.length === 0) return alert("Agrega al menos un item");

    setLoading(true);
    try {
      await api.post("/invoices", { customerId, items: valid });
      setCustomerId("");
      setItems([{ productId: "", quantity: 1, price: 0 }]);
      await load();
      alert("Factura creada");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Nueva factura</h2>
        <form onSubmit={saveInvoice} className="grid gap-4">
          <select
            className="rounded-md border px-3 py-2"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            <option value="">Seleccionar cliente...</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="grid gap-2">
            {items.map((it, idx) => (
              <div key={idx} className="grid grid-cols-12 items-center gap-2">
                <select
                  className="col-span-6 rounded-md border px-3 py-2"
                  value={it.productId}
                  onChange={(e) =>
                    setItems((rows) =>
                      rows.map((r, i) =>
                        i === idx
                          ? {
                              ...r,
                              productId: e.target.value,
                              price:
                                products.find((p) => p.id === e.target.value)?.price ?? r.price,
                            }
                          : r
                      )
                    )
                  }
                >
                  <option value="">Producto...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  className="col-span-2 rounded-md border px-3 py-2"
                  placeholder="Cant."
                  value={it.quantity}
                  min={1}
                  onChange={(e) =>
                    setItems((rows) =>
                      rows.map((r, i) => (i === idx ? { ...r, quantity: Number(e.target.value) } : r))
                    )
                  }
                />

                <input
                  type="number"
                  step="0.01"
                  className="col-span-3 rounded-md border px-3 py-2"
                  placeholder="Precio"
                  value={it.price}
                  onChange={(e) =>
                    setItems((rows) =>
                      rows.map((r, i) => (i === idx ? { ...r, price: Number(e.target.value) } : r))
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() => delRow(idx)}
                  className="col-span-1 rounded-md border px-3 py-2 hover:bg-gray-50"
                  title="Eliminar"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addRow}
              className="w-fit rounded-md border px-3 py-2 hover:bg-gray-50"
            >
              + Agregar ítem
            </button>
          </div>

          <div className="text-right text-lg font-semibold">Total: ${total.toFixed(2)}</div>

          <button
            disabled={loading}
            className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Creando..." : "Crear factura"}
          </button>
        </form>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Facturas</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="border-b p-2">Número</th>
                <th className="border-b p-2">Cliente</th>
                <th className="border-b p-2">Items</th>
                <th className="border-b p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="border-b p-2">{inv.number}</td>
                  <td className="border-b p-2">{inv.customer?.name ?? "-"}</td>
                  <td className="border-b p-2">{inv.items?.length ?? 0}</td>
                  <td className="border-b p-2">${Number(inv.total).toFixed(2)}</td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
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
