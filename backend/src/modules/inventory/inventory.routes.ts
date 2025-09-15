import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { authRequired } from '../../lib/auth';
import { z } from 'zod';

export const inventoryRouter = Router();

inventoryRouter.get('/products', authRequired, async (req, res) => {
  const tenantId = (req as any).user.tenantId as string;
  const products = await prisma.product.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });
  res.json(products);
});

const productSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  price: z.coerce.number().min(0)
});

inventoryRouter.post('/products', authRequired, async (req, res) => {
  const tenantId = (req as any).user.tenantId as string;
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });
  const p = await prisma.product.create({ data: { ...parsed.data, tenantId } as any });
  res.json(p);
});

inventoryRouter.get('/warehouses', authRequired, async (_req, res) => {
  const warehouses = await prisma.warehouse.findMany();
  res.json(warehouses);
});

const warehouseSchema = z.object({
  name: z.string().min(1),
  location: z.string().optional().nullable()
});

inventoryRouter.post('/warehouses', authRequired, async (req, res) => {
  const tenantId = (req as any).user.tenantId as string;
  const parsed = warehouseSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });
  const w = await prisma.warehouse.create({ data: { ...parsed.data, tenantId } });
  res.json(w);
});