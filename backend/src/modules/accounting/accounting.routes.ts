import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { authRequired } from '../../lib/auth';
import { z } from 'zod';

export const accountingRouter = Router();

accountingRouter.get('/invoices', authRequired, async (req, res) => {
  const tenantId = (req as any).user.tenantId as string;
  const invoices = await prisma.invoice.findMany({ where: { tenantId }, include: { items: true, customer: true }, orderBy: { createdAt: 'desc' } });
  res.json(invoices);
});

const invoiceSchema = z.object({
  number: z.string().min(1),
  customerId: z.string().min(1),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().min(1),
    price: z.number().min(0)
  })).min(1)
});

accountingRouter.post('/invoices', authRequired, async (req, res) => {
  const tenantId = (req as any).user.tenantId as string;
  const parsed = invoiceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });

  const total = parsed.data.items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  const inv = await prisma.invoice.create({
    data: {
      number: parsed.data.number,
      tenantId,
      customerId: parsed.data.customerId,
      total,
      items: { create: parsed.data.items }
    },
    include: { items: true }
  });

  res.json(inv);
});