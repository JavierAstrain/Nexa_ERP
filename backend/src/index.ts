import { createServer } from "./server";

const PORT = process.env.PORT ? Number(process.env.PORT) : 10000;

const app = createServer();
app.listen(PORT, () => {
  console.log(`NEXA ERP API running on http://localhost:${PORT}`);
});
