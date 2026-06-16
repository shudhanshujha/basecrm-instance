import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  try {
    const orgCount = await prisma.organization.count();
    const profileCount = await prisma.profile.count();
    const clientCount = await prisma.client.count();
    const assetCount = await prisma.asset.count();
    const dealCount = await prisma.deal.count();

    console.log('Database Statistics:');
    console.log(`Organizations: ${orgCount}`);
    console.log(`Profiles: ${profileCount}`);
    console.log(`Clients: ${clientCount}`);
    console.log(`Assets: ${assetCount}`);
    console.log(`Deals: ${dealCount}`);

    if (profileCount > 0) {
      const firstProfile = await prisma.profile.findFirst({
        select: { id: true, email: true, role: true, orgId: true }
      });
      console.log('First Profile:', firstProfile);
    }
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
