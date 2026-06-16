
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Initializing Super Admin ---');

  try {
    // 1. Get or Create Default Organization
    let org = await prisma.organization.findFirst();
    if (!org) {
      console.log('Creating default organization...');
      org = await prisma.organization.create({
        data: {
          name: 'BaseCRM Global',
          slug: 'base-crm'
        }
      });
    }

    const email = 'superadmin@basecrm.io';
    const password = 'super-password-123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Upsert Super Admin Profile
    const superAdmin = await prisma.profile.upsert({
      where: { email: email.toLowerCase() },
      update: {
        role: 'super_admin',
        password: hashedPassword,
        fullName: 'System Developer'
      },
      create: {
        email: email.toLowerCase(),
        password: hashedPassword,
        fullName: 'System Developer',
        role: 'super_admin',
        orgId: org.id
      }
    });

    console.log('✅ Super Admin Initialized:', superAdmin.email);
    console.log('Role:', superAdmin.role);
    
  } catch (error) {
    console.error('❌ Failed to initialize Super Admin:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
