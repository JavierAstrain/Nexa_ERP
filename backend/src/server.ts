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

export const allowedOrigin = process.env.CORS_ORIGIN || '*';

const app = express();
app.use(express.json());
app.use(cors({ origin: allowedOrigin }));
app.use(helmet());
app.use(morgan('dev'));

// Health check
app.get('/health', (_req, res) => res.json({ ok: true, name: 'NEXA ERP API' }));

// Routes
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/modules', modulesRouter);
app.use('/crm', crmRouter);
app.use('/inventory', inventoryRouter);
app.use('/accounting', accountingRouter);

export default app;
import * as path from 'path';
import * as fs from 'fs';

// --- Static frontend in production ---
const frontendPath = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  // Fallback to index.html for SPA routes
  app.get('*', (req, res) => {
    // Evitar interceptar llamadas a la API ya definidas
    if (req.path.startsWith('/auth') || req.path.startsWith('/users') || req.path.startsWith('/modules') || req.path.startsWith('/crm') || req.path.startsWith('/inventory') || req.path.startsWith('/accounting') || req.path.startsWith('/health')) {
      return res.status(404).json({ error: 'Not Found' });
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}
