import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { authRequired } from '../../lib/auth';
import { z } from 'zod';

export const crmRouter = Router();

crmRouter.get('/customers', authRequired, async (req, res) => {
  const tenantId = (req as any).user.tenantId as string;
  const customers = await prisma.customer.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });
  res.json(customers);
});

const customerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  notes: z.string().optional().nullable()
});

crmRouter.post('/customers', authRequired, async (req, res) => {
  const tenantId = (req as any).user.tenantId as string;
  const parsed = customerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });
  const customer = await prisma.customer.create({ data: { ...parsed.data, tenantId } });
  res.json(customer);
});

crmRouter.put('/customers/:id', authRequired, async (req, res) => {
  const tenantId = (req as any).user.tenantId as string;
  const id = req.params.id;
  const parsed = customerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });
  const updated = await prisma.customer.update({ where: { id }, data: parsed.data });
  res.json(updated);
});

crmRouter.delete('/customers/:id', authRequired, async (req, res) => {
  const id = req.params.id;
  await prisma.customer.delete({ where: { id } });
  res.json({ ok: true });
});