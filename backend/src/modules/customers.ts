import { Router } from "express";
import { prisma } from "../lib/prisma";

const r = Router();

// Listar clientes
r.get("/", async (_req, res) => {
  const customers = await prisma.customer.findMany({ orderBy: { id: "desc" } });
  res.json(customers);
});

// Crear cliente
r.post("/", async (req, res) => {
  const { name, email, phone } = req.body ?? {};
  if (!name) return res.status(400).json({ message: "name es requerido" });
  const c = await prisma.customer.create({ data: { name, email, phone } });
  res.status(201).json(c);
});

export default r;
