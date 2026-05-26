import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding database...');
  
  const hashedPassword = await bcrypt.hash('password123', 10);
  
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
      password: hashedPassword,
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
  const site = await prisma.site.create({
    data: {
      siteName: 'Main Office',
      orgId: org.id,
      monthlyRate: 50000
    }
  });

  // 5. Create Campaign
  const campaign = await prisma.campaign.create({
    data: {
      campaignName: 'Summer Launch',
      clientId: client.id,
      orgId: org.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'ACTIVE'
    }
  });

  // 6. Create Invoice
  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2026-001',
      clientId: client.id,
      campaignId: campaign.id,
      orgId: org.id,
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      subtotal: 50000,
      taxableAmount: 50000,
      cgstAmount: 4500,
      sgstAmount: 4500,
      igstAmount: 0,
      totalAmount: 59000,
      status: 'PENDING'
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
