import { Router } from "express";
import { prisma } from "../lib/prisma";

const r = Router();

// Listar productos
r.get("/", async (_req, res) => {
  const products = await prisma.product.findMany({ orderBy: { id: "desc" } });
  res.json(products);
});

// Crear producto
r.post("/", async (req, res) => {
  const { name, price } = req.body ?? {};
  if (!name) return res.status(400).json({ message: "name es requerido" });
  if (price == null || isNaN(Number(price))) {
    return res.status(400).json({ message: "price inválido" });
  }
  const p = await prisma.product.create({ data: { name, price: Number(price) } });
  res.status(201).json(p);
});

export default r;
