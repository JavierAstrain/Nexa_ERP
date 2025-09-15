import express from "express";
import path from "path";
import customersRouter from "./modules/customers";
import productsRouter from "./modules/products";
import invoicesRouter from "./modules/invoices";

export function createServer() {
  const app = express();
  app.use(express.json());

  // API
  app.get("/health", (_, res) => res.json({ ok: true }));
  app.use("/api/customers", customersRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/invoices", invoicesRouter);

  // FRONT estático (copiado a backend/public en el build)
  const publicDir = path.join(__dirname, "../public");
  console.log("[NEXA] Serving frontend from:", publicDir, "exists:", true);
  app.use(express.static(publicDir));

  // SPA fallback
  app.get("*", (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });

  return app;
}
