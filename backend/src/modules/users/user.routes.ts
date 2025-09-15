import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { authRequired, requireRole } from '../../lib/auth';
import { z } from 'zod';

export const userRouter = Router();

userRouter.get('/', authRequired, requireRole(['ADMIN', 'MANAGER']), async (req, res) => {
  const tenantId = (req as any).user.tenantId as string;
  const users = await prisma.user.findMany({ where: { tenantId }, select: { id: true, email: true, name: true, role: true, createdAt: true } });
  res.json(users);
});

const createSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'MANAGER', 'USER'])
});

userRouter.post('/', authRequired, requireRole(['ADMIN']), async (req, res) => {
  const tenantId = (req as any).user.tenantId as string;
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });
  const bcrypt = await import('bcryptjs');
  const hash = await bcrypt.default.hash(parsed.data.password, 10);
  const user = await prisma.user.create({ data: { ...parsed.data, password: hash, tenantId } });
  res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
});