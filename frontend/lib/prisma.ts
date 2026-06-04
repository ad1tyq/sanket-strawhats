// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Augment the global namespace to include 'prisma'
declare global {
  var prisma: PrismaClient | undefined;
}

// Use a singleton pattern to prevent multiple instances of Prisma Client in development
const prisma = global.prisma || new PrismaClient();

// In development, store the prisma instance on the global object
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;