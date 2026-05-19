
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

export function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient({
      log: ['error', 'warn'],
    });
  }
  return prisma;
}

// Do NOT initialize at top level
