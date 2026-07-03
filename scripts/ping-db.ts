import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient({
    log: ['error', 'warn']
  });

  try {
    console.log('🔄 Connecting to database to keep instance active...');
    const start = Date.now();
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log(`✅ Database ping successful (latency: ${Date.now() - start}ms). Result:`, result);
  } catch (error: any) {
    console.error('❌ Database keep-alive ping failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
