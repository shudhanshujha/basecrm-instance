import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding unique generic CRM database...');
  
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // 1. Create Organization
  const org = await prisma.organization.create({
    data: {
      name: 'Apex Dynamics Group',
      slug: 'apex-dynamics',
      taxMode: 'NONE'
    }
  });

  // 2. Create Profile
  await prisma.profile.create({
    data: {
      email: 'admin@apexdynamics.io',
      password: hashedPassword,
      fullName: 'Chief Operations Officer',
      role: 'admin',
      orgId: org.id
    }
  });

  // 3. Create Client
  const client = await prisma.client.create({
    data: {
      name: 'Nova Solutions Ltd',
      email: 'operations@novasolutions.io',
      phone: '+1 888-555-0123',
      city: 'San Francisco',
      orgId: org.id
    }
  });

  // 4. Create Asset
  const asset = await prisma.asset.create({
    data: {
      name: 'High-Performance Computing Node X1',
      category: 'Infrastructure',
      description: 'Dedicated virtualized resource for enterprise processing.',
      orgId: org.id,
      status: 'ACTIVE'
    }
  });

  // 5. Create Deal
  const deal = await prisma.deal.create({
    data: {
      title: 'Digital Transformation Phase II',
      clientId: client.id,
      orgId: org.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      value: 1250000,
      status: 'ACTIVE',
      activityLogs: {
        create: {
          assetId: asset.id,
          activityType: 'PROVISIONING',
          description: 'Primary compute asset allocated to transformation pipeline.',
          orgId: org.id
        }
      }
    }
  });

  // 6. Create Invoice
  await prisma.invoice.create({
    data: {
      invoiceNumber: 'TXN-778-2026-991',
      clientId: client.id,
      dealId: deal.id,
      orgId: org.id,
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      subtotal: 450000,
      taxableAmount: 450000,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 0,
      totalAmount: 450000,
      status: 'PENDING',
      notes: 'Initial Milestone: Infrastructure Provisioning'
    }
  });

  console.log('Unique data seed completed successfully!');
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
