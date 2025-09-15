// Import seguro para evitar errores de types cuando aún no se ha corrido `prisma generate`
import prismaPkg from '@prisma/client';
const { PrismaClient } = prismaPkg as any;

export const prisma = new PrismaClient();
