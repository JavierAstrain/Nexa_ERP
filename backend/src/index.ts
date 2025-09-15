import 'dotenv/config';
import app from './server';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(PORT, () => {
  console.log(`NEXA ERP API running on http://localhost:${PORT}`);
});