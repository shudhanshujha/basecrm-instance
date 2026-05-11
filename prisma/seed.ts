const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // Clean up existing data
  await prisma.payment.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.campaignSite.deleteMany({});
  await prisma.campaign.deleteMany({});
  await prisma.site.deleteMany({});
  await prisma.vendor.deleteMany({});
  await prisma.client.deleteMany({});

  // 1. Create Vendors
  const vendor1 = await prisma.vendor.create({
    data: {
      vendorName: 'Sharma Media Pvt Ltd',
      contactPerson: 'Rakesh Sharma',
      phone: '9876543210',
      email: 'rakesh@sharmamedia.com',
      address: 'Model Town',
      city: 'Panipat',
      vendorType: 'SITE_OWNER',
    }
  });

  // 2. Create Clients
  const client1 = await prisma.client.create({
    data: {
      name: 'Reliance Retail Ltd',
      contactPerson: 'Anil Gupta',
      phone: '9988776655',
      email: 'anil.gupta@reliance.com',
      address: 'Cyber Hub',
      city: 'Gurugram',
      gstin: '06AAACR5055K1ZZ',
      clientType: 'PREMIUM',
    }
  });

  const client2 = await prisma.client.create({
    data: {
      name: 'Axis Bank Ltd',
      contactPerson: 'Sandeep Vohra',
      phone: '9988112233',
      email: 'sandeep.vohra@axisbank.com',
      address: 'Sector 18',
      city: 'Chandigarh',
      gstin: '06AAACC2415M1ZF',
      clientType: 'PREMIUM',
    }
  });

  const client3 = await prisma.client.create({
    data: {
      name: 'Havells India',
      contactPerson: 'Amit Kumar',
      phone: '8877665544',
      email: 'amit.kumar@havells.com',
      address: 'Industrial Area',
      city: 'Faridabad',
      gstin: '07AAACH1989D1Z8',
      clientType: 'REGULAR',
    }
  });

  // 3. Create Sites
  const site1 = await prisma.site.create({
    data: {
      siteName: 'GT Road Panipat KM 87',
      address: 'Opposite Skylark Tourist Resort',
      city: 'Panipat',
      district: 'Panipat',
      siteType: 'UNIPOLE',
      ownershipType: 'OWNED',
      widthFt: 20,
      heightFt: 10,
      monthlyRate: 28000,
      status: 'OCCUPIED',
      illuminated: true,
      trafficDensity: 'HIGH',
    }
  });

  const site2 = await prisma.site.create({
    data: {
      siteName: 'Sector 12, Karnal Bus Stand',
      address: 'Main Entrance Gate',
      city: 'Karnal',
      district: 'Karnal',
      siteType: 'GANTRY',
      ownershipType: 'LEASED',
      vendorId: vendor1.id,
      leaseAmount: 22000,
      widthFt: 40,
      heightFt: 10,
      monthlyRate: 45000,
      status: 'AVAILABLE',
      illuminated: true,
      trafficDensity: 'VERY_HIGH',
    }
  });

  const site3 = await prisma.site.create({
    data: {
      siteName: 'NH-44 Flyover, Ambala',
      address: 'Near City Center',
      city: 'Ambala',
      district: 'Ambala',
      siteType: 'BILLBOARD',
      ownershipType: 'OWNED',
      widthFt: 30,
      heightFt: 15,
      monthlyRate: 35000,
      status: 'OCCUPIED',
      illuminated: false,
      trafficDensity: 'HIGH',
    }
  });

  // 4. Create Campaigns
  const campaign1 = await prisma.campaign.create({
    data: {
      campaignName: 'Haryana Roads Q2',
      clientId: client1.id,
      startDate: new Date('2026-04-01'),
      endDate: new Date('2026-06-30'),
      status: 'ACTIVE',
      totalBudget: 1200000,
    }
  });

  // 5. Create Invoices
  await prisma.invoice.create({
    data: {
      invoiceNumber: 'DV-2026-0041',
      clientId: client1.id,
      campaignId: campaign1.id,
      invoiceDate: new Date('2026-04-28'),
      dueDate: new Date('2026-05-28'),
      subtotal: 320000,
      taxableAmount: 320000,
      cgstAmount: 28800,
      sgstAmount: 28800,
      igstAmount: 0,
      totalAmount: 377600,
      status: 'PAID',
      lineItems: JSON.stringify([
        { siteName: 'GT Road Panipat KM 87', amount: 320000 }
      ]),
    }
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
