import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { authRouter } from './modules/auth/auth.routes';
import { userRouter } from './modules/users/user.routes';
import { modulesRouter } from './modules/modules.routes';
import { crmRouter } from './modules/crm/crm.routes';
import { inventoryRouter } from './modules/inventory/inventory.routes';
import { accountingRouter } from './modules/accounting/accounting.routes';
import * as path from 'path';
import * as fs from 'fs';

export const allowedOrigin = process.env.CORS_ORIGIN || '*';

const app = express();
app.use(express.json());
app.use(cors({ origin: allowedOrigin }));
app.use(helmet());
app.use(morgan('dev'));

// Health
app.get('/health', (_req, res) => res.json({ ok: true, name: 'NEXA ERP API' }));

// API
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/modules', modulesRouter);
app.use('/crm', crmRouter);
app.use('/inventory', inventoryRouter);
app.use('/accounting', accountingRouter);

// ==== FRONTEND STATIC (SPA) ====
const candidates = [
  path.resolve(__dirname, '../../frontend/dist'),     // /backend/dist -> /frontend/dist
  path.resolve(__dirname, '../../../frontend/dist'),  // por si cambia la profundidad
  path.resolve(process.cwd(), 'frontend/dist'),
  path.resolve(process.cwd(), '../frontend/dist'),
];

const staticRoot = candidates.find(p => fs.existsSync(p)) ?? candidates[0];
console.log('[NEXA] Serving frontend from:', staticRoot, 'exists:', fs.existsSync(staticRoot));

app.use(express.static(staticRoot, { index: 'index.html' }));

app.get('*', (req, res) => {
  // No interceptar rutas de API
  if (
    req.path.startsWith('/auth') ||
    req.path.startsWith('/users') ||
    req.path.startsWith('/modules') ||
    req.path.startsWith('/crm') ||
    req.path.startsWith('/inventory') ||
    req.path.startsWith('/accounting') ||
    req.path.startsWith('/health')
  ) {
    return res.status(404).json({ error: 'Not Found' });
  }

  const indexPath = path.join(staticRoot, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  return res.status(404).send('Frontend build not found');
});

export default app;
