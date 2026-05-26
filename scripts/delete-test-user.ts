import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Deleting admin@test.com ---');
  try {
    const deleted = await prisma.profile.delete({
      where: { email: 'admin@test.com' }
    });
    console.log('✅ Successfully deleted user profile:', deleted.email);
  } catch (error: any) {
    console.error('❌ Failed to delete user:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
