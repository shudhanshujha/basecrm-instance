import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding database...');
  
  // 1. Create Organization
  const org = await prisma.organization.create({
    data: {
      name: 'Test Agency',
      slug: 'test-agency',
    }
  });

  // 2. Create Profile
  await prisma.profile.create({
    data: {
      email: 'admin@test.com',
      password: 'password123',
      fullName: 'Admin User',
      role: 'admin',
      orgId: org.id
    }
  });

  // 3. Create Client
  const client = await prisma.client.create({
    data: {
      name: 'Acme Corp',
      email: 'contact@acme.com',
      phone: '1234567890',
      orgId: org.id
    }
  });

  // 4. Create Site
  await prisma.site.create({
    data: {
      siteName: 'Main Office',
      orgId: org.id,
      monthlyRate: 5000
    }
  });

  console.log('Seed completed successfully!');
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
