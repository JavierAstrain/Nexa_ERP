import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  tenantName: z.string().min(1).optional()
});

authRouter.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });

  const { email, password, name, tenantName } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ error: 'Email ya registrado' });

  const tenant = await prisma.tenant.create({ data: { name: tenantName || `${name} Company` } });
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, name, password: hash, role: 'ADMIN', tenantId: tenant.id }
  });

  // Habilitar módulos por defecto
  const modules = ['crm', 'inventory', 'accounting', 'reports'];
  for (const m of modules) {
    await prisma.moduleToggle.create({ data: { tenantId: tenant.id, moduleKey: m, enabled: true } });
  }

  const token = jwt.sign({ id: user.id, email, role: user.role, tenantId: tenant.id },
    process.env.JWT_SECRET || 'devsecret', { expiresIn: '2h' });

  res.json({ token, user: { id: user.id, email, name: user.name, role: user.role }, tenant });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: 'Credenciales inválidas' });

  const token = jwt.sign({ id: user.id, email, role: user.role, tenantId: user.tenantId },
    process.env.JWT_SECRET || 'devsecret', { expiresIn: '2h' });

  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});