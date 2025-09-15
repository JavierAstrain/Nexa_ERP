import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authRequired, requireRole } from '../lib/auth';
import { z } from 'zod';

export const modulesRouter = Router();

modulesRouter.get('/', authRequired, async (req, res) => {
  const tenantId = (req as any).user.tenantId as string;
  const toggles = await prisma.moduleToggle.findMany({ where: { tenantId } });
  res.json(toggles);
});

const toggleSchema = z.object({
  moduleKey: z.string(),
  enabled: z.boolean()
});

modulesRouter.post('/toggle', authRequired, requireRole(['ADMIN', 'MANAGER']), async (req, res) => {
  const tenantId = (req as any).user.tenantId as string;
  const parsed = toggleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });
  const { moduleKey, enabled } = parsed.data;
  const updated = await prisma.moduleToggle.upsert({
    where: { tenantId_moduleKey: { tenantId, moduleKey } },
    update: { enabled },
    create: { tenantId, moduleKey, enabled }
  });
  res.json(updated);
});