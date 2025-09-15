import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { id: 'seed-tenant' },
    update: {},
    create: { id: 'seed-tenant', name: 'NEXA Demo Tenant' }
  });

  const password = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@nexaerp.com' },
    update: {},
    create: {
      email: 'admin@nexaerp.com',
      name: 'Admin',
      password,
      role: Role.ADMIN,
      tenantId: tenant.id
    }
  });

  const modules = ['crm', 'inventory', 'accounting', 'reports'];
  for (const m of modules) {
    await prisma.moduleToggle.upsert({
      where: { tenantId_moduleKey: { tenantId: tenant.id, moduleKey: m } },
      update: { enabled: true },
      create: { tenantId: tenant.id, moduleKey: m, enabled: true }
    });
  }

  // Demo data
  const customer = await prisma.customer.create({
    data: { name: 'Cliente Ejemplo', email: 'cliente@example.com', phone: '12345', tenantId: tenant.id }
  });

  const wh = await prisma.warehouse.create({
    data: { name: 'Principal', tenantId: tenant.id }
  });

  const product = await prisma.product.create({
    data: { name: 'Producto A', sku: 'SKU-001', price: 19990.00, tenantId: tenant.id }
  });

  await prisma.stockItem.create({
    data: { productId: product.id, warehouseId: wh.id, quantity: 25 }
  });

  await prisma.invoice.create({
    data: {
      number: 'FAC-0001',
      customerId: customer.id,
      tenantId: tenant.id,
      total: 19990.00,
      items: {
        create: [{ productId: product.id, quantity: 1, price: 19990.00 }]
      }
    }
  });

  console.log('Seed completado. Admin: admin@nexaerp.com / admin123');
}

main().finally(async () => prisma.$disconnect());