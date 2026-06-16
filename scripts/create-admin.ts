import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin@basecrm.io';
  const password = 'password123'; // You can change this
  const orgName = 'BaseCRM Operations';
  const orgSlug = 'basecrm-ops';

  console.log('--- MANUAL ADMIN CREATION ---');

  try {
    // 1. Ensure Organization exists
    let org = await prisma.organization.findFirst({
      where: { name: orgName }
    });

    if (!org) {
      console.log('Creating organization...');
      org = await prisma.organization.create({
        data: {
          name: orgName,
          slug: orgSlug
        }
      });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create/Update Profile
    const profile = await prisma.profile.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: 'admin',
        orgId: org.id
      },
      create: {
        email,
        password: hashedPassword,
        fullName: 'System Administrator',
        role: 'admin',
        orgId: org.id
      }
    });

    console.log('✅ Admin user created/updated successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Org ID: ${org.id}`);
  } catch (error) {
    console.error('❌ Failed to create admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
