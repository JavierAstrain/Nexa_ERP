import { Router } from "express";
import { prisma } from "../lib/prisma";

const r = Router();

// Listar facturas (con relaciones)
r.get("/", async (_req, res) => {
  const invoices = await prisma.invoice.findMany({
    orderBy: { id: "desc" },
    include: { customer: true, items: { include: { product: true } } },
  });
  res.json(invoices);
});

// Crear factura: { customerId, items: [{ productId, quantity, price }] }
r.post("/", async (req, res) => {
  const { customerId, items } = req.body ?? {};
  if (!customerId) return res.status(400).json({ message: "customerId requerido" });
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "items vacío" });
  }

  const total = items.reduce(
    (acc: number, it: any) => acc + Number(it.quantity) * Number(it.price),
    0
  );

  const invoice = await prisma.invoice.create({
    data: {
      number: `INV-${Date.now()}`,
      customerId,
      total,
      items: {
        create: items.map((it: any) => ({
          productId: it.productId,
          quantity: Number(it.quantity),
          price: Number(it.price),
        })),
      },
    },
    include: { items: true },
  });

  res.status(201).json(invoice);
});

export default r;
